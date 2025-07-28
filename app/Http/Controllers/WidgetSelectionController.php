<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;
use App\Models\FileWidgetConnection;
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

        // Get the currently connected file
        $connectedFile = FileWidgetConnection::with('uploadedFile')
            ->whereHas('uploadedFile', function($query) {
                $query->where('user_id', Auth::id());
            })
            ->where('is_displayed', true)
            ->orderBy('display_order')
            ->first();

        if ($connectedFile && $connectedFile->uploadedFile) {
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
}
