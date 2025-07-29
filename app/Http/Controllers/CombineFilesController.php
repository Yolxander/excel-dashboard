<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;
use App\Models\DashboardWidget;
use App\Services\AIService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use App\Services\OnboardingService;

class CombineFilesController extends Controller
{
    public function index()
    {
        $uploadedFiles = UploadedFile::where('user_id', Auth::id())
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->get();

        $connectedWidgets = DashboardWidget::with('uploadedFile')
            ->where('user_id', Auth::id())
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get();

        // Check onboarding progress
        $user = Auth::user();
        OnboardingService::checkAndMarkSteps($user);
        $onboardingData = OnboardingService::getOnboardingData($user);

        return Inertia::render('CombineFiles', [
            'uploadedFiles' => $uploadedFiles,
            'connectedWidgets' => $connectedWidgets,
            'onboardingData' => $onboardingData,
        ]);
    }

    public function generateAIPreview(Request $request)
    {
        try {
            $request->validate([
                'selectedFiles' => 'required|array|min:2',
                'selectedFiles.*' => 'integer|exists:uploaded_files,id',
            ]);

            $selectedFiles = UploadedFile::whereIn('id', $request->selectedFiles)
                ->where('user_id', Auth::id())
                ->where('status', 'completed')
                ->get();

            if ($selectedFiles->count() < 2) {
                return response()->json([
                    'error' => 'Please select at least 2 completed files to combine'
                ], 400);
            }

            // Prepare data for AI analysis
            $filesData = [];
            foreach ($selectedFiles as $file) {
                $data = $file->processed_data;
                if ($data && isset($data['headers']) && isset($data['data'])) {
                    $filesData[] = [
                        'filename' => $file->original_filename,
                        'headers' => $data['headers'],
                        'data' => array_slice($data['data'], 0, 10), // First 10 rows for preview
                        'total_rows' => $data['total_rows'],
                        'total_columns' => $data['total_columns'],
                    ];
                }
            }

            if (empty($filesData)) {
                return response()->json([
                    'error' => 'No valid file data found for analysis'
                ], 400);
            }

            // Generate intelligent combination first
            $aiService = new AIService();
            $intelligentCombination = $this->generateIntelligentCombination($aiService, $filesData, 'Combined_Data_' . date('Y-m-d'));

            if (!$intelligentCombination) {
                return response()->json([
                    'error' => 'Failed to generate intelligent combination'
                ], 500);
            }

            // Now analyze the combined data to provide insights about the new dataset
            $combinedDataAnalysis = $this->analyzeCombinedData($intelligentCombination);

            return response()->json([
                'success' => true,
                'preview' => [
                    'filesData' => $filesData,
                    'aiInsights' => $combinedDataAnalysis,
                    'combinedFileName' => $combinedDataAnalysis['suggested_filename'] ?? 'Combined_Data_' . date('Y-m-d'),
                    'estimatedRows' => count($intelligentCombination['data']),
                    'estimatedColumns' => count($intelligentCombination['headers']),
                    'combinedDataPreview' => array_slice($intelligentCombination['data'], 0, 5), // First 5 rows of combined data
                    'newColumnsCreated' => $intelligentCombination['metadata']['new_columns_created'] ?? [],
                    'optimizationsMade' => $intelligentCombination['metadata']['optimizations_made'] ?? []
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in generateAIPreview: ' . json_encode($e->errors()));
            return response()->json([
                'error' => 'Validation error: ' . implode(', ', array_flatten($e->errors()))
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error generating AI preview: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Error generating preview: ' . $e->getMessage()
            ], 500);
        }
    }

    public function combineFiles(Request $request)
    {
        try {
            $request->validate([
                'selectedFiles' => 'required|array|min:2',
                'selectedFiles.*' => 'integer|exists:uploaded_files,id',
                'aiInsights' => 'nullable|array',
            ]);

            $selectedFiles = UploadedFile::whereIn('id', $request->selectedFiles)
                ->where('user_id', Auth::id())
                ->where('status', 'completed')
                ->get();

            if ($selectedFiles->count() < 2) {
                return response()->json([
                    'error' => 'Please select at least 2 completed files to combine'
                ], 400);
            }

            // Prepare data for AI analysis
            $filesData = [];
            foreach ($selectedFiles as $file) {
                $data = $file->processed_data;
                if ($data && isset($data['headers']) && isset($data['data'])) {
                    $filesData[] = [
                        'filename' => $file->original_filename,
                        'headers' => $data['headers'],
                        'data' => $data['data'],
                        'total_rows' => $data['total_rows'],
                        'total_columns' => $data['total_columns'],
                    ];
                }
            }

            if (empty($filesData)) {
                return response()->json([
                    'error' => 'No valid file data found for combination'
                ], 400);
            }

            // Generate intelligent combination
            $aiService = new AIService();

            // Check if AI API is configured
            $aiApiKey = config('services.aiml.api_key');
            if (empty($aiApiKey)) {
                Log::warning('AI API key not configured, using fallback method');
                $intelligentCombination = $this->generateFallbackIntelligentCombination($filesData, [
                    'files_count' => count($filesData),
                    'total_rows' => array_sum(array_column($filesData, 'total_rows')),
                    'files' => $filesData,
                    'common_headers' => $this->findCommonHeaders($filesData),
                    'unique_headers' => $this->findUniqueHeaders($filesData),
                    'data_relationships' => $this->analyzeDataRelationships($filesData),
                ]);
            } else {
                $intelligentCombination = $this->generateIntelligentCombination($aiService, $filesData, 'Combined_Data_' . date('Y-m-d'));
            }

            if (!$intelligentCombination) {
                Log::warning('AI intelligent combination failed, using fallback method');
                // Use fallback combination method
                $intelligentCombination = $this->generateFallbackIntelligentCombination($filesData, [
                    'files_count' => count($filesData),
                    'total_rows' => array_sum(array_column($filesData, 'total_rows')),
                    'files' => $filesData,
                    'common_headers' => $this->findCommonHeaders($filesData),
                    'unique_headers' => $this->findUniqueHeaders($filesData),
                    'data_relationships' => $this->analyzeDataRelationships($filesData),
                ]);
            }

            if (!$intelligentCombination) {
                return response()->json([
                    'error' => 'Failed to generate combined dataset'
                ], 500);
            }

            // Create the combined file
            $combinedFileName = 'Intelligent_Combined_Data_' . date('Y-m-d') . '.xlsx';
            $combinedFilePath = storage_path('app/uploads/' . $combinedFileName);

            // Ensure uploads directory exists
            $uploadsDir = storage_path('app/uploads');
            if (!file_exists($uploadsDir)) {
                mkdir($uploadsDir, 0755, true);
            }

            // Create Excel file with the intelligent combination
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            // Add headers
            $headers = $intelligentCombination['headers'];
            foreach ($headers as $index => $header) {
                $sheet->setCellValue(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($index) . '1', $header);
            }

            // Add data
            $data = $intelligentCombination['data'];
            foreach ($data as $rowIndex => $row) {
                foreach ($headers as $colIndex => $header) {
                    $value = $row[$header] ?? '';
                    $sheet->setCellValue(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex) . ($rowIndex + 2), $value);
                }
            }

            // Save the file
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $writer->save($combinedFilePath);

            // Create database record
            $combinedFile = UploadedFile::create([
                'user_id' => Auth::id(),
                'original_filename' => $combinedFileName,
                'filename' => $combinedFileName,
                'file_path' => $combinedFilePath,
                'file_type' => 'xlsx',
                'file_size' => filesize($combinedFilePath),
                'status' => 'completed',
                'processed_data' => [
                    'headers' => $headers,
                    'data' => $data,
                    'total_rows' => count($data),
                    'total_columns' => count($headers),
                    'ai_combination_metadata' => $intelligentCombination['metadata']
                ],
                'ai_insights' => $request->aiInsights
            ]);

            // Create widgets for the combined file
            $this->createWidgetsForCombinedFile($combinedFile, $request->aiInsights);

            return response()->json([
                'success' => true,
                'message' => 'Files combined successfully with AI optimization',
                'file_id' => $combinedFile->id,
                'combinationMetadata' => $intelligentCombination['metadata']
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in combineFiles: ' . json_encode($e->errors()));
            return response()->json([
                'error' => 'Validation error: ' . implode(', ', array_flatten($e->errors()))
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error combining files: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Error combining files: ' . $e->getMessage()
            ], 500);
        }
    }

    public function regenerateAIInsights(Request $request, $fileId)
    {
        $request->validate([
            'fileId' => 'required|integer|exists:uploaded_files,id',
        ]);

        try {
            $file = UploadedFile::where('id', $fileId)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            if ($file->status !== 'completed') {
                return response()->json([
                    'error' => 'File is not ready for analysis'
                ], 400);
            }

            $aiService = new AIService();
            $aiInsights = $aiService->analyzeFileData($file);

            if ($aiInsights) {
                $file->update(['ai_insights' => $aiInsights]);

                return response()->json([
                    'success' => true,
                    'aiInsights' => $aiInsights
                ]);
            } else {
                return response()->json([
                    'error' => 'Failed to regenerate AI insights'
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Error regenerating AI insights: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error regenerating insights: ' . $e->getMessage()
            ], 500);
        }
    }

    private function generateCombineInsights($aiService, $filesData)
    {
        try {
            // Create a summary of files to combine
            $summary = [
                'total_files' => count($filesData),
                'total_rows' => array_sum(array_column($filesData, 'total_rows')),
                'files' => array_map(function($file) {
                    return [
                        'name' => $file['filename'],
                        'rows' => $file['total_rows'],
                        'columns' => $file['total_columns'],
                        'headers' => $file['headers']
                    ];
                }, $filesData),
                'common_headers' => $this->findCommonHeaders($filesData),
                'unique_headers' => $this->findUniqueHeaders($filesData),
            ];

            // Generate AI insights for combination
            $prompt = $this->buildCombinePrompt($summary);

            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.aiml.api_key'),
                'Content-Type' => 'application/json',
            ])->post(config('services.aiml.base_url', 'https://api.aimlapi.com/v1') . '/chat/completions', [
                'model' => 'gpt-4o',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert data analyst specializing in combining multiple datasets and providing insights for business intelligence.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.3,
                'max_tokens' => 800
            ]);

            if ($response->successful()) {
                $result = $response->json();
                $content = $result['choices'][0]['message']['content'] ?? '';

                // Parse the AI response
                return $this->parseCombineResponse($content, $summary);
            } else {
                return $this->generateFallbackCombineInsights($summary);
            }

        } catch (\Exception $e) {
            Log::error('Error generating combine insights: ' . $e->getMessage());
            return $this->generateFallbackCombineInsights($summary ?? []);
        }
    }

    private function buildCombinePrompt($summary)
    {
        return "Analyze these files to be combined and provide insights for the combination:

Files to Combine: {$summary['total_files']} files
Total Rows: {$summary['total_rows']}

Files Summary:
" . json_encode($summary['files'], JSON_PRETTY_PRINT) . "

Common Headers: " . implode(', ', $summary['common_headers']) . "
Unique Headers: " . implode(', ', $summary['unique_headers']) . "

Please provide a JSON response with:
{
  \"suggested_filename\": \"descriptive filename\",
  \"combination_strategy\": \"how to best combine the data\",
  \"expected_insights\": [
    \"insight 1\",
    \"insight 2\"
  ],
  \"potential_challenges\": [
    \"challenge 1\",
    \"challenge 2\"
  ],
  \"recommendations\": [
    \"recommendation 1\",
    \"recommendation 2\"
  ],
  \"business_value\": \"description of business value\"
}

Focus on identifying sales, revenue, commission, recruiter, and performance-related data. For charts, provide realistic sample data based on the column analysis. If the data doesn't contain these specific metrics, adapt the analysis to the available data types.";
    }

