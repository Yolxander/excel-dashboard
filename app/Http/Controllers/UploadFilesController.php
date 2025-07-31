<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

use App\Services\FileEncryptionService;

class UploadFilesController extends Controller
{
        public function index()
    {
        Log::info('Upload files index page accessed', [
            'user_id' => Auth::id(),
            'timestamp' => now()->toISOString()
        ]);

        // Use pagination to prevent memory issues with large datasets
        // Only select necessary columns to reduce memory usage
        $uploadedFiles = UploadedFile::where('user_id', Auth::id())
            ->select([
                'id',
                'filename',
                'original_filename',
                'file_type',
                'file_size',
                'status',
                'created_at',
                'is_encrypted',
                'processed_data',
                'error_message'
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(50); // Limit to 50 files per page

        Log::info('Retrieved uploaded files for user with pagination', [
            'user_id' => Auth::id(),
            'total_files' => $uploadedFiles->total(),
            'current_page' => $uploadedFiles->currentPage(),
            'per_page' => $uploadedFiles->perPage(),
            'files_on_current_page' => $uploadedFiles->count(),
            'memory_usage' => memory_get_usage(true) / 1024 / 1024 . ' MB'
        ]);

        return Inertia::render('UploadFiles', [
            'uploadedFiles' => $uploadedFiles,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function store(Request $request)
    {
        Log::info('File upload request received', [
            'user_id' => Auth::id(),
            'has_file' => $request->hasFile('file'),
            'file_count' => $request->file('file') ? 1 : 0,
            'request_size' => $request->header('Content-Length'),
            'timestamp' => now()->toISOString()
        ]);

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240', // 10MB max
        ]);

        try {
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $filename = time() . '_' . $originalName;
            $fileType = $file->getClientOriginalExtension();

            Log::info('File validation passed, starting upload process', [
                'original_name' => $originalName,
                'file_size' => $file->getSize(),
                'file_type' => $fileType,
                'mime_type' => $file->getMimeType(),
                'user_id' => Auth::id()
            ]);

            // Encrypt and store the file
            Log::info('Initiating file encryption and storage');
            $encryptionService = new FileEncryptionService();
            $encryptedFileData = $encryptionService->encryptAndStore($file, 'encrypted-files');

            Log::info('File encryption completed, creating database record', [
                'encrypted_filename' => $encryptedFileData['encrypted_filename'],
                's3_path' => $encryptedFileData['file_path'],
                'original_filename' => $encryptedFileData['original_filename']
            ]);

            $uploadedFile = UploadedFile::create([
                'user_id' => Auth::id(),
                'filename' => $filename,
                'encrypted_filename' => $encryptedFileData['encrypted_filename'],
                'original_filename' => $originalName,
                'file_path' => $encryptedFileData['file_path'],
                'encrypted_file_path' => $encryptedFileData['file_path'],
                'file_type' => $fileType,
                'file_size' => $file->getSize(),
                'status' => 'processing',
                'is_encrypted' => true,
                'encryption_key_id' => 'app_key', // Using Laravel's app key for encryption
            ]);

            Log::info('Database record created successfully', [
                'file_id' => $uploadedFile->id,
                'user_id' => $uploadedFile->user_id,
                'status' => $uploadedFile->status
            ]);

            // Process the file immediately
            Log::info('Starting file processing', [
                'file_id' => $uploadedFile->id,
                'original_filename' => $uploadedFile->original_filename
            ]);
            $this->processExcelFile($uploadedFile);



            Log::info('File upload process completed successfully', [
                'file_id' => $uploadedFile->id,
                'original_filename' => $uploadedFile->original_filename,
                'final_status' => $uploadedFile->fresh()->status
            ]);

            // Return a redirect to refresh the page with the new data
            return redirect()->back()->with('success', 'File uploaded, encrypted, and processed successfully!');

        } catch (\Exception $e) {
            Log::error('File upload failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'original_filename' => $request->file('file') ? $request->file('file')->getClientOriginalName() : 'unknown',
                'file_size' => $request->file('file') ? $request->file('file')->getSize() : 0,
                'stack_trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Upload failed: ' . $e->getMessage());
        }
    }

    private function processExcelFile(UploadedFile $uploadedFile)
    {
        try {
            Log::info('Starting Excel file processing', [
                'file_id' => $uploadedFile->id,
                'original_filename' => $uploadedFile->original_filename,
                'file_type' => $uploadedFile->file_type,
                'file_size' => $uploadedFile->file_size
            ]);

            // Decrypt the file for processing
            Log::info('Decrypting file for processing');
            $encryptionService = new FileEncryptionService();
            $decryptedFile = $encryptionService->decryptAndRetrieve(
                $uploadedFile->encrypted_file_path,
                $uploadedFile->original_filename
            );

            Log::info('File decrypted successfully, loading with PhpSpreadsheet', [
                'temp_path' => $decryptedFile['temp_path'],
                'content_size' => strlen($decryptedFile['content'])
            ]);

            $spreadsheet = IOFactory::load($decryptedFile['temp_path']);
            $worksheet = $spreadsheet->getActiveSheet();
            $data = $worksheet->toArray();

            Log::info('Excel file loaded successfully', [
                'file_id' => $uploadedFile->id,
                'raw_data_rows' => count($data),
                'worksheet_name' => $worksheet->getTitle()
            ]);

            // Remove empty rows
            $originalRowCount = count($data);
            $data = array_filter($data, function($row) {
                return !empty(array_filter($row, function($cell) {
                    return $cell !== null && $cell !== '';
                }));
            });

            Log::info('Data filtered for empty rows', [
                'file_id' => $uploadedFile->id,
                'original_rows' => $originalRowCount,
                'filtered_rows' => count($data),
                'removed_rows' => $originalRowCount - count($data)
            ]);

            if (empty($data)) {
                Log::warning('No data found in file after filtering', [
                    'file_id' => $uploadedFile->id,
                    'original_filename' => $uploadedFile->original_filename
                ]);
                throw new \Exception('No data found in file');
            }

            // Get headers (first row)
            $headers = array_shift($data);

            Log::info('Headers extracted from file', [
                'file_id' => $uploadedFile->id,
                'header_count' => count($headers),
                'headers' => $headers
            ]);

            // Process data rows
            $processedData = [];
            foreach ($data as $rowIndex => $row) {
                $rowData = [];
                foreach ($headers as $index => $header) {
                    $rowData[$header] = $row[$index] ?? null;
                }
                $processedData[] = $rowData;
            }

            Log::info('Data processing completed', [
                'file_id' => $uploadedFile->id,
                'processed_rows' => count($processedData),
                'header_count' => count($headers)
            ]);

            // Update the file with processed data
            $updateData = [
                'processed_data' => [
                    'headers' => $headers,
                    'data' => $processedData,
                    'total_rows' => count($processedData),
                    'total_columns' => count($headers),
                ],
                'status' => 'completed'
            ];

            Log::info('Updating file record with processed data', [
                'file_id' => $uploadedFile->id,
                'update_data' => $updateData
            ]);

            $uploadedFile->update($updateData);

            Log::info('File processing completed successfully', [
                'file_id' => $uploadedFile->id,
                'original_filename' => $uploadedFile->original_filename,
                'final_status' => $uploadedFile->fresh()->status,
                'total_rows' => count($processedData),
                'total_columns' => count($headers)
            ]);

        } catch (\Exception $e) {
            Log::error('File processing failed', [
                'error' => $e->getMessage(),
                'file_id' => $uploadedFile->id,
                'original_filename' => $uploadedFile->original_filename,
                'stack_trace' => $e->getTraceAsString()
            ]);

            $uploadedFile->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);

            Log::info('File status updated to failed', [
                'file_id' => $uploadedFile->id,
                'error_message' => $e->getMessage()
            ]);
        }
    }

    public function destroy($id)
    {
        Log::info('File deletion request received', [
            'file_id' => $id,
            'user_id' => Auth::id(),
            'timestamp' => now()->toISOString()
        ]);

        $file = UploadedFile::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        Log::info('File found for deletion', [
            'file_id' => $file->id,
            'original_filename' => $file->original_filename,
            'is_encrypted' => $file->is_encrypted,
            'encrypted_file_path' => $file->encrypted_file_path
        ]);

        // Delete the encrypted file from S3
        if ($file->is_encrypted && $file->encrypted_file_path) {
            Log::info('Deleting encrypted file from S3', [
                'file_id' => $file->id,
                'encrypted_file_path' => $file->encrypted_file_path
            ]);

            $encryptionService = new FileEncryptionService();
            $deleteResult = $encryptionService->deleteEncryptedFile($file->encrypted_file_path);

            Log::info('S3 deletion result', [
                'file_id' => $file->id,
                'delete_result' => $deleteResult,
                'encrypted_file_path' => $file->encrypted_file_path
            ]);
        } else {
            Log::warning('File not encrypted or no encrypted path found', [
                'file_id' => $file->id,
                'is_encrypted' => $file->is_encrypted,
                'encrypted_file_path' => $file->encrypted_file_path
            ]);
        }

        // Delete the database record
        $deleted = $file->delete();

        Log::info('Database record deletion result', [
            'file_id' => $id,
            'deleted' => $deleted
        ]);

        // Check if it's an AJAX request
        if (request()->expectsJson()) {
            Log::info('Returning JSON response for file deletion', [
                'file_id' => $id,
                'deleted' => $deleted
            ]);
            return response()->json(['message' => 'File deleted successfully']);
        }

        Log::info('File deletion completed successfully', [
            'file_id' => $id,
            'original_filename' => $file->original_filename,
            'user_id' => Auth::id()
        ]);

        return redirect()->back()->with('success', 'File deleted successfully');
    }
}
