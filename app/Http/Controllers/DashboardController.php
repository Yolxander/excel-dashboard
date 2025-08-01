<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;
use App\Models\FileWidgetConnection;
use App\Models\DashboardWidget;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Services\AIService;

use App\Services\RawDataService;

class DashboardController extends Controller
{
        public function index(Request $request)
    {
        // Get the currently displayed widgets from FileWidgetConnection (AI widgets)
        $fileWidgetConnections = FileWidgetConnection::with('uploadedFile')
            ->whereHas('uploadedFile', function($query) {
                $query->where('user_id', Auth::id());
            })
            ->where('is_displayed', true)
            ->whereNotNull('uploaded_file_id')
            ->whereHas('uploadedFile', function($query) {
                $query->where('status', 'completed');
            })
            ->orderBy('display_order')
            ->get();

        // Get the currently displayed widgets from DashboardWidget (Raw data widgets)
        $dashboardWidgets = DashboardWidget::where('user_id', Auth::id())
            ->where('is_displayed', true)
            ->orderBy('display_order')
            ->get();

        // Combine both widget collections
        $displayedWidgets = $fileWidgetConnections->concat($dashboardWidgets);

        $connectedFile = null;
        $stats = [];
        $chartData = [];
        $tableData = [];
        $aiInsights = null;

        if ($displayedWidgets->isNotEmpty()) {
            // Get the file from the first widget that has a file relationship
            $file = null;
            $data = null;
            $aiInsights = null;
            $connectedFile = null;

            // First try to get file from AI widgets (FileWidgetConnection)
            $aiWidget = $displayedWidgets->first(function($widget) {
                return $widget instanceof \App\Models\FileWidgetConnection;
            });

            if ($aiWidget) {
                $file = $aiWidget->uploadedFile;
                $data = $file->processed_data;
                $aiInsights = $file->ai_insights;
                $connectedFile = $file->original_filename;
            } else {
                // If no AI widgets, get the most recent completed file for raw data widgets
                $file = UploadedFile::where('user_id', Auth::id())
                    ->where('status', 'completed')
                    ->orderBy('updated_at', 'desc')
                    ->first();

                if ($file) {
                    $data = $file->processed_data;
                    $connectedFile = $file->original_filename;
                }
            }

            if ($data) {
                if ($aiInsights && isset($aiInsights['widget_insights'])) {
                    $stats = $this->generateStatsFromAIInsights($aiInsights['widget_insights']);
                    $chartData = $this->generateChartDataFromAIInsights($aiInsights);
                } else {
                    $stats = $this->generateStatsFromData($data);
                    $chartData = $this->generateChartDataFromData($data);
                }

                $tableData = $this->generateTableDataFromData($data);
            }
        } else {
            // When no file is connected, pass empty data to show welcome state
            $stats = [
                'totalSales' => 0,
                'activeRecruiters' => 0,
                'targetAchievement' => 0,
                'avgCommission' => 0,
            ];

            $chartData = [
                'barChart' => [],
                'pieChart' => []
            ];

            $tableData = [];
            $connectedFile = null;
        }



        // Determine data type based on query parameter, user preference, or actual widgets
        $dataType = $request->query('dataType', null); // Get from query parameter
        $user = Auth::user();

        // If no query parameter, check user's database preference
        if (!$dataType) {
            $dataType = $user->dashboard_data_type ?? null;
        }

        // If still no data type, determine from widgets
        if (!$dataType) {
            if ($displayedWidgets->isNotEmpty()) {
                // Check if any widget has AI data type
                $hasAIData = $displayedWidgets->contains('data_type', 'ai');
                $dataType = $hasAIData ? 'ai' : 'raw';
            }

            // If we have raw data widgets, prioritize them
            if ($dashboardWidgets->isNotEmpty()) {
                $dataType = 'raw';
            }
        }

        // Default to 'raw' if still no data type
        if (!$dataType) {
            $dataType = 'raw';
        }

        // Store the data type in user's database record for persistence
        if ($user->dashboard_data_type !== $dataType) {
            $user->update(['dashboard_data_type' => $dataType]);
        }

        // Filter widgets based on data type
        $filteredWidgets = $displayedWidgets->filter(function($widget) use ($dataType) {
            if ($widget instanceof \App\Models\FileWidgetConnection) {
                // FileWidgetConnection widgets are AI widgets
                return $dataType === 'ai';
            } elseif ($widget instanceof \App\Models\DashboardWidget) {
                // DashboardWidget widgets have data_type field
                return $widget->data_type === $dataType;
            }
            return false;
        })->values(); // Convert to array and re-index

        // Calculate actual values for raw data widgets
        if ($dataType === 'raw' && $file && $data) {
            $filteredWidgets = $this->calculateRawDataWidgetValues($filteredWidgets, $data);
        }

        $props = [
            'stats' => $stats,
            'connectedFile' => $connectedFile,
            'chartData' => $chartData,
            'chartTitles' => $aiInsights ? $this->getChartTitles($aiInsights) : null,
            'chartDescriptions' => $aiInsights ? $this->getChartDescriptions($aiInsights) : null,
            'tableData' => $tableData,
            'dataType' => $dataType,
            'availableColumns' => $displayedWidgets->isNotEmpty() && $displayedWidgets->first()->uploadedFile && $displayedWidgets->first()->uploadedFile->processed_data
                ? $displayedWidgets->first()->uploadedFile->processed_data['headers'] ?? []
                : [],
            'displayedWidgets' => $filteredWidgets,
        ];

        return Inertia::render('Dashboard', $props);
    }