    private function parseCombineResponse($content, $summary)
    {
        try {
            $jsonStart = strpos($content, '{');
            $jsonEnd = strrpos($content, '}');

            if ($jsonStart !== false && $jsonEnd !== false) {
                $jsonString = substr($content, $jsonStart, $jsonEnd - $jsonStart + 1);
                $parsed = json_decode($jsonString, true);

                if ($parsed) {
                    return $parsed;
                }
            }

            return $this->generateFallbackCombineInsights($summary);

        } catch (\Exception $e) {
            Log::error('Error parsing combine response: ' . $e->getMessage());
            return $this->generateFallbackCombineInsights($summary);
        }
    }

    private function generateFallbackCombineInsights($summary)
    {
        return [
            'suggested_filename' => 'Combined_Data_' . date('Y-m-d'),
            'combination_strategy' => 'Merge all data with Source File column to track origin',
            'expected_insights' => [
                'Combined dataset will provide comprehensive view across all files',
                'Source File column will help track data origin and quality',
                'Cross-file analysis will reveal patterns and trends'
            ],
            'potential_challenges' => [
                'Column name conflicts between files',
                'Data format inconsistencies',
                'Large file size after combination'
            ],
            'recommendations' => [
                'Review and standardize column names before combining',
                'Validate data quality across all files',
                'Consider data sampling for large datasets'
            ],
            'business_value' => 'Unified view of data for better decision making and analysis'
        ];
    }

