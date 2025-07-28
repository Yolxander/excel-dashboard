<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;
use App\Models\DashboardWidget;
use Illuminate\Support\Facades\Log;
use App\Services\AIService;

class DashboardController extends Controller
{
        public function index()
    {
        // Get the most recently connected file from dashboard widgets
        $activeWidget = DashboardWidget::with('uploadedFile')
            ->where('is_active', true)
            ->whereNotNull('uploaded_file_id')
            ->whereHas('uploadedFile', function($query) {
                $query->where('status', 'completed');
            })
            ->orderBy('updated_at', 'desc')
            ->first();

        $connectedFile = null;
        $stats = [];
        $chartData = [];
        $tableData = [];

        if ($activeWidget && $activeWidget->uploadedFile && $activeWidget->uploadedFile->processed_data) {
            $file = $activeWidget->uploadedFile;
            $data = $file->processed_data;
            Log::info('Using data from connected file: ' . $file->original_filename);

                        // Try to get AI-enhanced stats first
            $aiService = new AIService();
            $aiInsights = $aiService->analyzeFileData($file);

            if ($aiInsights && isset($aiInsights['widget_insights'])) {
                $stats = $this->generateStatsFromAIInsights($aiInsights['widget_insights']);
                $chartData = $this->generateChartDataFromAIInsights($aiInsights);
                Log::info('Using AI-enhanced stats and charts for dashboard');
            } else {
                $stats = $this->generateStatsFromData($data);
                $chartData = $this->generateChartDataFromData($data);
                Log::info('Using standard stats and charts for dashboard');
            }

            $tableData = $this->generateTableDataFromData($data);
            $connectedFile = $file->original_filename;

            Log::info('Generated dynamic data for dashboard from connected file');
        } else {
            Log::info('No connected files found, showing welcome state');
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

        $props = [
            'stats' => $stats,
            'connectedFile' => $connectedFile,
            'chartData' => $chartData,
            'chartTitles' => $this->getChartTitles($aiInsights),
            'chartDescriptions' => $this->getChartDescriptions($aiInsights),
            'tableData' => $tableData,
            'dataType' => $aiInsights && isset($aiInsights['widget_insights']) ? 'ai' : 'raw',
            'availableColumns' => $activeWidget && $activeWidget->uploadedFile && $activeWidget->uploadedFile->processed_data
                ? $activeWidget->uploadedFile->processed_data['headers'] ?? []
                : [],
        ];

        Log::info('Rendering dashboard with props: ' . json_encode($props));

        return Inertia::render('Dashboard', $props);
    }

    private function generateStatsFromAIInsights($widgetInsights)
    {
        Log::info('Generating stats from AI insights: ' . json_encode($widgetInsights));

        $stats = [
            'totalSales' => $widgetInsights['total_sales']['value'] ?? 0,
            'activeRecruiters' => $widgetInsights['active_recruiters']['value'] ?? 0,
            'targetAchievement' => $widgetInsights['target_achievement']['value'] ?? 0,
            'avgCommission' => $widgetInsights['avg_commission']['value'] ?? 0,
        ];

        // Store AI insights for frontend display
        $stats['ai_insights'] = $widgetInsights;

        Log::info("AI-enhanced stats generated: " . json_encode($stats));
        return $stats;
    }

    private function generateChartDataFromAIInsights($aiInsights)
    {
        Log::info('Generating chart data from AI insights: ' . json_encode($aiInsights));

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

        Log::info("AI-enhanced chart data generated: " . json_encode($chartData));
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

        Log::info('Processing stats from data with headers: ' . implode(', ', $headers));
        Log::info('Number of rows: ' . count($rows));

        if (empty($rows)) {
            return $this->getDefaultStats();
        }

        // Try to identify relevant columns
        $salesColumn = $this->findColumn($headers, ['sales', 'amount', 'revenue', 'total', 'price', 'commission', 'commission earned', 'revenue']);
        $recruiterColumn = $this->findColumn($headers, ['recruiter', 'employee', 'staff', 'name', 'salesperson']);
        $statusColumn = $this->findColumn($headers, ['status', 'state', 'condition']);
        $dateColumn = $this->findColumn($headers, ['date', 'created', 'timestamp']);

        Log::info('Found columns - Sales: ' . ($salesColumn ?? 'not found') . ', Recruiter: ' . ($recruiterColumn ?? 'not found'));

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

        Log::info("Calculated stats - Total Sales: $totalSales, Active Recruiters: $activeRecruiters, Target Achievement: $targetAchievement");

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

        Log::info('Generating chart data from headers: ' . implode(', ', $headers));
        Log::info('Number of rows for charts: ' . count($rows));

        if (empty($rows)) {
            Log::info('No rows found, using default chart data');
            return $this->getDefaultChartData();
        }

        // Generate bar chart data
        $barChartData = [];
        $pieChartData = [];

        // Dynamically analyze the data to find the best columns for charts
        $analysis = $this->analyzeDataForCharts($rows, $headers);
        $categoryColumn = $analysis['categoryColumn'];
        $valueColumn = $analysis['valueColumn'];

        Log::info('Dynamic analysis found - Category: ' . ($categoryColumn ?? 'not found') . ', Value: ' . ($valueColumn ?? 'not found'));

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

            Log::info('Generated chart data with dynamic columns - Bar: ' . count($barChartData) . ' items, Pie: ' . count($pieChartData) . ' items');
        } else {
            // Fallback: use first two columns
            $firstColumn = $headers[0] ?? 'Category';
            $secondColumn = $headers[1] ?? 'Value';

            Log::info('Using fallback columns - First: ' . $firstColumn . ', Second: ' . $secondColumn);

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

            Log::info('Generated chart data with fallback columns - Bar: ' . count($barChartData) . ' items, Pie: ' . count($pieChartData) . ' items');
        }

        $result = [
            'barChart' => $barChartData,
            'pieChart' => $pieChartData
        ];

        Log::info('Final chart data: ' . json_encode($result));

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

        Log::info('Searching for value columns in headers: ' . implode(', ', $headers));

        // First, try exact matches
        foreach ($headers as $header) {
            $headerLower = strtolower($header);
            foreach ($valueColumns as $valueCol) {
                if ($headerLower === $valueCol) {
                    Log::info('Found exact match value column: ' . $header);
                    return $header;
                }
            }
        }

        // Then try partial matches, but avoid 'salesperson' when looking for 'sales'
        foreach ($headers as $header) {
            $headerLower = strtolower($header);
            foreach ($valueColumns as $valueCol) {
                if (strpos($headerLower, $valueCol) !== false && $headerLower !== 'salesperson') {
                    Log::info('Found partial match value column: ' . $header);
                    return $header;
                }
            }
        }

        Log::info('No value column found');
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
        Log::info('Analyzing data for charts with headers: ' . implode(', ', $headers));

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

    public function analyzeCurrentFileWithAI(Request $request)
    {
        // Get the most recently connected file from dashboard widgets
        $activeWidget = DashboardWidget::with('uploadedFile')
            ->where('is_active', true)
            ->whereNotNull('uploaded_file_id')
            ->whereHas('uploadedFile', function($query) {
                $query->where('status', 'completed');
            })
            ->orderBy('updated_at', 'desc')
            ->first();

        if (!$activeWidget || !$activeWidget->uploadedFile) {
            return response()->json([
                'success' => false,
                'message' => 'No connected file found'
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

    public function updateWithRawData(Request $request)
    {
        // Get the most recently connected file from dashboard widgets
        $activeWidget = DashboardWidget::with('uploadedFile')
            ->where('is_active', true)
            ->whereNotNull('uploaded_file_id')
            ->whereHas('uploadedFile', function($query) {
                $query->where('status', 'completed');
            })
            ->orderBy('updated_at', 'desc')
            ->first();

        if (!$activeWidget || !$activeWidget->uploadedFile) {
            return response()->json([
                'success' => false,
                'message' => 'No connected file found'
            ], 404);
        }

        try {
            $file = $activeWidget->uploadedFile;
            $data = $file->processed_data;

            // Generate stats from raw data (without AI)
            $stats = $this->generateStatsFromData($data);

            // Update widget configurations to use raw data
            $widgets = DashboardWidget::where('uploaded_file_id', $file->id)
                ->where('is_active', true)
                ->get();

            foreach ($widgets as $widget) {
                $currentConfig = $widget->widget_config ?? [];
                $currentConfig['data_source'] = 'raw';
                $currentConfig['last_updated'] = now()->toISOString();

                $widget->update([
                    'widget_config' => $currentConfig
                ]);
            }

            Log::info('Dashboard updated with raw data for file: ' . $file->original_filename);

            return response()->json([
                'success' => true,
                'message' => 'Dashboard updated with raw data successfully',
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Raw data update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update with raw data: ' . $e->getMessage()
            ], 500);
        }
    }
}
