<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;
use App\Models\DashboardWidget;
use Illuminate\Support\Facades\Log;

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

        Log::info('File connected to dashboard: ' . $file->original_filename);

        return response()->json([
            'success' => true,
            'message' => $file->original_filename . ' is now connected to the dashboard',
            'file' => $file
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
}
