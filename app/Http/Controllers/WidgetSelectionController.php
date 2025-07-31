<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;
use App\Models\FileWidgetConnection;
use App\Models\DashboardWidget;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;


class WidgetSelectionController extends Controller
{
    public function index()
    {
        $uploadedFiles = UploadedFile::where('user_id', Auth::id())
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->get();

        $currentFile = null;
        $availableWidgets = [];
        $displayedWidgets = [];
        $dataType = 'ai'; // default

        // Get the currently connected file from FileWidgetConnection (AI widgets)
        $connectedFile = FileWidgetConnection::with('uploadedFile')
            ->whereHas('uploadedFile', function($query) {
                $query->where('user_id', Auth::id());
            })
            ->where('is_displayed', true)
            ->orderBy('display_order')
            ->first();

        // Get the currently connected file from DashboardWidget (Raw data widgets)
        $dashboardWidget = DashboardWidget::where('user_id', Auth::id())
            ->where('is_displayed', true)
            ->orderBy('display_order')
            ->first();

        // Determine which type of widgets are active
        if ($dashboardWidget) {
            $dataType = 'raw';
            // For raw data widgets, get the most recent file
            $currentFile = UploadedFile::where('user_id', Auth::id())
                ->where('status', 'completed')
                ->orderBy('updated_at', 'desc')
                ->first();

            if ($currentFile) {
                // Get raw data widgets
                $availableWidgets = DashboardWidget::where('user_id', Auth::id())
                    ->orderBy('display_order')
                    ->get();

                $displayedWidgets = DashboardWidget::where('user_id', Auth::id())
                    ->where('is_displayed', true)
                    ->orderBy('display_order')
                    ->get();
            }
        } elseif ($connectedFile && $connectedFile->uploadedFile) {
            $dataType = 'ai';
            $currentFile = $connectedFile->uploadedFile;

            // Get all available widgets for this file
            $availableWidgets = FileWidgetConnection::where('uploaded_file_id', $currentFile->id)
                ->orderBy('display_order')
                ->get();

            // Get currently displayed widgets
            $displayedWidgets = FileWidgetConnection::where('uploaded_file_id', $currentFile->id)
                ->where('is_displayed', true)
                ->orderBy('display_order')
                ->get();
        }



        return Inertia::render('WidgetSelection', [
            'uploadedFiles' => $uploadedFiles,
            'currentFile' => $currentFile,
            'availableWidgets' => $availableWidgets,
            'displayedWidgets' => $displayedWidgets,
            'dataType' => $dataType,
        ]);
    }

