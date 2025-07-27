<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UploadFilesController;
use App\Http\Controllers\ConnectedFilesController;
use App\Http\Controllers\DataSourcesController;
use App\Http\Controllers\SyncScheduleController;

Route::get('/', [DashboardController::class, 'index']);
Route::get('/upload-files', [UploadFilesController::class, 'index']);
Route::get('/connected-files', [ConnectedFilesController::class, 'index']);
Route::get('/data-sources', [DataSourcesController::class, 'index']);
Route::get('/sync-schedule', [SyncScheduleController::class, 'index']);
