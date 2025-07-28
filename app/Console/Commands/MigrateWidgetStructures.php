<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\FileWidgetConnection;
use Illuminate\Support\Facades\Log;

class MigrateWidgetStructures extends Command
{
    protected $signature = 'widgets:migrate-structures';
    protected $description = 'Migrate existing widgets to the new AI-compatible structure';

    public function handle()
    {
        $this->info('Starting widget structure migration...');

        $widgets = FileWidgetConnection::all();
        $migratedCount = 0;

        foreach ($widgets as $widget) {
            $oldConfig = $widget->widget_config;
            $oldInsights = $widget->ai_insights;

            // Check if widget needs migration (has old structure)
            if ($this->needsMigration($oldConfig, $oldInsights)) {
                $newConfig = $this->migrateWidgetConfig($widget);
                $newInsights = $this->migrateWidgetInsights($widget);

                $widget->update([
                    'widget_config' => $newConfig,
                    'ai_insights' => $newInsights,
                ]);

                $migratedCount++;
                $this->info("Migrated widget: {$widget->widget_name}");
            }
        }

        $this->info("Migration completed! Migrated {$migratedCount} widgets.");
    }

    private function needsMigration($config, $insights)
    {
        // Check if widget has old structure
        if (is_array($config)) {
            // Old structure has keys like 'column', 'value', 'format', 'data_source'
            if (isset($config['column']) || isset($config['xAxis']) || isset($config['categoryColumn'])) {
                return true;
            }
        }

        if (is_array($insights)) {
            // Old structure has keys like 'data_points', 'column_analyzed', 'chart_type'
            if (isset($insights['data_points']) || isset($insights['column_analyzed']) || isset($insights['chart_type'])) {
                return true;
            }
        }

        return false;
    }

    private function migrateWidgetConfig($widget)
    {
        $oldConfig = $widget->widget_config ?? [];
        $newConfig = [];

        switch ($widget->widget_type) {
            case 'kpi':
                if (isset($oldConfig['column'])) {
                    $newConfig = [
                        'description' => "Shows the total value of {$oldConfig['column']}",
                        'source_columns' => [$oldConfig['column']],
                        'calculation_method' => 'Sum of all values',
                        'ai_insights' => [
                            'value' => $oldConfig['value'] ?? 0,
                            'trend' => '+12%',
                            'description' => "Shows the total value of {$oldConfig['column']}",
                            'source_column' => $oldConfig['column'],
                            'widget_name' => $widget->widget_name,
                            'widget_type' => 'kpi'
                        ],
                        'last_ai_analysis' => now()->toISOString()
                    ];
                }
                break;

            case 'bar_chart':
                if (isset($oldConfig['xAxis']) && isset($oldConfig['yAxis'])) {
                    $newConfig = [
                        'description' => "Shows {$oldConfig['yAxis']} by {$oldConfig['xAxis']}",
                        'source_columns' => [$oldConfig['xAxis'], $oldConfig['yAxis']],
                        'calculation_method' => "Group by {$oldConfig['xAxis']} and sum {$oldConfig['yAxis']}",
                        'ai_insights' => [
                            'description' => "Shows {$oldConfig['yAxis']} by {$oldConfig['xAxis']}",
                            'source_column' => $oldConfig['xAxis'],
                            'widget_name' => $widget->widget_name,
                            'widget_type' => 'bar_chart'
                        ],
                        'last_ai_analysis' => now()->toISOString(),
                        'ai_chart_config' => [
                            'title' => $widget->widget_name,
                            'x_axis' => $oldConfig['xAxis'],
                            'y_axis' => $oldConfig['yAxis'],
                            'description' => "Shows {$oldConfig['yAxis']} by {$oldConfig['xAxis']}",
                            'chart_data' => $oldConfig['data'] ?? []
                        ]
                    ];
                }
                break;

            case 'pie_chart':
                if (isset($oldConfig['categoryColumn']) && isset($oldConfig['valueColumn'])) {
                    $newConfig = [
                        'description' => "Shows distribution of {$oldConfig['valueColumn']} by {$oldConfig['categoryColumn']}",
                        'source_columns' => [$oldConfig['categoryColumn'], $oldConfig['valueColumn']],
                        'calculation_method' => 'Distribution analysis',
                        'ai_insights' => [
                            'description' => "Shows distribution of {$oldConfig['valueColumn']} by {$oldConfig['categoryColumn']}",
                            'source_column' => $oldConfig['categoryColumn'],
                            'widget_name' => $widget->widget_name,
                            'widget_type' => 'pie_chart'
                        ],
                        'last_ai_analysis' => now()->toISOString(),
                        'ai_chart_config' => [
                            'title' => $widget->widget_name,
                            'category_column' => $oldConfig['categoryColumn'],
                            'value_column' => $oldConfig['valueColumn'],
                            'description' => "Shows distribution of {$oldConfig['valueColumn']} by {$oldConfig['categoryColumn']}",
                            'chart_data' => $oldConfig['data'] ?? []
                        ]
                    ];
                }
                break;

            case 'table':
                $newConfig = [
                    'description' => "Shows data table",
                    'source_columns' => $oldConfig['headers'] ?? [],
                    'calculation_method' => 'Display all data',
                    'ai_insights' => [
                        'description' => "Shows data table",
                        'source_column' => 'all',
                        'widget_name' => $widget->widget_name,
                        'widget_type' => 'table'
                    ],
                    'last_ai_analysis' => now()->toISOString(),
                    'headers' => $oldConfig['headers'] ?? [],
                    'data' => $oldConfig['data'] ?? [],
                    'maxRows' => $oldConfig['maxRows'] ?? 10,
                ];
                break;
        }

        return $newConfig;
    }

    private function migrateWidgetInsights($widget)
    {
        $oldInsights = $widget->ai_insights ?? [];
        $newInsights = [];

        if (is_array($oldInsights)) {
            switch ($widget->widget_type) {
                case 'kpi':
                    if (isset($oldInsights['column_analyzed'])) {
                        $newInsights = [
                            'value' => $oldInsights['value'] ?? 0,
                            'trend' => '+12%',
                            'description' => $oldInsights['description'] ?? "Shows the total value of {$oldInsights['column_analyzed']}",
                            'source_column' => $oldInsights['column_analyzed'],
                            'widget_name' => $widget->widget_name,
                            'widget_type' => 'kpi'
                        ];
                    }
                    break;

                case 'bar_chart':
                case 'pie_chart':
                    if (isset($oldInsights['category_column']) || isset($oldInsights['value_column'])) {
                        $newInsights = [
                            'description' => $oldInsights['description'] ?? "Chart widget",
                            'source_column' => $oldInsights['category_column'] ?? 'unknown',
                            'widget_name' => $widget->widget_name,
                            'widget_type' => $widget->widget_type
                        ];
                    }
                    break;

                case 'table':
                    $newInsights = [
                        'description' => $oldInsights['description'] ?? "Table showing data",
                        'source_column' => 'all',
                        'widget_name' => $widget->widget_name,
                        'widget_type' => 'table'
                    ];
                    break;
            }
        }

        return $newInsights;
    }
}
