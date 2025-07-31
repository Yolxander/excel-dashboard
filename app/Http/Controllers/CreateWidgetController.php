<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;
use Illuminate\Support\Facades\Auth;

class CreateWidgetController extends Controller
{
    public function index(Request $request, $fileId, $widgetType)
    {
        $user = Auth::user();
        $file = UploadedFile::where('id', $fileId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $dataType = $user->dashboard_data_type ?? 'raw';

        return Inertia::render('CreateWidget', [
            'file' => $file,
            'widgetType' => $widgetType,
            'dataType' => $dataType,
        ]);
    }
} 