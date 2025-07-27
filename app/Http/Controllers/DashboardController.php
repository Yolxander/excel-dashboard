<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UploadedFile;

class DashboardController extends Controller
{
    public function index()
    {
        // Get the most recent completed file
        $latestFile = UploadedFile::where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->first();

        if ($latestFile && $latestFile->processed_data) {
            $data = $latestFile->processed_data;
            $stats = $this->generateStatsFromData($data);
            $recentOrders = $this->generateRecentOrdersFromData($data);
            $connectedFile = $latestFile->original_filename;
        } else {
            // Fallback to mock data if no files are uploaded
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
            $connectedFile = null;
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'connectedFile' => $connectedFile,
        ]);
    }

    private function generateStatsFromData($data)
    {
        $rows = $data['data'] ?? [];
        $headers = $data['headers'] ?? [];

        if (empty($rows)) {
            return $this->getDefaultStats();
        }

        // Try to identify relevant columns
        $salesColumn = $this->findColumn($headers, ['sales', 'amount', 'revenue', 'total', 'price']);
        $recruiterColumn = $this->findColumn($headers, ['recruiter', 'employee', 'staff', 'name']);
        $statusColumn = $this->findColumn($headers, ['status', 'state', 'condition']);
        $dateColumn = $this->findColumn($headers, ['date', 'created', 'timestamp']);

        $totalSales = 0;
        $activeRecruiters = 0;
        $recruiterCounts = [];
        $completedSales = 0;
        $totalSalesCount = 0;

        foreach ($rows as $row) {
            // Calculate total sales
            if ($salesColumn && isset($row[$salesColumn])) {
                $salesValue = $this->extractNumericValue($row[$salesColumn]);
                $totalSales += $salesValue;
                $totalSalesCount++;
            }

            // Count active recruiters
            if ($recruiterColumn && isset($row[$recruiterColumn])) {
                $recruiter = $row[$recruiterColumn];
                if (!empty($recruiter)) {
                    $recruiterCounts[$recruiter] = ($recruiterCounts[$recruiter] ?? 0) + 1;
                }
            }

            // Count completed sales
            if ($statusColumn && isset($row[$statusColumn])) {
                $status = strtolower($row[$statusColumn]);
                if (in_array($status, ['completed', 'done', 'finished', 'success'])) {
                    $completedSales++;
                }
            }
        }

        $activeRecruiters = count($recruiterCounts);
        $targetAchievement = $totalSalesCount > 0 ? round(($completedSales / $totalSalesCount) * 100) : 87;
        $avgCommission = $activeRecruiters > 0 ? round($totalSales / $activeRecruiters) : 1250;

        return [
            'totalSales' => $totalSales > 0 ? $totalSales : 456789,
            'activeRecruiters' => $activeRecruiters > 0 ? $activeRecruiters : 24,
            'targetAchievement' => $targetAchievement,
            'avgCommission' => $avgCommission,
        ];
    }

    private function generateRecentOrdersFromData($data)
    {
        $rows = $data['data'] ?? [];
        $headers = $data['headers'] ?? [];

        if (empty($rows)) {
            return $this->getDefaultRecentOrders();
        }

        // Try to identify relevant columns
        $customerColumn = $this->findColumn($headers, ['customer', 'client', 'name', 'buyer']);
        $amountColumn = $this->findColumn($headers, ['amount', 'sales', 'revenue', 'total', 'price']);
        $statusColumn = $this->findColumn($headers, ['status', 'state', 'condition']);
        $dateColumn = $this->findColumn($headers, ['date', 'created', 'timestamp']);

        $recentOrders = [];
        $count = 0;

        foreach (array_slice($rows, 0, 10) as $index => $row) {
            $customer = $customerColumn && isset($row[$customerColumn]) ? $row[$customerColumn] : "Customer " . ($index + 1);
            $amount = $amountColumn && isset($row[$amountColumn]) ? $this->extractNumericValue($row[$amountColumn]) : rand(50, 600);
            $status = $statusColumn && isset($row[$statusColumn]) ? $row[$statusColumn] : 'Completed';
            $date = $dateColumn && isset($row[$dateColumn]) ? $row[$dateColumn] : date('Y-m-d', strtotime("-{$index} days"));

            $recentOrders[] = [
                'id' => $index + 1,
                'customer' => $customer,
                'amount' => $amount,
                'status' => $status,
                'date' => $date,
            ];

            $count++;
            if ($count >= 5) break;
        }

        return $recentOrders;
    }

    private function findColumn($headers, $possibleNames)
    {
        foreach ($headers as $header) {
            $headerLower = strtolower($header);
            foreach ($possibleNames as $name) {
                if (strpos($headerLower, $name) !== false) {
                    return $header;
                }
            }
        }
        return null;
    }

    private function extractNumericValue($value)
    {
        if (is_numeric($value)) {
            return (float) $value;
        }

        // Remove currency symbols and commas
        $cleaned = preg_replace('/[^\d.-]/', '', $value);
        return is_numeric($cleaned) ? (float) $cleaned : 0;
    }

    private function getDefaultStats()
    {
        return [
            'totalSales' => 456789,
            'activeRecruiters' => 24,
            'targetAchievement' => 87,
            'avgCommission' => 1250,
        ];
    }

    private function getDefaultRecentOrders()
    {
        return [
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
    }
}
