<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;
use App\Models\DashboardWidget;
use Illuminate\Support\Facades\Log;
use App\Services\AIService;

class ConnectedFilesController extends Controller
{
    public function index()
    {
        $uploadedFiles = UploadedFile::orderBy('created_at', 'desc')->get();
        $dashboardWidgets = DashboardWidget::with('uploadedFile')->active()->ordered()->get();

        return Inertia::render('ConnectedFiles', [
            'uploadedFiles' => $uploadedFiles,
            'dashboardWidgets' => $dashboardWidgets,
        ]);
    }

    public function connectFile(Request $request, $fileId)
    {
        $file = UploadedFile::findOrFail($fileId);

        if ($file->status !== 'completed') {
            return response()->json(['error' => 'File is not processed yet'], 400);
        }

        // Deactivate all existing widgets first
        DashboardWidget::where('is_active', true)->update(['is_active' => false]);

        // Create or update dashboard widgets for this file
        $this->createWidgetsForFile($file);

        // Analyze file data with AI
        $aiService = new AIService();
        $aiInsights = $aiService->analyzeFileData($file);

        // Generate chart data from AI insights if available
        $chartData = [];
        if ($aiInsights && isset($aiInsights['chart_recommendations'])) {
            $chartData = $this->generateChartDataFromAIInsights($aiInsights);
        }

        Log::info('File connected to dashboard: ' . $file->original_filename);

        return response()->json([
            'success' => true,
            'message' => $file->original_filename . ' is now connected to the dashboard with AI insights',
            'file' => $file,
            'ai_insights' => $aiInsights,
            'chart_data' => $chartData
        ]);
    }

    public function disconnectFile(Request $request, $fileId)
    {
        $file = UploadedFile::findOrFail($fileId);

        // Disconnect widgets from this file
        DashboardWidget::where('uploaded_file_id', $fileId)->update([
            'uploaded_file_id' => null,
            'is_active' => false
        ]);

        Log::info('File disconnected from dashboard: ' . $file->original_filename);

        return response()->json([
            'success' => true,
            'message' => $file->original_filename . ' has been disconnected from the dashboard'
        ]);
    }

    private function createWidgetsForFile($file)
    {
        // Create default widgets for the file
        $widgets = [
            [
                'widget_type' => 'kpi',
                'widget_name' => 'Total Sales',
                'display_order' => 1,
            ],
            [
                'widget_type' => 'kpi',
                'widget_name' => 'Active Recruiters',
                'display_order' => 2,
            ],
            [
                'widget_type' => 'kpi',
                'widget_name' => 'Target Achievement',
                'display_order' => 3,
            ],
            [
                'widget_type' => 'kpi',
                'widget_name' => 'Avg Commission',
                'display_order' => 4,
            ],
            [
                'widget_type' => 'bar_chart',
                'widget_name' => 'Performance Overview',
                'display_order' => 5,
            ],
            [
                'widget_type' => 'pie_chart',
                'widget_name' => 'Distribution',
                'display_order' => 6,
            ],
            [
                'widget_type' => 'table',
                'widget_name' => 'Excel Data Table',
                'display_order' => 7,
            ],
        ];

        foreach ($widgets as $widget) {
            DashboardWidget::updateOrCreate(
                [
                    'widget_type' => $widget['widget_type'],
                    'widget_name' => $widget['widget_name'],
                ],
                [
                    'uploaded_file_id' => $file->id,
                    'is_active' => true,
                    'display_order' => $widget['display_order'],
                ]
            );
        }
    }

    public function analyzeFileWithAI(Request $request, $fileId)
    {
        $file = UploadedFile::findOrFail($fileId);

        if ($file->status !== 'completed') {
            return response()->json(['error' => 'File is not processed yet'], 400);
        }

        try {
            $aiService = new AIService();
            $insights = $aiService->analyzeFileData($file);

            if ($insights) {
                Log::info('AI analysis completed successfully for file: ' . $file->original_filename);
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

    public function getWidgetInsights(Request $request, $widgetId)
    {
        try {
            $aiService = new AIService();
            $insights = $aiService->getWidgetInsights($widgetId);

            if ($insights) {
                return response()->json([
                    'success' => true,
                    'insights' => $insights
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No AI insights available for this widget'
                ], 404);
            }
        } catch (\Exception $e) {
            Log::error('Error getting widget insights: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving widget insights: ' . $e->getMessage()
            ], 500);
        }
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
}
