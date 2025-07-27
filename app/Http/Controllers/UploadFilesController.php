<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UploadFilesController extends Controller
{
    public function index()
    {
        return Inertia::render('UploadFiles');
    }
}
