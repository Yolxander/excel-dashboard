<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Mock data for demonstration
        $stats = [
            'totalSales' => 456789,
            'activeRecruiters' => 24,
            'targetAchievement' => 87,
            'avgCommission' => 1250,
        ];

        $recentOrders = [
            [
                'id' => 1,
                'customer' => 'John Doe',
                'amount' => 299.99,
                'status' => 'Completed',
                'date' => '2024-01-15',
            ],
            [
                'id' => 2,
                'customer' => 'Jane Smith',
                'amount' => 149.50,
                'status' => 'Pending',
                'date' => '2024-01-14',
            ],
            [
                'id' => 3,
                'customer' => 'Mike Johnson',
                'amount' => 599.99,
                'status' => 'Completed',
                'date' => '2024-01-13',
            ],
            [
                'id' => 4,
                'customer' => 'Sarah Wilson',
                'amount' => 89.99,
                'status' => 'Cancelled',
                'date' => '2024-01-12',
            ],
            [
                'id' => 5,
                'customer' => 'David Brown',
                'amount' => 199.99,
                'status' => 'Completed',
                'date' => '2024-01-11',
            ],
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
        ]);
    }
}