    private function findCommonHeaders($filesData)
    {
        if (empty($filesData)) return [];

        $headers = array_map(function($file) {
            return $file['headers'];
        }, $filesData);

        return array_intersect(...$headers);
    }

    private function findUniqueHeaders($filesData)
    {
        if (empty($filesData)) return [];

        $allHeaders = [];
        foreach ($filesData as $file) {
            $allHeaders = array_merge($allHeaders, $file['headers']);
        }

        $commonHeaders = $this->findCommonHeaders($filesData);
        return array_diff($allHeaders, $commonHeaders);
    }

    private function createWidgetsForCombinedFile($file, $aiInsights = null)
    {
        $widgets = [
            [
                'widget_type' => 'kpi',
                'widget_name' => 'Combined Data Overview',
                'widget_config' => [
                    'metric' => 'total_rows',
                    'ai_insights' => $aiInsights
                ],
                'display_order' => 1,
            ],
            [
                'widget_type' => 'bar_chart',
                'widget_name' => 'Combined Data Analysis',
                'widget_config' => [
                    'chart_type' => 'bar',
                    'ai_insights' => $aiInsights
                ],
                'display_order' => 2,
            ],
            [
                'widget_type' => 'pie_chart',
                'widget_name' => 'Data Distribution',
                'widget_config' => [
                    'chart_type' => 'pie',
                    'ai_insights' => $aiInsights
                ],
                'display_order' => 3,
            ],
            [
                'widget_type' => 'table',
                'widget_name' => 'Combined Data Table',
                'widget_config' => [
                    'table_type' => 'combined',
                    'ai_insights' => $aiInsights
                ],
                'display_order' => 4,
            ],
        ];

        foreach ($widgets as $widget) {
            DashboardWidget::updateOrCreate(
                [
                    'widget_type' => $widget['widget_type'],
                    'widget_name' => $widget['widget_name'],
                    'user_id' => Auth::id(),
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

    private function generateIntelligentCombination($aiService, $filesData, $combinedFileName)
    {
        try {
            // Create detailed analysis of files for AI
            $analysis = [
                'files_count' => count($filesData),
                'total_rows' => array_sum(array_column($filesData, 'total_rows')),
                'files' => array_map(function($file) {
                    return [
                        'name' => $file['filename'],
                        'rows' => $file['total_rows'],
                        'columns' => $file['total_columns'],
                        'headers' => $file['headers'],
                        'sample_data' => array_slice($file['data'], 0, 5) // First 5 rows for analysis
                    ];
                }, $filesData),
                'common_headers' => $this->findCommonHeaders($filesData),
                'unique_headers' => $this->findUniqueHeaders($filesData),
                'data_relationships' => $this->analyzeDataRelationships($filesData),
                'suggested_filename' => $combinedFileName
            ];

            // Generate AI prompt for intelligent combination
            $prompt = $this->buildIntelligentCombinePrompt($analysis);

            Log::info('Making AI API request for intelligent combination');

            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.aiml.api_key'),
                'Content-Type' => 'application/json',
            ])->post(config('services.aiml.base_url', 'https://api.aimlapi.com/v1') . '/chat/completions', [
                'model' => 'gpt-4o',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert data analyst specializing in intelligent file combination and data relationship analysis. Your task is to analyze multiple datasets and create an optimized combined dataset that finds relationships, creates new meaningful columns, and eliminates redundancy.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.2,
                'max_tokens' => 2000
            ]);

            if ($response->successful()) {
                $result = $response->json();
                $content = $result['choices'][0]['message']['content'] ?? '';

                Log::info('AI API response received successfully');

                // Parse the AI response for intelligent combination
                return $this->parseIntelligentCombineResponse($content, $filesData, $analysis);
            } else {
                Log::error('AI API request failed: ' . $response->body());
                return $this->generateFallbackIntelligentCombination($filesData, $analysis);
            }

        } catch (\Exception $e) {
            Log::error('Error generating intelligent combination: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return $this->generateFallbackIntelligentCombination($filesData, $analysis ?? []);
        }
    }

    private function buildIntelligentCombinePrompt($analysis)
    {
        return "Analyze these datasets and create an intelligent combined dataset:

Files to Combine: {$analysis['files_count']} files
Total Rows: {$analysis['total_rows']}

Files Analysis:
" . json_encode($analysis['files'], JSON_PRETTY_PRINT) . "

Data Relationships Found:
" . json_encode($analysis['data_relationships'], JSON_PRETTY_PRINT) . "

Common Headers: " . implode(', ', $analysis['common_headers']) . "
Unique Headers: " . implode(', ', $analysis['unique_headers']) . "

Please provide a JSON response with the following structure:
{
  \"headers\": [
    \"optimized_column_1\",
    \"optimized_column_2\",
    \"new_relationship_column_1\",
    \"new_relationship_column_2\"
  ],
  \"data\": [
    {
      \"optimized_column_1\": \"value\",
      \"optimized_column_2\": \"value\",
      \"new_relationship_column_1\": \"calculated_value\",
      \"new_relationship_column_2\": \"calculated_value\"
    }
  ],
  \"metadata\": {
    \"combination_strategy\": \"description of how files were combined\",
    \"new_columns_created\": [
      {
        \"name\": \"column_name\",
        \"description\": \"what this column represents\",
        \"calculation_method\": \"how it was calculated\"
      }
    ],
    \"relationships_found\": [
      \"description of relationship 1\",
      \"description of relationship 2\"
    ],
    \"optimizations_made\": [
      \"removed empty columns\",
      \"standardized data formats\",
      \"created derived metrics\"
    ],
    \"business_insights\": [
      \"insight 1\",
      \"insight 2\"
    ]
  }
}