    private function generateStatsFromAIInsights($widgetInsights)
    {


        // Initialize default stats
        $stats = [
            'totalSales' => 0,
            'activeRecruiters' => 0,
            'targetAchievement' => 0,
            'avgCommission' => 0,
        ];

        // Map AI widget insights to dashboard stats
        foreach ($widgetInsights as $key => $insight) {
            $widgetName = $insight['widget_name'] ?? $key;
            $widgetType = $insight['widget_type'] ?? 'kpi';
            $value = $insight['value'] ?? 0;

            // Map based on widget name or type
            if (strpos(strtolower($widgetName), 'total') !== false || strpos(strtolower($widgetName), 'sales') !== false) {
                $stats['totalSales'] = $value;
            } elseif (strpos(strtolower($widgetName), 'recruiter') !== false || strpos(strtolower($widgetName), 'unique') !== false) {
                $stats['activeRecruiters'] = $value;
            } elseif (strpos(strtolower($widgetName), 'target') !== false || strpos(strtolower($widgetName), 'achievement') !== false) {
                $stats['targetAchievement'] = $value;
            } elseif (strpos(strtolower($widgetName), 'commission') !== false || strpos(strtolower($widgetName), 'average') !== false) {
                $stats['avgCommission'] = $value;
            }
        }

        // Store AI insights for frontend display
        $stats['ai_insights'] = $widgetInsights;


        return $stats;
    }

    private function generateChartDataFromAIInsights($aiInsights)
    {


        $chartData = [
            'barChart' => [],
            'pieChart' => []
        ];

        if (isset($aiInsights['chart_recommendations'])) {
            $recommendations = $aiInsights['chart_recommendations'];

            // Generate bar chart data based on AI recommendations
            if (isset($recommendations['bar_chart'])) {
                $barConfig = $recommendations['bar_chart'];
                $chartData['barChart'] = $this->generateBarChartFromAIRecommendation($barConfig);
            }

            // Generate pie chart data based on AI recommendations
            if (isset($recommendations['pie_chart'])) {
                $pieConfig = $recommendations['pie_chart'];
                $chartData['pieChart'] = $this->generatePieChartFromAIRecommendation($pieConfig);
            }
        }


        return $chartData;
    }

