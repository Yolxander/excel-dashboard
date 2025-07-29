<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;
use App\Models\FileWidgetConnection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Services\AIService;
use App\Services\OnboardingService;

class ConnectedFilesController extends Controller
{
    public function index()
    {
        $uploadedFiles = UploadedFile::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        $displayedWidgets = FileWidgetConnection::with('uploadedFile')
            ->whereHas('uploadedFile', function($query) {
                $query->where('user_id', Auth::id());
            })
            ->where('is_displayed', true)
            ->orderBy('display_order')
            ->get();

        // Check onboarding progress
        $user = Auth::user();
        OnboardingService::checkAndMarkSteps($user);
        $onboardingData = OnboardingService::getOnboardingData($user);

        return Inertia::render('ConnectedFiles', [
            'uploadedFiles' => $uploadedFiles,
            'dashboardWidgets' => $displayedWidgets,
            'onboardingData' => $onboardingData,
        ]);
    }

    public function connectFile(Request $request, $fileId)
    {
        $file = UploadedFile::where('id', $fileId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($file->status !== 'completed') {
            return response()->json(['error' => 'File is not processed yet'], 400);
        }

        // Deactivate all existing widgets first
        FileWidgetConnection::where('is_displayed', true)
            ->whereHas('uploadedFile', function($query) {
                $query->where('user_id', Auth::id());
            })
            ->update(['is_displayed' => false]);

        // Set all widgets for this file as displayed
        FileWidgetConnection::where('uploaded_file_id', $fileId)
            ->update(['is_displayed' => true]);

        // Check onboarding progress after connecting file
        $user = Auth::user();
        OnboardingService::checkAndMarkSteps($user);

        Log::info('File connected to dashboard: ' . $file->original_filename);

        return response()->json([
            'success' => true,
            'message' => $file->original_filename . ' is now connected to the dashboard',
            'file' => $file,
        ]);
    }

    public function disconnectFile(Request $request, $fileId)
    {
        $file = UploadedFile::where('id', $fileId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Disconnect widgets from this file
        FileWidgetConnection::where('uploaded_file_id', $fileId)->update([
            'is_displayed' => false
        ]);

        Log::info('File disconnected from dashboard: ' . $file->original_filename);

        return response()->json([
            'success' => true,
            'message' => $file->original_filename . ' has been disconnected from the dashboard'
        ]);
    }

    public function analyzeFileWithAI(Request $request, $fileId)
    {
        $file = UploadedFile::where('id', $fileId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

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
                    'message' => 'AI analysis completed successfully. New widgets have been created and existing widgets have been enhanced with AI insights.',
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