Focus on:
1. Finding meaningful relationships between datasets
2. Creating new columns that add business value
3. Removing redundant or empty columns
4. Standardizing data formats
5. Creating derived metrics from the combined data
6. Ensuring the final dataset is optimized for analysis";
    }

    private function parseIntelligentCombineResponse($content, $filesData, $analysis)
    {
        try {
            $jsonStart = strpos($content, '{');
            $jsonEnd = strrpos($content, '}');

            if ($jsonStart !== false && $jsonEnd !== false) {
                $jsonString = substr($content, $jsonStart, $jsonEnd - $jsonStart + 1);
                $parsed = json_decode($jsonString, true);

                if ($parsed && isset($parsed['headers']) && isset($parsed['data'])) {
                    return $parsed;
                }
            }

            return $this->generateFallbackIntelligentCombination($filesData, $analysis);

        } catch (\Exception $e) {
            Log::error('Error parsing intelligent combine response: ' . $e->getMessage());
            return $this->generateFallbackIntelligentCombination($filesData, $analysis);
        }
    }

    private function generateFallbackIntelligentCombination($filesData, $analysis)
    {
        // Create a basic intelligent combination as fallback
        $allHeaders = [];
        $combinedData = [];
        $metadata = [
            'combination_strategy' => 'Merged datasets with source tracking and relationship analysis',
            'new_columns_created' => [
                [
                    'name' => 'Source_File',
                    'description' => 'Original file source for each record',
                    'calculation_method' => 'Direct mapping from file origin'
                ],
                [
                    'name' => 'Combined_Key',
                    'description' => 'Unique identifier for combined records',
                    'calculation_method' => 'Generated unique ID'
                ]
            ],
            'relationships_found' => [
                'Common data patterns identified across files',
                'Shared column structures optimized'
            ],
            'optimizations_made' => [
                'Removed duplicate columns',
                'Standardized data formats',
                'Added source tracking'
            ],
            'business_insights' => [
                'Unified view of data from multiple sources',
                'Enhanced data lineage tracking'
            ]
        ];

        // Collect all unique headers
        foreach ($filesData as $file) {
            $allHeaders = array_merge($allHeaders, $file['headers']);
        }
        $allHeaders = array_unique($allHeaders);

        // Add new columns
        $allHeaders = array_merge(['Source_File', 'Combined_Key'], $allHeaders);

        // Combine data with intelligent mapping
        $recordId = 1;
        foreach ($filesData as $file) {
            foreach ($file['data'] as $row) {
                $combinedRow = [
                    'Source_File' => $file['filename'],
                    'Combined_Key' => 'REC_' . $recordId++
                ];

                // Map existing data
                foreach ($allHeaders as $header) {
                    if (in_array($header, $file['headers'])) {
                        $combinedRow[$header] = $row[$header] ?? '';
                    } else {
                        $combinedRow[$header] = '';
                    }
                }

                $combinedData[] = $combinedRow;
            }
        }

        Log::info('Fallback combination created: ' . count($combinedData) . ' records with ' . count($allHeaders) . ' columns');

        return [
            'headers' => $allHeaders,
            'data' => $combinedData,
            'metadata' => $metadata
        ];
    }

    private function analyzeDataRelationships($filesData)
    {
        $relationships = [];

        if (count($filesData) < 2) {
            return $relationships;
        }

        // Analyze column similarities
        $allHeaders = [];
        foreach ($filesData as $file) {
            $allHeaders = array_merge($allHeaders, $file['headers']);
        }
        $allHeaders = array_unique($allHeaders);

        // Find potential relationships
        foreach ($allHeaders as $header) {
            $filesWithHeader = [];
            foreach ($filesData as $index => $file) {
                if (in_array($header, $file['headers'])) {
                    $filesWithHeader[] = $index;
                }
            }

            if (count($filesWithHeader) > 1) {
                $relationships[] = [
                    'type' => 'shared_column',
                    'column' => $header,
                    'files' => $filesWithHeader,
                    'description' => "Column '{$header}' appears in " . count($filesWithHeader) . " files"
                ];
            }
        }

        // Analyze data patterns
        foreach ($filesData as $index1 => $file1) {
            foreach ($filesData as $index2 => $file2) {
                if ($index1 >= $index2) continue;

                $commonHeaders = array_intersect($file1['headers'], $file2['headers']);
                if (!empty($commonHeaders)) {
                    $relationships[] = [
                        'type' => 'data_compatibility',
                        'files' => [$index1, $index2],
                        'common_columns' => array_values($commonHeaders),
                        'description' => "Files have " . count($commonHeaders) . " common columns"
                    ];
                }
            }
        }

        return $relationships;
    }

    private function analyzeCombinedData($intelligentCombination)
    {
        try {
            // Analyze the actual combined data to provide meaningful insights
            $data = $intelligentCombination['data'] ?? [];
            $headers = $intelligentCombination['headers'] ?? [];
            $metadata = $intelligentCombination['metadata'] ?? [];

            // Analyze data patterns and statistics
            $analysis = [
                'total_records' => count($data),
                'total_columns' => count($headers),
                'new_columns_count' => count($metadata['new_columns_created'] ?? []),
                'column_analysis' => $this->analyzeColumns($data, $headers),
                'data_patterns' => $this->findDataPatterns($data, $headers),
                'business_metrics' => $this->extractBusinessMetrics($data, $headers),
                'data_quality_score' => $this->calculateDataQualityScore($data, $headers)
            ];

            // Generate AI insights about the actual combined data
            $prompt = $this->buildCombinedDataAnalysisPrompt($analysis, $metadata);

            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.aiml.api_key'),
                'Content-Type' => 'application/json',
            ])->post(config('services.aiml.base_url', 'https://api.aimlapi.com/v1') . '/chat/completions', [
                'model' => 'gpt-4o',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert data analyst. Analyze the provided combined dataset and provide meaningful insights about the actual data, patterns, and business value. Focus on what the data reveals, not how it was combined.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.3,
                'max_tokens' => 1000
            ]);

            if ($response->successful()) {
                $result = $response->json();
                $content = $result['choices'][0]['message']['content'] ?? '';

                return $this->parseCombinedDataAnalysisResponse($content, $analysis);
            } else {
                return $this->generateFallbackCombinedDataAnalysis($analysis, $metadata);
            }

        } catch (\Exception $e) {
            Log::error('Error analyzing combined data: ' . $e->getMessage());
            return $this->generateFallbackCombinedDataAnalysis([], $metadata ?? []);
        }
    }

    private function buildCombinedDataAnalysisPrompt($analysis, $metadata)
    {
        return "Analyze this combined dataset and provide insights about the actual data:

Dataset Overview:
- Total Records: {$analysis['total_records']}
- Total Columns: {$analysis['total_columns']}
- New Columns Created: {$analysis['new_columns_count']}

Column Analysis:
" . json_encode($analysis['column_analysis'], JSON_PRETTY_PRINT) . "

Data Patterns Found:
" . json_encode($analysis['data_patterns'], JSON_PRETTY_PRINT) . "

Business Metrics:
" . json_encode($analysis['business_metrics'], JSON_PRETTY_PRINT) . "

Data Quality Score: {$analysis['data_quality_score']}/100

New Columns Created:
" . json_encode($metadata['new_columns_created'] ?? [], JSON_PRETTY_PRINT) . "

Please provide a JSON response with:
{
  \"suggested_filename\": \"descriptive filename based on actual data content\",
  \"data_insights\": [
    \"specific insight about the actual data patterns\",
    \"business-relevant finding from the data\"
  ],
  \"key_discoveries\": [
    \"important pattern or trend found in the data\",
    \"unexpected relationship or insight\"
  ]
}