        private function generateBarChartFromAIRecommendation($barConfig)
    {
        // Use AI-generated chart data if available, otherwise generate sample data
        if (isset($barConfig['chart_data']) && is_array($barConfig['chart_data'])) {
            return $barConfig['chart_data'];
        }

        // Generate sample bar chart data based on AI recommendation
        return [
            ['name' => $barConfig['x_axis'] ?? 'Category A', 'value' => 400],
            ['name' => $barConfig['x_axis'] ?? 'Category B', 'value' => 300],
            ['name' => $barConfig['x_axis'] ?? 'Category C', 'value' => 200],
            ['name' => $barConfig['x_axis'] ?? 'Category D', 'value' => 150],
        ];
    }

    private function generatePieChartFromAIRecommendation($pieConfig)
    {
        // Use AI-generated chart data if available, otherwise generate sample data
        if (isset($pieConfig['chart_data']) && is_array($pieConfig['chart_data'])) {
            return $pieConfig['chart_data'];
        }

        // Generate sample pie chart data based on AI recommendation
        return [
            ['name' => $pieConfig['category_column'] ?? 'Group A', 'value' => 35],
            ['name' => $pieConfig['category_column'] ?? 'Group B', 'value' => 25],
            ['name' => $pieConfig['category_column'] ?? 'Group C', 'value' => 25],
            ['name' => $pieConfig['category_column'] ?? 'Group D', 'value' => 15],
        ];
    }

    private function getChartTitleFromAI($chartConfig, $chartType)
    {
        if (isset($chartConfig['title'])) {
            return $chartConfig['title'];
        }

        return $chartType === 'bar_chart' ? 'AI Analysis - Performance Overview' : 'AI Analysis - Data Distribution';
    }

        private function getChartDescriptionFromAI($chartConfig, $chartType)
    {
        if (isset($chartConfig['description'])) {
            return $chartConfig['description'];
        }

        return $chartType === 'bar_chart'
            ? 'AI-generated performance analysis based on your data'
            : 'AI-generated distribution analysis of your data';
    }

    private function getChartTitles($aiInsights)
    {
        if (!$aiInsights || !isset($aiInsights['chart_recommendations'])) {
            return null;
        }

        $recommendations = $aiInsights['chart_recommendations'];

        return [
            'barChart' => $this->getChartTitleFromAI($recommendations['bar_chart'] ?? [], 'bar_chart'),
            'pieChart' => $this->getChartTitleFromAI($recommendations['pie_chart'] ?? [], 'pie_chart')
        ];
    }

    private function getChartDescriptions($aiInsights)
    {
        if (!$aiInsights || !isset($aiInsights['chart_recommendations'])) {
            return null;
        }

        $recommendations = $aiInsights['chart_recommendations'];

        return [
            'barChart' => $this->getChartDescriptionFromAI($recommendations['bar_chart'] ?? [], 'bar_chart'),
            'pieChart' => $this->getChartDescriptionFromAI($recommendations['pie_chart'] ?? [], 'pie_chart')
        ];
    }

    private function generateStatsFromData($data)
    {
        $rows = $data['data'] ?? [];
        $headers = $data['headers'] ?? [];



        if (empty($rows)) {
            return $this->getDefaultStats();
        }

        // Try to identify relevant columns
        $salesColumn = $this->findColumn($headers, ['sales', 'amount', 'revenue', 'total', 'price', 'commission', 'commission earned', 'revenue']);
        $recruiterColumn = $this->findColumn($headers, ['recruiter', 'employee', 'staff', 'name', 'salesperson']);
        $statusColumn = $this->findColumn($headers, ['status', 'state', 'condition']);
        $dateColumn = $this->findColumn($headers, ['date', 'created', 'timestamp']);



        $totalSales = 0;
        $activeRecruiters = 0;
        $recruiterCounts = [];
        $completedSales = 0;
        $totalSalesCount = 0;

        foreach ($rows as $row) {
            // Calculate total sales
            if ($salesColumn && isset($row[$salesColumn])) {
                $salesValue = $this->extractNumericValue($row[$salesColumn]);
                $totalSales += $salesValue;
                $totalSalesCount++;
            }

            // Count active recruiters
            if ($recruiterColumn && isset($row[$recruiterColumn])) {
                $recruiter = $row[$recruiterColumn];
                if (!empty($recruiter)) {
                    $recruiterCounts[$recruiter] = ($recruiterCounts[$recruiter] ?? 0) + 1;
                }
            }

            // Count completed sales
            if ($statusColumn && isset($row[$statusColumn])) {
                $status = strtolower($row[$statusColumn]);
                if (in_array($status, ['completed', 'done', 'finished', 'success'])) {
                    $completedSales++;
                }
            }
        }

        $activeRecruiters = count($recruiterCounts);
        $targetAchievement = $totalSalesCount > 0 ? round(($completedSales / $totalSalesCount) * 100) : 0;
        $avgCommission = $activeRecruiters > 0 ? round($totalSales / $activeRecruiters) : 0;



        return [
            'totalSales' => $totalSales,
            'activeRecruiters' => $activeRecruiters,
            'targetAchievement' => $targetAchievement,
            'avgCommission' => $avgCommission,
        ];
    }



