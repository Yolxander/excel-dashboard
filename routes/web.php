<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UploadFilesController;
use App\Http\Controllers\ConnectedFilesController;
use App\Http\Controllers\CombineFilesController;
use App\Http\Controllers\DataSourcesController;
use App\Http\Controllers\SyncScheduleController;

Route::get('/', [DashboardController::class, 'index']);
Route::get('/upload-files', [UploadFilesController::class, 'index']);
Route::post('/upload-files', [UploadFilesController::class, 'store']);
Route::delete('/upload-files/{id}', [UploadFilesController::class, 'destroy']);
Route::get('/test-upload', function() {
    $files = \App\Models\UploadedFile::all();
    return response()->json($files);
});
Route::get('/connected-files', [ConnectedFilesController::class, 'index']);
Route::post('/connected-files/{fileId}/connect', [ConnectedFilesController::class, 'connectFile']);
Route::post('/connected-files/{fileId}/disconnect', [ConnectedFilesController::class, 'disconnectFile']);
Route::get('/combine-files', [CombineFilesController::class, 'index']);
Route::post('/combine-files', [CombineFilesController::class, 'combineFiles']);
Route::post('/combine-files/preview', [CombineFilesController::class, 'generateAIPreview']);
Route::post('/combine-files/{fileId}/regenerate-insights', [CombineFilesController::class, 'regenerateAIInsights']);
Route::get('/data-sources', [DataSourcesController::class, 'index']);
Route::get('/sync-schedule', [SyncScheduleController::class, 'index']);

// AI Analysis Routes
Route::post('/ai/analyze-file/{fileId}', [ConnectedFilesController::class, 'analyzeFileWithAI']);
Route::post('/ai/analyze-file/current', [DashboardController::class, 'analyzeCurrentFileWithAI']);
Route::get('/ai/widget-insights/{widgetId}', [ConnectedFilesController::class, 'getWidgetInsights']);

// Dashboard Update Routes
Route::post('/dashboard/update-raw-data/current', [DashboardController::class, 'updateWithRawData']);
