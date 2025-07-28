<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;
use App\Models\DashboardWidget;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
        public function index()
    {
        // Get the active connected file from dashboard widgets
        $activeWidget = DashboardWidget::with('uploadedFile')
            ->where('is_active', true)
            ->whereNotNull('uploaded_file_id')
            ->orderBy('display_order')
            ->first();

        $connectedFile = null;
        $stats = [];
        $chartData = [];
        $tableData = [];

        if ($activeWidget && $activeWidget->uploadedFile && $activeWidget->uploadedFile->processed_data) {
            $file = $activeWidget->uploadedFile;
            $data = $file->processed_data;
            Log::info('Using data from connected file: ' . $file->original_filename);

            $stats = $this->generateStatsFromData($data);
            $chartData = $this->generateChartDataFromData($data);
            $tableData = $this->generateTableDataFromData($data);
            $connectedFile = $file->original_filename;

            Log::info('Generated dynamic data for dashboard from connected file');
        } else {
            Log::info('No connected files found, using default data');
            // Fallback to mock data if no files are connected
            $stats = [
                'totalSales' => 456789,
                'activeRecruiters' => 24,
                'targetAchievement' => 87,
                'avgCommission' => 1250,
            ];

            $chartData = [
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

            $tableData = [];
            $connectedFile = null;
        }

        $props = [
            'stats' => $stats,
            'connectedFile' => $connectedFile,
            'chartData' => $chartData,
            'tableData' => $tableData,
        ];

        Log::info('Rendering dashboard with props: ' . json_encode($props));

        return Inertia::render('Dashboard', $props);
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
        $salesColumn = $this->findColumn($headers, ['sales', 'amount', 'revenue', 'total', 'price', 'commission']);
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
        $targetAchievement = $totalSalesCount > 0 ? round(($completedSales / $totalSalesCount) * 100) : 87;
        $avgCommission = $activeRecruiters > 0 ? round($totalSales / $activeRecruiters) : 1250;

        Log::info("Calculated stats - Total Sales: $totalSales, Active Recruiters: $activeRecruiters, Target Achievement: $targetAchievement");

        return [
            'totalSales' => $totalSales > 0 ? $totalSales : 456789,
            'activeRecruiters' => $activeRecruiters > 0 ? $activeRecruiters : 24,
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
}
