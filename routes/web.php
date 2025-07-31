<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UploadFilesController;
use App\Http\Controllers\ConnectedFilesController;
use App\Http\Controllers\CombineFilesController;
use App\Http\Controllers\DataSourcesController;
use App\Http\Controllers\SyncScheduleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OnboardingController;

// Protected Routes (require authentication)
Route::middleware(['auth'])->group(function () {
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
});

// Authentication Routes (guest only)
Route::middleware(['guest'])->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// AI Analysis Routes (protected)
Route::middleware(['auth'])->group(function () {
    Route::post('/ai/analyze-file/{fileId}', [ConnectedFilesController::class, 'analyzeFileWithAI']);
    Route::post('/ai/analyze-file/current', [DashboardController::class, 'analyzeCurrentFileWithAI']);
    Route::get('/ai/widget-insights/{widgetId}', [ConnectedFilesController::class, 'getWidgetInsights']);

    // Dashboard Update Routes
    Route::post('/dashboard/update-raw-data/current', [DashboardController::class, 'updateWithRawData']);

    // Onboarding Routes
    Route::get('/onboarding/data', [OnboardingController::class, 'getOnboardingData']);
    Route::post('/onboarding/mark-step', [OnboardingController::class, 'markStepCompleted']);
    Route::post('/onboarding/check-progress', [OnboardingController::class, 'checkProgress']);
    Route::post('/onboarding/mark-congratulations-shown', [OnboardingController::class, 'markCongratulationsShown']);
    Route::post('/onboarding/reset-congratulations', [OnboardingController::class, 'resetCongratulationsStatus']);
});

Route::get('/widget-selection', [App\Http\Controllers\WidgetSelectionController::class, 'index'])->name('widget-selection');
Route::get('/widget-selection/widgets/{fileId}', [App\Http\Controllers\WidgetSelectionController::class, 'getWidgetsForFile'])->name('widget-selection.widgets');
Route::post('/widget-selection/update', [App\Http\Controllers\WidgetSelectionController::class, 'updateWidgetSelection'])->name('widget-selection.update');
Route::post('/widget-selection/connect/{fileId}', [App\Http\Controllers\WidgetSelectionController::class, 'connectFile'])->name('widget-selection.connect');
Route::delete('/widget-selection/remove-widget/{widgetId}', [App\Http\Controllers\WidgetSelectionController::class, 'removeWidget'])->name('widget-selection.remove-widget');
Route::post('/ai/create-widget', [App\Http\Controllers\WidgetSelectionController::class, 'createAIWidget'])->name('ai.create-widget');
Route::post('/widget-selection/create-manual-widget', [App\Http\Controllers\WidgetSelectionController::class, 'createManualWidget'])->name('widget-selection.create-manual-widget');
Route::get('/widget-selection/suggestions/{fileId}', [App\Http\Controllers\WidgetSelectionController::class, 'getWidgetSuggestions'])->name('widget-selection.suggestions');
Route::get('/widget-selection/function-options/{fileId}', [App\Http\Controllers\WidgetSelectionController::class, 'getWidgetFunctionOptions'])->name('widget-selection.function-options');
