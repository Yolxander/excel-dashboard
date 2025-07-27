<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SyncScheduleController extends Controller
{
    public function index()
    {
        return Inertia::render('SyncSchedule');
    }
}
