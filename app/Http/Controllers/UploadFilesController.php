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
use App\Services\OnboardingService;

class UploadFilesController extends Controller
{
        public function index()
    {
        $uploadedFiles = UploadedFile::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        // Get onboarding data
        $user = Auth::user();
        $onboardingData = OnboardingService::getOnboardingData($user);

        return Inertia::render('UploadFiles', [
            'uploadedFiles' => $uploadedFiles,
            'success' => session('success'),
            'error' => session('error'),
            'onboardingData' => $onboardingData,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240', // 10MB max
        ]);

        try {
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $filename = time() . '_' . $originalName;
            $filePath = $file->storeAs('uploads', $filename, 'public');
            $fileType = $file->getClientOriginalExtension();

            $uploadedFile = UploadedFile::create([
                'user_id' => Auth::id(),
                'filename' => $filename,
                'original_filename' => $originalName,
                'file_path' => $filePath,
                'file_type' => $fileType,
                'file_size' => $file->getSize(),
                'status' => 'processing',
            ]);

                    // Process the file immediately
        $this->processExcelFile($uploadedFile);

        // Check onboarding progress after file upload
        $user = Auth::user();
        OnboardingService::checkAndMarkSteps($user);

        // Return a redirect to refresh the page with the new data
        return redirect()->back()->with('success', 'File uploaded and processed successfully!');

        } catch (\Exception $e) {
            Log::error('File upload failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Upload failed: ' . $e->getMessage());
        }
    }

    private function processExcelFile(UploadedFile $uploadedFile)
    {
        try {
            Log::info('Processing file: ' . $uploadedFile->original_filename);

            $filePath = Storage::disk('public')->path($uploadedFile->file_path);

            if (!file_exists($filePath)) {
                throw new \Exception('File not found at path: ' . $filePath);
            }

            $spreadsheet = IOFactory::load($filePath);
            $worksheet = $spreadsheet->getActiveSheet();
            $data = $worksheet->toArray();

            Log::info('Raw data rows: ' . count($data));

            // Remove empty rows
            $data = array_filter($data, function($row) {
                return !empty(array_filter($row, function($cell) {
                    return $cell !== null && $cell !== '';
                }));
            });

            Log::info('Filtered data rows: ' . count($data));

            if (empty($data)) {
                throw new \Exception('No data found in file');
            }

            // Get headers (first row)
            $headers = array_shift($data);

            Log::info('Headers found: ' . implode(', ', $headers));

            // Process data rows
            $processedData = [];
            foreach ($data as $row) {
                $rowData = [];
                foreach ($headers as $index => $header) {
                    $rowData[$header] = $row[$index] ?? null;
                }
                $processedData[] = $rowData;
            }

            Log::info('Processed data rows: ' . count($processedData));

            // Update the file with processed data
            $uploadedFile->update([
                'processed_data' => [
                    'headers' => $headers,
                    'data' => $processedData,
                    'total_rows' => count($processedData),
                    'total_columns' => count($headers),
                ],
                'status' => 'completed'
            ]);

            Log::info('File processing completed successfully: ' . $uploadedFile->original_filename);

        } catch (\Exception $e) {
            Log::error('File processing failed: ' . $e->getMessage());
            $uploadedFile->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
        }
    }

    public function destroy($id)
    {
        $file = UploadedFile::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Delete the physical file
        Storage::disk('public')->delete($file->file_path);

        // Delete the database record
        $file->delete();

        // Check if it's an AJAX request
        if (request()->expectsJson()) {
            return response()->json(['message' => 'File deleted successfully']);
        }

        return redirect()->back()->with('success', 'File deleted successfully');
    }
}
