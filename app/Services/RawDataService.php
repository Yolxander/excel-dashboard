<?php

namespace App\Services;

use App\Models\DashboardWidget;
use App\Models\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Services\FileEncryptionService;

class RawDataService
{
    /**
     * Generate widgets and charts from raw file data
     */
    public function generateRawDataWidgets(UploadedFile $file, int $userId): array
    {
        try {
            // Read the Excel file
            $data = $this->readExcelFile($file);

            if (empty($data)) {
                throw new \Exception('No data found in the file');
            }

            // Get column names from the first row
            $columns = array_keys($data[0]);

            // Delete existing raw data widgets for this user
            DashboardWidget::where('user_id', $userId)
                ->where('data_type', 'raw')
                ->delete();

            $widgets = [];

            // Generate 4 KPI widgets based on numeric columns
            $numericColumns = $this->getNumericColumns($data, $columns);
            $widgets = array_merge($widgets, $this->generateKPIWidgets($numericColumns, $data, $userId));

            // Generate 2 chart widgets
            $chartWidgets = $this->generateChartWidgets($data, $columns, $userId);
            $widgets = array_merge($widgets, $chartWidgets);

            return [
                'success' => true,
                'message' => 'Raw data widgets generated successfully',
                'widgets' => $widgets
            ];

        } catch (\Exception $e) {
            Log::error('Error generating raw data widgets: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to generate raw data widgets: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Read Excel file and return data as array
     */
    private function readExcelFile(UploadedFile $file): array
    {
        try {
            // Use FileEncryptionService to decrypt and retrieve the file
            $encryptionService = new FileEncryptionService();
            $decryptedFile = $encryptionService->decryptAndRetrieve($file->file_path, $file->original_filename);

            $tempPath = $decryptedFile['temp_path'];

            if (!file_exists($tempPath)) {
                throw new \Exception('Decrypted file not found at temporary path');
            }

            // Use PhpSpreadsheet to read the file
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($tempPath);
            $worksheet = $spreadsheet->getActiveSheet();

            $data = [];
            $headers = [];
            $firstRow = true;

            foreach ($worksheet->getRowIterator() as $row) {
                $rowData = [];
                $cellIterator = $row->getCellIterator();
                $cellIterator->setIterateOnlyExistingCells(false);

                $colIndex = 0;
                foreach ($cellIterator as $cell) {
                    $value = $cell->getValue();

                    if ($firstRow) {
                        $headers[$colIndex] = $value ?: "Column" . ($colIndex + 1);
                    } else {
                        $rowData[$headers[$colIndex]] = $value;
                    }
                    $colIndex++;
                }

                if (!$firstRow && !empty($rowData)) {
                    $data[] = $rowData;
                }

                $firstRow = false;
            }

            // Clean up temporary file
            if (file_exists($tempPath)) {
                unlink($tempPath);
            }

            return $data;
        } catch (\Exception $e) {
            // Clean up temporary file in case of error
            if (isset($tempPath) && file_exists($tempPath)) {
                unlink($tempPath);
            }
            throw $e;
        }
    }

    /**
     * Get numeric columns from the data
     */
    private function getNumericColumns(array $data, array $columns): array
    {
        $numericColumns = [];

        foreach ($columns as $column) {
            $hasNumericData = false;
            $sampleCount = 0;

            foreach ($data as $row) {
                if (isset($row[$column])) {
                    $value = $row[$column];
                    if (is_numeric($value) && $value !== null && $value !== '') {
                        $hasNumericData = true;
                        $sampleCount++;
                        if ($sampleCount >= 5) break; // Check first 5 rows
                    }
                }
            }

            if ($hasNumericData) {
                $numericColumns[] = $column;
            }
        }

        return $numericColumns;
    }

    /**
     * Generate KPI widgets from numeric columns
     */
    private function generateKPIWidgets(array $numericColumns, array $data, int $userId): array
    {
        $widgets = [];
        $widgetTypes = ['sum', 'average', 'count', 'max'];
        $widgetNames = ['Total', 'Average', 'Count', 'Maximum'];
        $widgetIcons = ['Calculator', 'BarChart3', 'Hash', 'TrendingUp'];

        for ($i = 0; $i < 4 && $i < count($numericColumns); $i++) {
            $column = $numericColumns[$i];
            $widgetType = $widgetTypes[$i];
            $widgetName = $widgetNames[$i] . ' ' . $column;
            $widgetIcon = $widgetIcons[$i];

            $value = $this->calculateWidgetValue($data, $column, $widgetType);

            $widget = DashboardWidget::create([
                'user_id' => $userId,
                'widget_name' => $widgetName,
                'widget_type' => 'kpi',
                'widget_config' => [
                    'column' => $column,
                    'calculation_type' => $widgetType,
                    'icon' => $widgetIcon,
                    'description' => ucfirst($widgetType) . ' of ' . $column . ' values'
                ],
                'data_type' => 'raw',
                'is_displayed' => true,
                'display_order' => $i + 1
            ]);

            $widgets[] = $widget;
        }

        return $widgets;
    }

    /**
     * Generate chart widgets
     */
    private function generateChartWidgets(array $data, array $columns, int $userId): array
    {
        $widgets = [];
        $numericColumns = $this->getNumericColumns($data, $columns);

        // Generate bar chart widget
        if (count($numericColumns) >= 1) {
            $barChartColumn = $numericColumns[0];
            $widget = DashboardWidget::create([
                'user_id' => $userId,
                'widget_name' => $barChartColumn . ' Distribution',
                'widget_type' => 'bar_chart',
                'widget_config' => [
                    'column' => $barChartColumn,
                    'description' => 'Distribution of ' . $barChartColumn . ' values',
                    'chart_type' => 'bar'
                ],
                'data_type' => 'raw',
                'is_displayed' => true,
                'display_order' => 5
            ]);
            $widgets[] = $widget;
        }

        // Generate pie chart widget
        if (count($columns) >= 1) {
            $pieChartColumn = $columns[0];
            $widget = DashboardWidget::create([
                'user_id' => $userId,
                'widget_name' => $pieChartColumn . ' Breakdown',
                'widget_type' => 'pie_chart',
                'widget_config' => [
                    'column' => $pieChartColumn,
                    'description' => 'Breakdown of ' . $pieChartColumn . ' categories',
                    'chart_type' => 'pie'
                ],
                'data_type' => 'raw',
                'is_displayed' => true,
                'display_order' => 6
            ]);
            $widgets[] = $widget;
        }

        return $widgets;
    }

    /**
     * Calculate widget value based on calculation type
     */
    private function calculateWidgetValue(array $data, string $column, string $calculationType): float
    {
        $values = array_filter(array_column($data, $column), function($value) {
            return is_numeric($value) && $value !== null && $value !== '';
        });

        if (empty($values)) {
            return 0;
        }

        switch ($calculationType) {
            case 'sum':
                return array_sum($values);
            case 'average':
                return array_sum($values) / count($values);
            case 'count':
                return count($values);
            case 'max':
                return max($values);
            default:
                return 0;
        }
    }

    /**
     * Get raw data for dashboard display
     */
    public function getRawDataForDashboard(UploadedFile $file): array
    {
        try {
            $data = $this->readExcelFile($file);

            if (empty($data)) {
                return [
                    'success' => false,
                    'message' => 'No data found in file'
                ];
            }

            $columns = array_keys($data[0]);
            $numericColumns = $this->getNumericColumns($data, $columns);

            // Calculate stats for KPI widgets
            $stats = [];
            foreach ($numericColumns as $column) {
                $values = array_filter(array_column($data, $column), function($value) {
                    return is_numeric($value) && $value !== null && $value !== '';
                });

                if (!empty($values)) {
                    $stats[$column] = [
                        'sum' => array_sum($values),
                        'average' => array_sum($values) / count($values),
                        'count' => count($values),
                        'max' => max($values)
                    ];
                }
            }

            // Generate chart data
            $chartData = $this->generateChartData($data, $columns, $numericColumns);

            return [
                'success' => true,
                'data' => $data,
                'columns' => $columns,
                'numericColumns' => $numericColumns,
                'stats' => $stats,
                'chartData' => $chartData
            ];

        } catch (\Exception $e) {
            Log::error('Error getting raw data: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to read file data: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Generate chart data for bar and pie charts
     */
    private function generateChartData(array $data, array $columns, array $numericColumns): array
    {
        $chartData = [
            'barChart' => [],
            'pieChart' => []
        ];

        // Generate bar chart data from first numeric column
        if (!empty($numericColumns)) {
            $barColumn = $numericColumns[0];
            $barValues = array_count_values(array_column($data, $barColumn));
            $chartData['barChart'] = array_map(function($name, $value) {
                return ['name' => $name, 'value' => $value];
            }, array_keys($barValues), array_values($barValues));
        }

        // Generate pie chart data from first column
        if (!empty($columns)) {
            $pieColumn = $columns[0];
            $pieValues = array_count_values(array_column($data, $pieColumn));
            $chartData['pieChart'] = array_map(function($name, $value) {
                return ['name' => $name, 'value' => $value];
            }, array_keys($pieValues), array_values($pieValues));
        }

        return $chartData;
    }
}
