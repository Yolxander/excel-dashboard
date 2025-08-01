<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UploadFilesController;
use App\Http\Controllers\ConnectedFilesController;
use App\Http\Controllers\CombineFilesController;
use App\Http\Controllers\DataSourcesController;
use App\Http\Controllers\SyncScheduleController;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\ProfileController;

// Welcome page (public)
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Protected Routes (require authentication)
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
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

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/update-password', [ProfileController::class, 'updatePassword'])->name('profile.update-password');
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
    Route::post('/ai/analyze-file/current', [DashboardController::class, 'regenerateAIInsights']);
    Route::get('/ai/widget-insights/{widgetId}', [ConnectedFilesController::class, 'getWidgetInsights']);

    // Dashboard Update Routes
    Route::post('/dashboard/update-raw-data/current', [DashboardController::class, 'updateWithRawData']);


});

    // Widget Selection Routes (protected)
    Route::get('/widget-selection', [App\Http\Controllers\WidgetSelectionController::class, 'index'])->name('widget-selection');
    Route::get('/widget-selection/widgets/{fileId}', [App\Http\Controllers\WidgetSelectionController::class, 'getWidgetsForFile'])->name('widget-selection.widgets');
    Route::post('/widget-selection/update', [App\Http\Controllers\WidgetSelectionController::class, 'updateWidgetSelection'])->name('widget-selection.update');
    Route::post('/widget-selection/connect/{fileId}', [App\Http\Controllers\WidgetSelectionController::class, 'connectFile'])->name('widget-selection.connect');
    Route::delete('/widget-selection/remove-widget/{widgetId}', [App\Http\Controllers\WidgetSelectionController::class, 'removeWidget'])->name('widget-selection.remove-widget');
    Route::post('/ai/create-widget', [App\Http\Controllers\WidgetSelectionController::class, 'createAIWidget'])->name('ai.create-widget');
    Route::post('/widget-selection/create-manual-widget', [App\Http\Controllers\WidgetSelectionController::class, 'createManualWidget'])->name('widget-selection.create-manual-widget');
    Route::get('/widget-selection/suggestions/{fileId}', [App\Http\Controllers\WidgetSelectionController::class, 'getWidgetSuggestions'])->name('widget-selection.suggestions');
    Route::get('/widget-selection/function-options/{fileId}', [App\Http\Controllers\WidgetSelectionController::class, 'getWidgetFunctionOptions'])->name('widget-selection.function-options');

    // Widget Creation Routes
    Route::get('/create-widget/{fileId}/{widgetType}', [App\Http\Controllers\CreateWidgetController::class, 'index'])->name('create-widget');

// Privacy Policy Route (public)
Route::get('/privacy-policy', function () {
    return Inertia::render('TermsOfService');
})->name('privacy-policy');

// Demo Request Route
Route::post('/demo-request', [App\Http\Controllers\DemoRequestController::class, 'store'])->name('demo-request.store');

// About Route (public)
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

// Contact Route (public)
Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

// Support Route (public)
Route::get('/support', function () {
    return Inertia::render('Support');
})->name('support');

// Documentation Route (public)
Route::get('/documentation', function () {
    return Inertia::render('Documentation');
})->name('documentation');



// Security Route (public)
Route::get('/security', function () {
    return Inertia::render('Security');
})->name('security');

// Security & Privacy Route (protected - keeping for backward compatibility)
Route::middleware(['auth'])->group(function () {
    Route::get('/security-privacy', function () {
        return Inertia::render('SecurityPrivacy');
    })->name('security-privacy');
});

// Error handling route
Route::get('/error/{code}', function ($code) {
    return Inertia::render('Error', [
        'error' => [
            'code' => $code,
            'message' => 'We are currently experiencing some technical issues. It should be fixed soon.',
        ]
    ]);
})->name('error.show');

// Test route to demonstrate error handling (remove in production)
Route::get('/test-error', function () {
    throw new Exception('This is a test error to demonstrate the custom error handling');
})->name('test-error');