    public function getWidgetsForFile(Request $request, $fileId)
    {
        $file = UploadedFile::where('id', $fileId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $availableWidgets = FileWidgetConnection::where('uploaded_file_id', $file->id)
            ->orderBy('display_order')
            ->get();

        $displayedWidgets = FileWidgetConnection::where('uploaded_file_id', $file->id)
            ->where('is_displayed', true)
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'success' => true,
            'availableWidgets' => $availableWidgets,
            'displayedWidgets' => $displayedWidgets,
        ]);
    }

    public function updateWidgetSelection(Request $request)
    {
        $request->validate([
            'fileId' => 'required|exists:uploaded_files,id',
            'selectedWidgetIds' => 'required|array',
            'selectedWidgetIds.*' => 'exists:file_widget_connections,id',
        ]);

        $fileId = $request->fileId;
        $selectedWidgetIds = $request->selectedWidgetIds;

        // Verify the file belongs to the authenticated user
        $file = UploadedFile::where('id', $fileId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        Log::info("Updating widget selection for file ID: {$fileId}");
        Log::info("Selected widget IDs: " . json_encode($selectedWidgetIds));

        // Reset all widgets for this file to not displayed
        FileWidgetConnection::where('uploaded_file_id', $fileId)
            ->update(['is_displayed' => false]);

        // Set selected widgets as displayed
        FileWidgetConnection::whereIn('id', $selectedWidgetIds)
            ->update(['is_displayed' => true]);

        // Update display order for selected widgets
        $displayOrder = 1;
        foreach ($selectedWidgetIds as $widgetId) {
            FileWidgetConnection::where('id', $widgetId)
                ->update(['display_order' => $displayOrder]);
            $displayOrder++;
        }

        // Log the updated widgets
        $updatedWidgets = FileWidgetConnection::where('uploaded_file_id', $fileId)
            ->where('is_displayed', true)
            ->orderBy('display_order')
            ->get();



        return response()->json([
            'success' => true,
            'message' => 'Widget selection updated successfully',
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

        Log::info("Connecting file to dashboard: " . $file->original_filename);

        // Set all widgets for this file as displayed
        $updatedWidgets = FileWidgetConnection::where('uploaded_file_id', $fileId)
            ->update(['is_displayed' => true]);

        // Set all widgets for other files as not displayed
        $otherWidgets = FileWidgetConnection::where('uploaded_file_id', '!=', $fileId)
            ->whereHas('uploadedFile', function($query) {
                $query->where('user_id', Auth::id());
            })
            ->update(['is_displayed' => false]);

        // Log the connected widgets
        $connectedWidgets = FileWidgetConnection::where('uploaded_file_id', $fileId)
            ->where('is_displayed', true)
            ->orderBy('display_order')
            ->get();

        Log::info("Connected widgets for file ID {$fileId}: " . json_encode($connectedWidgets->toArray()));

        return response()->json([
            'success' => true,
            'message' => $file->original_filename . ' is now connected to the dashboard',
        ]);
    }

    public function createAIWidget(Request $request)
    {
        Log::info('AI Widget creation request received', $request->all());

        $request->validate([
            'file_id' => 'required|exists:uploaded_files,id',
            'description' => 'nullable|string',
            'widget_type' => 'required|string',
        ]);

        // Verify the file belongs to the authenticated user
        $file = UploadedFile::where('id', $request->file_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        Log::info('File found for AI widget creation', ['file_id' => $file->id, 'filename' => $file->original_filename]);

        try {
            // Get AI service instance
            $aiService = app(\App\Services\AIService::class);

            Log::info('Calling AI service to create widget', [
                'file_id' => $file->id,
                'description' => $request->description,
                'widget_type' => $request->widget_type
            ]);

            // Generate widget using AI
            $widgetData = $aiService->createWidget(
                $file,
                $request->description,
                $request->widget_type
            );

            Log::info('AI service returned widget data', $widgetData);

            // Generate unique widget name if it already exists
            $baseName = $widgetData['name'];
            $widgetName = $baseName;
            $counter = 1;

            while (FileWidgetConnection::where('uploaded_file_id', $file->id)
                    ->where('widget_name', $widgetName)
                    ->exists()) {
                $widgetName = $baseName . ' (' . $counter . ')';
                $counter++;
            }

            // Create the widget connection
                                    // Ensure widget config includes description
                        $widgetConfig = $widgetData['config'];
                        if (!isset($widgetConfig['description']) && isset($widgetData['insights']['description'])) {
                            $widgetConfig['description'] = $widgetData['insights']['description'];
                        }

                        $widgetConnection = FileWidgetConnection::create([
                            'uploaded_file_id' => $file->id,
                            'widget_name' => $widgetName,
                            'widget_type' => $widgetData['type'],
                            'widget_config' => $widgetConfig,
                            'is_displayed' => true,
                            'display_order' => FileWidgetConnection::where('uploaded_file_id', $file->id)->max('display_order') + 1,
                            'ai_insights' => $widgetData['insights'] ?? null,
                        ]);

            // The widget is automatically connected to the user through the file relationship
            // FileWidgetConnection -> UploadedFile -> User (through user_id)

                        Log::info('Widget created successfully', [
                'widget_id' => $widgetConnection->id,
                'widget_name' => $widgetName,
                'widget_type' => $widgetConnection->widget_type
            ]);

            return response()->json([
                'success' => true,
                'widget_name' => $widgetName,
                'widget_id' => $widgetConnection->id,
                'message' => 'Widget created successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Error creating AI widget: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create widget: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function createManualWidget(Request $request)
    {
        Log::info('Manual Widget creation request received', $request->all());

        $request->validate([
            'file_id' => 'required|exists:uploaded_files,id',
            'widget_name' => 'required|string|max:255',
            'widget_type' => 'required|string|in:kpi,bar_chart,pie_chart,table',
            'function' => 'required|string',
            'column' => 'required_if:widget_type,kpi|string',
            'x_axis' => 'required_if:widget_type,bar_chart|string',
            'y_axis' => 'required_if:widget_type,bar_chart|string',
            'category_column' => 'required_if:widget_type,pie_chart|string',
            'value_column' => 'required_if:widget_type,pie_chart|string',
        ]);

        // Verify the file belongs to the authenticated user
        $file = UploadedFile::where('id', $request->file_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        Log::info('File found for manual widget creation', ['file_id' => $file->id, 'filename' => $file->original_filename]);

        try {
            // Generate unique widget name if it already exists
            $widgetName = $request->widget_name;
            $counter = 1;

            while (FileWidgetConnection::where('uploaded_file_id', $file->id)
                    ->where('widget_name', $widgetName)
                    ->exists()) {
                $widgetName = $request->widget_name . ' (' . $counter . ')';
                $counter++;
            }

            // Create widget configuration based on type
            $widgetConfig = $this->createWidgetConfig($request, $file);

            // Create the widget connection
            $widgetConnection = FileWidgetConnection::create([
                'uploaded_file_id' => $file->id,
                'widget_name' => $widgetName,
                'widget_type' => $request->widget_type,
                'widget_config' => $widgetConfig,
                'is_displayed' => true,
                'display_order' => FileWidgetConnection::where('uploaded_file_id', $file->id)->max('display_order') + 1,
                'ai_insights' => null,
            ]);

            Log::info('Manual widget created successfully', [
                'widget_id' => $widgetConnection->id,
                'widget_name' => $widgetName,
                'widget_type' => $widgetConnection->widget_type
            ]);

            return response()->json([
                'success' => true,
                'widget_name' => $widgetName,
                'widget_id' => $widgetConnection->id,
                'message' => 'Widget created successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Error creating manual widget: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create widget: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getWidgetSuggestions(Request $request, $fileId)
    {
        $file = UploadedFile::where('id', $fileId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($file->status !== 'completed') {
            return response()->json(['error' => 'File is not processed yet'], 400);
        }

        try {
            $aiService = new \App\Services\AIService();
            $suggestions = $aiService->generateWidgetSuggestions($file);

            return response()->json([
                'success' => true,
                'suggestions' => $suggestions
            ]);

        } catch (\Exception $e) {
            Log::error('Error generating widget suggestions: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate suggestions: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getWidgetFunctionOptions(Request $request, $fileId)
    {
        $file = UploadedFile::where('id', $fileId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($file->status !== 'completed') {
            return response()->json(['error' => 'File is not processed yet'], 400);
        }

        $widgetType = $request->query('widget_type', 'kpi');

        try {
            $aiService = new \App\Services\AIService();
            $options = $aiService->generateWidgetFunctionOptions($file, $widgetType);

            return response()->json([
                'success' => true,
                'options' => $options
            ]);

        } catch (\Exception $e) {
            Log::error('Error generating widget function options: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate function options: ' . $e->getMessage()
            ], 500);
        }
    }

    private function createWidgetConfig(Request $request, UploadedFile $file)
    {
        $config = [
            'description' => '',
            'source_columns' => [],
            'calculation_method' => '',
            'last_ai_analysis' => now()->toISOString()
        ];

        switch ($request->widget_type) {
            case 'kpi':
                $config['description'] = "Shows the {$request->function} of {$request->column}";
                $config['source_columns'] = [$request->column];
                $config['calculation_method'] = ucfirst($request->function) . ' of all values';
                $config['function'] = $request->function;
                break;

            case 'bar_chart':
                $config['description'] = "Shows {$request->y_axis} by {$request->x_axis}";
                $config['source_columns'] = [$request->x_axis, $request->y_axis];
                $config['calculation_method'] = "Group by {$request->x_axis} and sum {$request->y_axis}";
                $config['function'] = $request->function;
                $config['ai_chart_config'] = [
                    'title' => $request->widget_name,
                    'x_axis' => $request->x_axis,
                    'y_axis' => $request->y_axis,
                    'description' => "Shows {$request->y_axis} by {$request->x_axis}",
                    'chart_data' => []
                ];
                break;

            case 'pie_chart':
                $config['description'] = "Shows distribution of {$request->value_column} by {$request->category_column}";
                $config['source_columns'] = [$request->category_column, $request->value_column];
                $config['calculation_method'] = 'Distribution analysis';
                $config['function'] = $request->function;
                $config['ai_chart_config'] = [
                    'title' => $request->widget_name,
                    'category_column' => $request->category_column,
                    'value_column' => $request->value_column,
                    'description' => "Shows distribution of {$request->value_column} by {$request->category_column}",
                    'chart_data' => []
                ];
                break;

            case 'table':
                $config['description'] = "Shows data table";
                $config['source_columns'] = $file->processed_data['headers'] ?? [];
                $config['calculation_method'] = 'Display all data';
                $config['function'] = $request->function;
                $config['headers'] = $file->processed_data['headers'] ?? [];
                $config['data'] = array_slice($file->processed_data['data'] ?? [], 0, 10);
                $config['maxRows'] = 10;
                break;
        }

        return $config;
    }

    public function removeWidget(Request $request, $widgetId)
    {
        try {
            // Find the widget and verify it belongs to the authenticated user
            $widget = FileWidgetConnection::where('id', $widgetId)
                ->whereHas('uploadedFile', function($query) {
                    $query->where('user_id', Auth::id());
                })
                ->firstOrFail();

            Log::info('Removing widget', [
                'widget_id' => $widget->id,
                'widget_name' => $widget->widget_name,
                'file_id' => $widget->uploaded_file_id
            ]);

            // Delete the widget
            $widget->delete();

            return response()->json([
                'success' => true,
                'message' => 'Widget removed successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Error removing widget: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to remove widget: ' . $e->getMessage(),
            ], 500);
        }
    }
}
