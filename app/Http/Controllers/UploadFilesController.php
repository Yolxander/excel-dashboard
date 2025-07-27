<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class UploadFilesController extends Controller
{
    public function index()
    {
        $uploadedFiles = UploadedFile::orderBy('created_at', 'desc')->get();

        return Inertia::render('UploadFiles', [
            'uploadedFiles' => $uploadedFiles
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $filename = time() . '_' . $originalName;
        $filePath = $file->storeAs('uploads', $filename, 'public');
        $fileType = $file->getClientOriginalExtension();

        $uploadedFile = UploadedFile::create([
            'filename' => $filename,
            'original_filename' => $originalName,
            'file_path' => $filePath,
            'file_type' => $fileType,
            'file_size' => $file->getSize(),
            'status' => 'processing',
        ]);

        // Process the file in the background
        $this->processExcelFile($uploadedFile);

        return response()->json([
            'message' => 'File uploaded successfully',
            'file' => $uploadedFile
        ]);
    }

    private function processExcelFile(UploadedFile $uploadedFile)
    {
        try {
            $filePath = Storage::disk('public')->path($uploadedFile->file_path);

            $spreadsheet = IOFactory::load($filePath);
            $worksheet = $spreadsheet->getActiveSheet();
            $data = $worksheet->toArray();

            // Remove empty rows
            $data = array_filter($data, function($row) {
                return !empty(array_filter($row, function($cell) {
                    return $cell !== null && $cell !== '';
                }));
            });

            // Get headers (first row)
            $headers = array_shift($data);

            // Process data rows
            $processedData = [];
            foreach ($data as $row) {
                $rowData = [];
                foreach ($headers as $index => $header) {
                    $rowData[$header] = $row[$index] ?? null;
                }
                $processedData[] = $rowData;
            }

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

        } catch (\Exception $e) {
            $uploadedFile->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
        }
    }

    public function destroy($id)
    {
        $file = UploadedFile::findOrFail($id);

        // Delete the physical file
        Storage::disk('public')->delete($file->file_path);

        // Delete the database record
        $file->delete();

        return response()->json(['message' => 'File deleted successfully']);
    }
}