    private function generateChartDataFromData($data)
    {
        $rows = $data['data'] ?? [];
        $headers = $data['headers'] ?? [];



        if (empty($rows)) {

            return $this->getDefaultChartData();
        }

        // Generate bar chart data
        $barChartData = [];
        $pieChartData = [];

        // Dynamically analyze the data to find the best columns for charts
        $analysis = $this->analyzeDataForCharts($rows, $headers);
        $categoryColumn = $analysis['categoryColumn'];
        $valueColumn = $analysis['valueColumn'];



        if ($categoryColumn && $valueColumn) {
            $categoryTotals = [];

            foreach ($rows as $row) {
                $category = $row[$categoryColumn] ?? 'Unknown';
                $value = $this->extractNumericValue($row[$valueColumn] ?? 0);

                $categoryTotals[$category] = ($categoryTotals[$category] ?? 0) + $value;
            }

            // Convert to chart format
            foreach ($categoryTotals as $category => $total) {
                $barChartData[] = [
                    'name' => $category,
                    'value' => $total
                ];

                $pieChartData[] = [
                    'name' => $category,
                    'value' => $total
                ];
            }


        } else {
            // Fallback: use first two columns
            $firstColumn = $headers[0] ?? 'Category';
            $secondColumn = $headers[1] ?? 'Value';



            foreach (array_slice($rows, 0, 5) as $row) {
                $category = $row[$firstColumn] ?? 'Unknown';
                $value = $this->extractNumericValue($row[$secondColumn] ?? 0);

                $barChartData[] = [
                    'name' => $category,
                    'value' => $value
                ];

                $pieChartData[] = [
                    'name' => $category,
                    'value' => $value
                ];
            }


        }

        $result = [
            'barChart' => $barChartData,
            'pieChart' => $pieChartData
        ];



        return $result;
    }

    private function generateTableDataFromData($data)
    {
        $rows = $data['data'] ?? [];
        $headers = $data['headers'] ?? [];

        if (empty($rows)) {
            return [];
        }

        // Convert the data to table format
        $tableData = [];
        foreach (array_slice($rows, 0, 10) as $index => $row) {
            $tableRow = [
                'id' => $index + 1,
            ];

            // Add all columns from the data
            foreach ($headers as $header) {
                $tableRow[$header] = $row[$header] ?? '';
            }

            $tableData[] = $tableRow;
        }

        return $tableData;
    }

    private function findColumn($headers, $possibleNames)
    {
        foreach ($headers as $header) {
            $headerLower = strtolower($header);
            foreach ($possibleNames as $name) {
                if (strpos($headerLower, $name) !== false) {
                    return $header;
                }
            }
        }
        return null;
    }