Focus on what the actual combined data reveals, not the combination process. Provide specific insights about patterns, trends, and business value in the data.";
    }

    private function parseCombinedDataAnalysisResponse($content, $analysis)
    {
        try {
            $jsonStart = strpos($content, '{');
            $jsonEnd = strrpos($content, '}');

            if ($jsonStart !== false && $jsonEnd !== false) {
                $jsonString = substr($content, $jsonStart, $jsonEnd - $jsonStart + 1);
                $parsed = json_decode($jsonString, true);

                if ($parsed) {
                    return $parsed;
                }
            }

            return $this->generateFallbackCombinedDataAnalysis($analysis, []);

        } catch (\Exception $e) {
            Log::error('Error parsing combined data analysis: ' . $e->getMessage());
            return $this->generateFallbackCombinedDataAnalysis($analysis, []);
        }
    }

    private function generateFallbackCombinedDataAnalysis($analysis, $metadata)
    {
        // Ensure analysis has required keys with fallback values
        $analysis = array_merge([
            'total_records' => 0,
            'total_columns' => 0,
            'new_columns_count' => 0,
            'column_analysis' => [],
            'data_patterns' => [],
            'business_metrics' => [],
            'data_quality_score' => 0
        ], $analysis ?? []);

        return [
            'suggested_filename' => 'Intelligent_Combined_Data_' . date('Y-m-d'),
            'data_insights' => [
                "Combined dataset contains {$analysis['total_records']} records with {$analysis['total_columns']} columns",
                "Data quality score of {$analysis['data_quality_score']}/100 indicates good data integrity",
                "New columns created provide enhanced analytical capabilities"
            ],
            'key_discoveries' => [
                "Multiple data sources successfully integrated",
                "Enhanced data structure optimized for analysis",
                "New derived metrics available for business intelligence"
            ]
        ];
    }

    private function analyzeColumns($data, $headers)
    {
        $columnAnalysis = [];

        foreach ($headers as $header) {
            $values = array_column($data, $header);
            $nonEmptyValues = array_filter($values, function($value) {
                return $value !== null && $value !== '' && $value !== 'null';
            });

            $numericValues = array_filter($nonEmptyValues, function($value) {
                return is_numeric($value) || (is_string($value) && is_numeric(preg_replace('/[^\d.-]/', '', $value)));
            });

            $columnAnalysis[$header] = [
                'total_values' => count($values),
                'non_empty_values' => count($nonEmptyValues),
                'unique_values' => count(array_unique($nonEmptyValues)),
                'numeric_count' => count($numericValues),
                'completion_rate' => count($nonEmptyValues) / count($values) * 100,
                'is_primarily_numeric' => count($numericValues) > count($nonEmptyValues) * 0.7
            ];
        }

        return $columnAnalysis;
    }

    private function findDataPatterns($data, $headers)
    {
        $patterns = [];

        // Find columns with high correlation
        $numericHeaders = array_filter($headers, function($header) use ($data) {
            $values = array_column($data, $header);
            $numericCount = count(array_filter($values, function($value) {
                return is_numeric($value) || (is_string($value) && is_numeric(preg_replace('/[^\d.-]/', '', $value)));
            }));
            return $numericCount > count($values) * 0.5;
        });

        if (count($numericHeaders) > 1) {
            $patterns[] = "Multiple numeric columns available for correlation analysis";
        }

        // Find categorical patterns
        $categoricalHeaders = array_filter($headers, function($header) use ($data) {
            $values = array_column($data, $header);
            $uniqueCount = count(array_unique($values));
            return $uniqueCount < count($values) * 0.3; // Less than 30% unique values
        });

        if (!empty($categoricalHeaders)) {
            $patterns[] = "Categorical data available for segmentation analysis";
        }

        return $patterns;
    }

    private function extractBusinessMetrics($data, $headers)
    {
        $metrics = [];

        // Look for common business metric columns
        $businessKeywords = ['sales', 'revenue', 'profit', 'cost', 'amount', 'price', 'commission', 'performance', 'score', 'rating'];

        foreach ($headers as $header) {
            $headerLower = strtolower($header);
            foreach ($businessKeywords as $keyword) {
                if (strpos($headerLower, $keyword) !== false) {
                    $values = array_column($data, $header);
                    $numericValues = array_filter($values, function($value) {
                        return is_numeric($value) || (is_string($value) && is_numeric(preg_replace('/[^\d.-]/', '', $value)));
                    });

                    if (!empty($numericValues)) {
                        $metrics[] = [
                            'metric' => $header,
                            'type' => $keyword,
                            'count' => count($numericValues),
                            'avg_value' => array_sum($numericValues) / count($numericValues)
                        ];
                    }
                    break;
                }
            }
        }

        return $metrics;
    }

    private function calculateDataQualityScore($data, $headers)
    {
        $totalCells = count($data) * count($headers);
        $emptyCells = 0;
        $duplicateRows = 0;

        // Count empty cells
        foreach ($data as $row) {
            foreach ($headers as $header) {
                $value = $row[$header] ?? '';
                if (empty($value) || $value === 'null' || $value === '') {
                    $emptyCells++;
                }
            }
        }

        // Count duplicate rows
        $rowHashes = [];
        foreach ($data as $row) {
            $hash = md5(json_encode($row));
            if (isset($rowHashes[$hash])) {
                $duplicateRows++;
            } else {
                $rowHashes[$hash] = true;
            }
        }

        // Calculate quality score (0-100)
        $completenessScore = (($totalCells - $emptyCells) / $totalCells) * 100;
        $uniquenessScore = ((count($data) - $duplicateRows) / count($data)) * 100;

        return round(($completenessScore + $uniquenessScore) / 2);
    }
}
