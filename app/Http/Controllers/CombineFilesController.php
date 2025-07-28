<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;
use App\Models\DashboardWidget;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class CombineFilesController extends Controller
{
    public function index()
    {
        $uploadedFiles = UploadedFile::where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->get();

        $connectedWidgets = DashboardWidget::with('uploadedFile')
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get();

        return Inertia::render('CombineFiles', [
            'uploadedFiles' => $uploadedFiles,
            'connectedWidgets' => $connectedWidgets,
        ]);
    }

    public function combineFiles(Request $request)
    {
        $request->validate([
            'selectedFiles' => 'required|array|min:2',
            'selectedFiles.*' => 'exists:uploaded_files,id',
            'combinedFileName' => 'required|string|max:255',
        ]);

        try {
            $selectedFiles = UploadedFile::whereIn('id', $request->selectedFiles)
                ->where('status', 'completed')
                ->get();

            if ($selectedFiles->count() < 2) {
                return response()->json([
                    'error' => 'Please select at least 2 completed files to combine'
                ], 400);
            }

            // Create combined spreadsheet
            $combinedSpreadsheet = new Spreadsheet();
            $combinedSheet = $combinedSpreadsheet->getActiveSheet();
            $currentRow = 1;
            $allHeaders = [];
            $combinedData = [];

            foreach ($selectedFiles as $file) {
                $data = $file->processed_data;

                if (!$data || !isset($data['headers']) || !isset($data['data'])) {
                    continue;
                }

                // Add file source column
                $headers = array_merge(['Source File'], $data['headers']);
                $allHeaders = array_unique(array_merge($allHeaders, $headers));

                // Add data with source file info
                foreach ($data['data'] as $row) {
                    $combinedRow = [$file->original_filename];
                    foreach ($data['headers'] as $header) {
                        $combinedRow[] = $row[$header] ?? '';
                    }
                    $combinedData[] = $combinedRow;
                }
            }

            // Set headers
            $combinedSheet->fromArray([$allHeaders], null, 'A1');

            // Set data
            $rowIndex = 2;
            foreach ($combinedData as $row) {
                $colIndex = 1;
                foreach ($allHeaders as $header) {
                    $value = '';
                    if ($header === 'Source File') {
                        $value = $row[0] ?? '';
                    } else {
                        // Find the correct index for this header in the combined data
                        $headerIndex = array_search($header, $allHeaders);
                        $value = $row[$headerIndex] ?? '';
                    }
                    $combinedSheet->setCellValue(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex) . $rowIndex, $value);
                    $colIndex++;
                }
                $rowIndex++;
            }

            // Save combined file
            $filename = time() . '_' . $request->combinedFileName . '.xlsx';
            $filePath = 'uploads/' . $filename;

            $writer = new Xlsx($combinedSpreadsheet);
            $writer->save(storage_path('app/public/' . $filePath));

            // Create new uploaded file record
            $combinedFile = UploadedFile::create([
                'filename' => $filename,
                'original_filename' => $request->combinedFileName . '.xlsx',
                'file_path' => $filePath,
                'file_type' => 'xlsx',
                'file_size' => Storage::disk('public')->size($filePath),
                'status' => 'completed',
                'processed_data' => [
                    'headers' => $allHeaders,
                    'data' => array_map(function($row) use ($allHeaders) {
                        $dataRow = [];
                        foreach ($allHeaders as $index => $header) {
                            $dataRow[$header] = $row[$index] ?? '';
                        }
                        return $dataRow;
                    }, $combinedData),
                    'total_rows' => count($combinedData),
                    'total_columns' => count($allHeaders),
                ],
                'error_message' => null,
            ]);

            // Connect the combined file to dashboard
            $this->createWidgetsForCombinedFile($combinedFile);

            Log::info('Files combined successfully: ' . $request->combinedFileName);

            return response()->json([
                'success' => true,
                'message' => 'Files combined successfully and connected to dashboard',
                'combinedFile' => $combinedFile
            ]);

        } catch (\Exception $e) {
            Log::error('Error combining files: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error combining files: ' . $e->getMessage()
            ], 500);
        }
    }

    private function createWidgetsForCombinedFile($file)
    {
        $widgets = [
            [
                'widget_type' => 'kpi',
                'widget_name' => 'Combined Data Overview',
                'widget_config' => ['metric' => 'total_rows'],
                'display_order' => 1,
            ],
            [
                'widget_type' => 'bar_chart',
                'widget_name' => 'Combined Data Analysis',
                'widget_config' => ['chart_type' => 'bar'],
                'display_order' => 2,
            ],
            [
                'widget_type' => 'pie_chart',
                'widget_name' => 'Data Distribution',
                'widget_config' => ['chart_type' => 'pie'],
                'display_order' => 3,
            ],
            [
                'widget_type' => 'table',
                'widget_name' => 'Combined Data Table',
                'widget_config' => ['table_type' => 'combined'],
                'display_order' => 4,
            ],
        ];

        foreach ($widgets as $widget) {
            DashboardWidget::updateOrCreate(
                [
                    'widget_type' => $widget['widget_type'],
                    'widget_name' => $widget['widget_name'],
                ],
                [
                    'widget_config' => $widget['widget_config'],
                    'uploaded_file_id' => $file->id,
                    'is_active' => true,
                    'display_order' => $widget['display_order'],
                ]
            );
        }
    }
}