            private function findValueColumn($headers)
    {
        // More specific search for value columns - prioritize exact matches
        $valueColumns = ['revenue', 'sales', 'amount', 'commission', 'hires', 'units sold'];



        // First, try exact matches
        foreach ($headers as $header) {
            $headerLower = strtolower($header);
            foreach ($valueColumns as $valueCol) {
                if ($headerLower === $valueCol) {

                    return $header;
                }
            }
        }

        // Then try partial matches, but avoid 'salesperson' when looking for 'sales'
        foreach ($headers as $header) {
            $headerLower = strtolower($header);
            foreach ($valueColumns as $valueCol) {
                if (strpos($headerLower, $valueCol) !== false && $headerLower !== 'salesperson') {

                    return $header;
                }
            }
        }


        return null;
    }

    private function extractNumericValue($value)
    {
        if (is_numeric($value)) {
            return (float) $value;
        }

        // Remove currency symbols and commas
        $cleaned = preg_replace('/[^\d.-]/', '', $value);
        return is_numeric($cleaned) ? (float) $cleaned : 0;
    }

    private function getDefaultStats()
    {
        return [
            'totalSales' => 456789,
            'activeRecruiters' => 24,
            'targetAchievement' => 87,
            'avgCommission' => 1250,
        ];
    }



    private function getDefaultChartData()
    {
        return [
            'barChart' => [
                ['name' => 'North', 'value' => 400],
                ['name' => 'South', 'value' => 300],
                ['name' => 'East', 'value' => 300],
                ['name' => 'West', 'value' => 200],
            ],
            'pieChart' => [
                ['name' => 'North', 'value' => 35],
                ['name' => 'South', 'value' => 25],
                ['name' => 'East', 'value' => 25],
                ['name' => 'West', 'value' => 15],
            ]
        ];
    }

    private function analyzeDataForCharts($rows, $headers)
    {


        $categoryColumn = null;
        $valueColumn = null;

        // Analyze each column to determine its type
        $columnAnalysis = [];

        foreach ($headers as $header) {
            $analysis = $this->analyzeColumn($rows, $header);
            $columnAnalysis[$header] = $analysis;
            Log::info("Column '$header' analysis: " . json_encode($analysis));
        }

        // Find the best category column (categorical data with multiple unique values)
        $categoryCandidates = [];
        foreach ($columnAnalysis as $header => $analysis) {
            if ($analysis['type'] === 'categorical' && $analysis['uniqueCount'] > 1 && $analysis['uniqueCount'] <= 20) {
                $categoryCandidates[] = [
                    'header' => $header,
                    'score' => $analysis['uniqueCount'] // More unique values = better for categories
                ];
            }
        }

        // Sort by score (descending) and pick the best one
        usort($categoryCandidates, function($a, $b) {
            return $b['score'] - $a['score'];
        });

        if (!empty($categoryCandidates)) {
            $categoryColumn = $categoryCandidates[0]['header'];
            Log::info('Selected category column: ' . $categoryColumn);
        }

        // Find the best value column (numeric data)
        $valueCandidates = [];
        foreach ($columnAnalysis as $header => $analysis) {
            if ($analysis['type'] === 'numeric' && $analysis['hasData']) {
                $valueCandidates[] = [
                    'header' => $header,
                    'score' => $analysis['avgValue'] // Higher average = better for visualization
                ];
            }
        }

        // Sort by score (descending) and pick the best one
        usort($valueCandidates, function($a, $b) {
            return $b['score'] - $a['score'];
        });

        if (!empty($valueCandidates)) {
            $valueColumn = $valueCandidates[0]['header'];
            Log::info('Selected value column: ' . $valueColumn);
        }

        return [
            'categoryColumn' => $categoryColumn,
            'valueColumn' => $valueColumn
        ];
    }

    private function analyzeColumn($rows, $header)
    {
        $values = [];
        $numericCount = 0;
        $totalCount = 0;
        $sum = 0;

        foreach ($rows as $row) {
            $value = $row[$header] ?? '';
            $values[] = $value;
            $totalCount++;

            $numericValue = $this->extractNumericValue($value);
            if ($numericValue > 0) {
                $numericCount++;
                $sum += $numericValue;
            }
        }

        $uniqueValues = array_unique($values);
        $uniqueCount = count($uniqueValues);
        $avgValue = $numericCount > 0 ? $sum / $numericCount : 0;

        // Determine column type
        $numericRatio = $totalCount > 0 ? $numericCount / $totalCount : 0;

        if ($numericRatio > 0.7) {
            $type = 'numeric';
        } elseif ($uniqueCount <= 20 && $uniqueCount > 1) {
            $type = 'categorical';
        } else {
            $type = 'other';
        }

        return [
            'type' => $type,
            'uniqueCount' => $uniqueCount,
            'numericCount' => $numericCount,
            'totalCount' => $totalCount,
            'avgValue' => $avgValue,
            'hasData' => $numericCount > 0
        ];
    }

    public function regenerateAIInsights(Request $request)
    {
        $userId = Auth::id();

        // Debug: Check if user has any files
        $totalFiles = UploadedFile::where('user_id', $userId)->count();
        $completedFiles = UploadedFile::where('user_id', $userId)->where('status', 'completed')->count();

        Log::info("User {$userId} has {$totalFiles} total files and {$completedFiles} completed files");

        // Get the most recently connected file from dashboard widgets
        $activeWidget = FileWidgetConnection::with('uploadedFile')
            ->whereHas('uploadedFile', function($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->where('is_displayed', true)
            ->whereNotNull('uploaded_file_id')
            ->whereHas('uploadedFile', function($query) {
                $query->where('status', 'completed');
            })
            ->orderBy('updated_at', 'desc')
            ->first();

        Log::info("Found active widget: " . ($activeWidget ? 'yes' : 'no'));

        // If no FileWidgetConnection found, try to get from DashboardWidget
        if (!$activeWidget) {
            $dashboardWidget = DashboardWidget::where('user_id', $userId)
                ->where('is_displayed', true)
                ->orderBy('updated_at', 'desc')
                ->first();

            Log::info("Found dashboard widget: " . ($dashboardWidget ? 'yes' : 'no'));

            if ($dashboardWidget) {
                // For dashboard widgets, we need to find the associated file
                $uploadedFile = UploadedFile::where('user_id', $userId)
                    ->where('status', 'completed')
                    ->orderBy('updated_at', 'desc')
                    ->first();

                Log::info("Found uploaded file for dashboard widget: " . ($uploadedFile ? 'yes' : 'no'));

                if ($uploadedFile) {
                    $activeWidget = (object) ['uploadedFile' => $uploadedFile];
                }
            }
        }

        // If still no active widget, try to get any completed file for the user
        if (!$activeWidget) {
            $uploadedFile = UploadedFile::where('user_id', $userId)
                ->where('status', 'completed')
                ->orderBy('updated_at', 'desc')
                ->first();

            Log::info("Found fallback uploaded file: " . ($uploadedFile ? 'yes' : 'no'));

            if ($uploadedFile) {
                $activeWidget = (object) ['uploadedFile' => $uploadedFile];
            }
        }

        if (!$activeWidget || !$activeWidget->uploadedFile) {
            Log::error("No active widget or uploaded file found for user {$userId}");
            return response()->json([
                'success' => false,
                'message' => 'No connected file found. Please upload and connect a file first.'
            ], 404);
        }

        try {
            $aiService = new AIService();
            $insights = $aiService->analyzeFileData($activeWidget->uploadedFile);

            if ($insights) {
                Log::info('AI analysis completed successfully for current file: ' . $activeWidget->uploadedFile->original_filename);
                return response()->json([
                    'success' => true,
                    'message' => 'AI analysis completed successfully',
                    'insights' => $insights
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'AI analysis failed - no insights generated'
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('AI analysis error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'AI analysis failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function testDebug(Request $request)
    {
        try {
            $userId = Auth::id();
            $totalFiles = UploadedFile::where('user_id', $userId)->count();
            $completedFiles = UploadedFile::where('user_id', $userId)->where('status', 'completed')->count();

            return response()->json([
                'success' => true,
                'userId' => $userId,
                'totalFiles' => $totalFiles,
                'completedFiles' => $completedFiles,
                'message' => 'Debug test successful'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function updateWithRawData(Request $request)
    {
        $userId = Auth::id();

        // Debug: Check if user has any files
        $totalFiles = UploadedFile::where('user_id', $userId)->count();
        $completedFiles = UploadedFile::where('user_id', $userId)->where('status', 'completed')->count();

        Log::info("User {$userId} has {$totalFiles} total files and {$completedFiles} completed files");

        // Get the most recently connected file from dashboard widgets
        $activeWidget = FileWidgetConnection::with('uploadedFile')
            ->whereHas('uploadedFile', function($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->where('is_displayed', true)
            ->whereNotNull('uploaded_file_id')
            ->whereHas('uploadedFile', function($query) {
                $query->where('status', 'completed');
            })
            ->orderBy('updated_at', 'desc')
            ->first();

        Log::info("Found active widget: " . ($activeWidget ? 'yes' : 'no'));

        // If no FileWidgetConnection found, try to get from DashboardWidget
        if (!$activeWidget) {
            $dashboardWidget = DashboardWidget::where('user_id', $userId)
                ->where('is_displayed', true)
                ->orderBy('updated_at', 'desc')
                ->first();

            Log::info("Found dashboard widget: " . ($dashboardWidget ? 'yes' : 'no'));

            if ($dashboardWidget) {
                // For dashboard widgets, we need to find the associated file
                $uploadedFile = UploadedFile::where('user_id', $userId)
                    ->where('status', 'completed')
                    ->orderBy('updated_at', 'desc')
                    ->first();

                Log::info("Found uploaded file for dashboard widget: " . ($uploadedFile ? 'yes' : 'no'));

                if ($uploadedFile) {
                    $activeWidget = (object) ['uploadedFile' => $uploadedFile];
                }
            }
        }

        // If still no active widget, try to get any completed file for the user
        if (!$activeWidget) {
            $uploadedFile = UploadedFile::where('user_id', $userId)
                ->where('status', 'completed')
                ->orderBy('updated_at', 'desc')
                ->first();

            Log::info("Found fallback uploaded file: " . ($uploadedFile ? 'yes' : 'no'));

            if ($uploadedFile) {
                $activeWidget = (object) ['uploadedFile' => $uploadedFile];
            }
        }

        if (!$activeWidget || !$activeWidget->uploadedFile) {
            Log::error("No active widget or uploaded file found for user {$userId}");
            return response()->json([
                'success' => false,
                'message' => 'No connected file found. Please upload and connect a file first.'
            ], 404);
        }

        try {
            $file = $activeWidget->uploadedFile;
            $userId = Auth::id();

            // Use RawDataService to generate widgets and get data
            $rawDataService = new RawDataService();

            // Generate raw data widgets (4 KPI widgets + 2 charts)
            $widgetResult = $rawDataService->generateRawDataWidgets($file, $userId);

            if (!$widgetResult['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $widgetResult['message']
                ], 500);
            }

            // Get raw data for dashboard display
            $dataResult = $rawDataService->getRawDataForDashboard($file);

            if (!$dataResult['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $dataResult['message']
                ], 500);
            }

            // Generate stats from raw data
            $stats = $this->generateStatsFromRawData($dataResult['stats']);
            $chartData = $dataResult['chartData'];

            Log::info('Dashboard updated with raw data for file: ' . $file->original_filename);

            return response()->json([
                'success' => true,
                'message' => 'Raw data widgets generated successfully',
                'stats' => $stats,
                'chartData' => $chartData,
                'widgets' => $widgetResult['widgets']
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating dashboard with raw data: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating dashboard: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate actual values for raw data widgets based on their configuration
     */
    private function calculateRawDataWidgetValues($widgets, $data)
    {
        $rows = $data['data'] ?? [];
        $headers = $data['headers'] ?? [];

        if (empty($rows)) {
            return $widgets;
        }

        foreach ($widgets as $widget) {
            if ($widget instanceof \App\Models\DashboardWidget) {
                $config = $widget->widget_config ?? [];
                $sourceColumns = $config['source_columns'] ?? [];
                $operation = $config['operation'] ?? 'sum';
                $customFormula = $config['custom_formula'] ?? '';

                // Calculate value based on widget configuration
                $calculatedValue = $this->calculateWidgetValue($rows, $sourceColumns, $operation, $customFormula);

                // Create a new config array with calculated values
                $updatedConfig = $config;
                $updatedConfig['calculated_value'] = $calculatedValue;
                $updatedConfig['formatted_value'] = $this->formatWidgetValue($calculatedValue, $operation);

                // Set the updated config
                $widget->widget_config = $updatedConfig;
            }
        }

        return $widgets;
    }

    /**
     * Calculate a single widget value based on its configuration
     */
    private function calculateWidgetValue($rows, $sourceColumns, $operation, $customFormula)
    {
        if (empty($sourceColumns) || empty($rows)) {
            return 0;
        }

        $values = [];

        // Extract values from selected columns
        foreach ($rows as $row) {
            $rowValue = 0;

            foreach ($sourceColumns as $column) {
                if (isset($row[$column])) {
                    $numericValue = $this->extractNumericValue($row[$column]);
                    if ($operation === 'sum' || $operation === 'average') {
                        $rowValue += $numericValue;
                    } elseif ($operation === 'count') {
                        $rowValue += 1; // Count non-empty values
                    } elseif ($operation === 'max') {
                        $rowValue = max($rowValue, $numericValue);
                    } elseif ($operation === 'min') {
                        $rowValue = $rowValue === 0 ? $numericValue : min($rowValue, $numericValue);
                    }
                }
            }

            $values[] = $rowValue;
        }

        // Apply operation
        switch ($operation) {
            case 'sum':
                return array_sum($values);
            case 'average':
                return count($values) > 0 ? array_sum($values) / count($values) : 0;
            case 'count':
                return count(array_filter($values, function($v) { return $v > 0; }));
            case 'max':
                return empty($values) ? 0 : max($values);
            case 'min':
                return empty($values) ? 0 : min(array_filter($values, function($v) { return $v > 0; }));
            case 'custom':
                // For custom formula, return a placeholder for now
                return count($values);
            default:
                return array_sum($values);
        }
    }

    /**
     * Format widget value for display
     */
    private function formatWidgetValue($value, $operation)
    {
        if ($operation === 'count') {
            return number_format($value);
        } elseif ($operation === 'average') {
            return number_format($value, 2);
        } else {
            return number_format($value);
        }
    }

    /**
     * Generate stats from raw data calculations
     */
    private function generateStatsFromRawData($rawStats)
    {
        $stats = [];
        $widgetCount = 0;

        foreach ($rawStats as $column => $calculations) {
            if ($widgetCount >= 4) break; // Limit to 4 widgets

            $widgetTypes = ['sum', 'average', 'count', 'max'];
            $widgetNames = ['Total', 'Average', 'Count', 'Maximum'];
            $widgetIcons = ['Calculator', 'BarChart3', 'Hash', 'TrendingUp'];

            foreach ($widgetTypes as $index => $type) {
                if ($widgetCount >= 4) break;

                if (isset($calculations[$type])) {
                    $stats[] = [
                        'title' => $widgetNames[$index] . ' ' . $column,
                        'value' => number_format($calculations[$type], 2),
                        'description' => ucfirst($type) . ' of ' . $column . ' values',
                        'icon' => $widgetIcons[$index],
                        'trend' => '+0%',
                        'trendUp' => true,
                        'aiSource' => null,
                        'aiMethod' => null
                    ];
                    $widgetCount++;
                }
            }
        }

        // Fill remaining slots with default stats if needed
        while (count($stats) < 4) {
            $stats[] = [
                'title' => 'No Data',
                'value' => '0',
                'description' => 'No numeric data available',
                'icon' => 'BarChart3',
                'trend' => '0%',
                'trendUp' => false,
                'aiSource' => null,
                'aiMethod' => null
            ];
        }

        return $stats;
    }
}
