import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    BarChart3,
    Users,
    DollarSign,
    TrendingUp,
    Activity,
    Calendar,
    FileText,
    Settings,
    Upload,
    Database,
    Clock,
    PieChart,
    Filter,
    ChevronDown,
    MoreHorizontal,
    Plus,
    Play,
    Pause,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    XCircle
} from 'lucide-react';

interface DashboardProps {
    stats: {
        totalSales: number;
        activeRecruiters: number;
        targetAchievement: number;
        avgCommission: number;
    };
    recentOrders: Array<{
        id: number;
        customer: string;
        amount: number;
        status: string;
        date: string;
    }>;
}

type PageType = 'overview' | 'upload' | 'connected' | 'sources' | 'schedule';

export default function Dashboard({ stats, recentOrders }: DashboardProps) {
    const [currentPage, setCurrentPage] = useState<PageType>('overview');

    const kpiCards = [
        {
            title: 'Total Sales',
            value: `$${stats.totalSales.toLocaleString()}`,
            icon: DollarSign,
            description: 'This month',
            trend: '+12%',
            trendUp: true,
        },
        {
            title: 'Active Recruiters',
            value: stats.activeRecruiters.toString(),
            icon: Users,
            description: 'Currently active',
            trend: '+5%',
            trendUp: true,
        },
        {
            title: 'Target Achievement',
            value: `${stats.targetAchievement}%`,
            icon: TrendingUp,
            description: 'Monthly goal',
            trend: '+8%',
            trendUp: true,
        },
        {
            title: 'Avg Commission',
            value: `$${stats.avgCommission}`,
            icon: Activity,
            description: 'Per recruiter',
            trend: '+3%',
            trendUp: true,
        },
    ];

    const sidebarItems = [
        {
            section: 'Dashboards',
            items: [
                { id: 'overview', label: 'Data Overview', icon: BarChart3 }
            ]
        },
        {
            section: 'Data Management',
            items: [
                { id: 'upload', label: 'Upload Excel Files', icon: Upload },
                { id: 'connected', label: 'Connected Files', icon: FileText },
                { id: 'sources', label: 'Data Sources', icon: Database },
                { id: 'schedule', label: 'Sync Schedule', icon: Clock }
            ]
        }
    ];

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
                <p className="text-blue-100">Your dashboard is connected to Sales_Data_Sample.xlsx with 3 charts and 2 tables</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((kpi, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {kpi.title}
                            </CardTitle>
                            <kpi.icon className="h-4 w-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                            <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
                            <div className="flex items-center mt-2">
                                <Badge variant={kpi.trendUp ? "default" : "secondary"} className="text-xs">
                                    {kpi.trend}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Performance</CardTitle>
                        <CardDescription>Monthly sales by region</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Sales Performance Chart</p>
                                <p className="text-sm text-gray-400">Bar chart showing regional sales data</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Regional Distribution</CardTitle>
                        <CardDescription>Sales by region percentage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Regional Distribution Chart</p>
                                <p className="text-sm text-gray-400">Pie chart showing regional breakdown</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Data Filters</CardTitle>
                    <CardDescription>Filter your dashboard data</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <select className="border rounded-md px-3 py-1 text-sm">
                                <option>All Regions</option>
                                <option>North</option>
                                <option>South</option>
                                <option>East</option>
                                <option>West</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <select className="border rounded-md px-3 py-1 text-sm">
                                <option>All Departments</option>
                                <option>Sales</option>
                                <option>Marketing</option>
                                <option>HR</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <select className="border rounded-md px-3 py-1 text-sm">
                                <option>Last 30 Days</option>
                                <option>Last 7 Days</option>
                                <option>Last 90 Days</option>
                                <option>This Year</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest orders from your customers</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback>
                                                    {order.customer.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {order.customer}
                                        </div>
                                    </TableCell>
                                    <TableCell>${order.amount}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                order.status === 'Completed' ? 'default' :
                                                order.status === 'Pending' ? 'secondary' : 'destructive'
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{order.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );

    const renderUpload = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Upload Excel Files</h2>
                    <p className="text-gray-600">Upload and process your Excel files to generate dashboards</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Files
                </Button>
            </div>

            {/* Upload Area */}
            <Card>
                <CardHeader>
                    <CardTitle>Upload Files</CardTitle>
                    <CardDescription>Drag and drop Excel files here or click to browse</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">Drop files here</p>
                        <p className="text-gray-500 mb-4">Supports .xlsx, .xls, .csv files up to 10MB</p>
                        <Button variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Files
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* File List */}
            <Card>
                <CardHeader>
                    <CardTitle>Uploaded Files</CardTitle>
                    <CardDescription>Files that have been processed</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                                <FileText className="h-8 w-8 text-blue-500" />
                                <div>
                                    <p className="font-medium">Sales_Data_Sample.xlsx</p>
                                    <p className="text-sm text-gray-500">6.3 KB • Uploaded 2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge variant="default">Processed</Badge>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                                <FileText className="h-8 w-8 text-green-500" />
                                <div>
                                    <p className="font-medium">Recruiter_Performance.csv</p>
                                    <p className="text-sm text-gray-500">245 B • Uploaded 1 day ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge variant="default">Processed</Badge>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderConnected = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Connected Files</h2>
                    <p className="text-gray-600">Manage your connected data sources and files</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect File
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Sales_Data_Sample.xlsx</CardTitle>
                                <CardDescription>6.3 KB • 3 charts • 2 tables</CardDescription>
                            </div>
                            <Badge variant="default">Connected</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Auto-sync</span>
                                <Button variant="outline" size="sm">
                                    <Play className="h-4 w-4 mr-2" />
                                    Enabled
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Sync frequency</span>
                                <select className="border rounded px-2 py-1 text-sm">
                                    <option>Daily</option>
                                    <option>Hourly</option>
                                    <option>Weekly</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Last sync</span>
                                <span className="text-sm">2 hours ago</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recruiter_Performance.csv</CardTitle>
                                <CardDescription>245 B • 2 charts • 1 table</CardDescription>
                            </div>
                            <Badge variant="default">Connected</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Auto-sync</span>
                                <Button variant="outline" size="sm">
                                    <Pause className="h-4 w-4 mr-2" />
                                    Disabled
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Sync frequency</span>
                                <select className="border rounded px-2 py-1 text-sm">
                                    <option>Weekly</option>
                                    <option>Daily</option>
                                    <option>Hourly</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Last sync</span>
                                <span className="text-sm">1 day ago</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderSources = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Data Sources</h2>
                    <p className="text-gray-600">Configure external data connections</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Source
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Database className="h-5 w-5 text-blue-500" />
                                <CardTitle className="text-lg">PostgreSQL Database</CardTitle>
                            </div>
                            <Badge variant="default">Active</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Connected</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Host:</span>
                                <span className="text-sm">localhost:5432</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Database:</span>
                                <span className="text-sm">sales_db</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Test Connection
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Database className="h-5 w-5 text-green-500" />
                                <CardTitle className="text-lg">Sales API</CardTitle>
                            </div>
                            <Badge variant="default">Active</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Connected</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Endpoint:</span>
                                <span className="text-sm">api.sales.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Version:</span>
                                <span className="text-sm">v2.1</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Test Connection
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Database className="h-5 w-5 text-gray-500" />
                                <CardTitle className="text-lg">Google Sheets</CardTitle>
                            </div>
                            <Badge variant="secondary">Inactive</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm">Disconnected</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Sheet ID:</span>
                                <span className="text-sm">1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Last sync:</span>
                                <span className="text-sm">Never</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Connect
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderSchedule = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Sync Schedule</h2>
                    <p className="text-gray-600">Manage automated data synchronization</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Job
                </Button>
            </div>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Sales Data Sync</CardTitle>
                                <CardDescription>Sync sales data from PostgreSQL database</CardDescription>
                            </div>
                            <Badge variant="default">Active</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Frequency</p>
                                <p className="text-sm">Daily</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Next Run</p>
                                <p className="text-sm">Tomorrow 2:00 AM</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Last Run</p>
                                <p className="text-sm">Today 2:00 AM</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                    <Play className="h-4 w-4 mr-2" />
                                    Run Now
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Pause className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>API Data Refresh</CardTitle>
                                <CardDescription>Refresh data from Sales API</CardDescription>
                            </div>
                            <Badge variant="default">Active</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Frequency</p>
                                <p className="text-sm">Hourly</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Next Run</p>
                                <p className="text-sm">In 15 minutes</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Last Run</p>
                                <p className="text-sm">45 minutes ago</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                    <Play className="h-4 w-4 mr-2" />
                                    Run Now
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Pause className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Weekly Report Sync</CardTitle>
                                <CardDescription>Generate weekly performance reports</CardDescription>
                            </div>
                            <Badge variant="secondary">Paused</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Frequency</p>
                                <p className="text-sm">Weekly</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Next Run</p>
                                <p className="text-sm">Paused</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Last Run</p>
                                <p className="text-sm">1 week ago</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                    <Play className="h-4 w-4 mr-2" />
                                    Resume
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Play className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderPage = () => {
        switch (currentPage) {
            case 'overview':
                return renderOverview();
            case 'upload':
                return renderUpload();
            case 'connected':
                return renderConnected();
            case 'sources':
                return renderSources();
            case 'schedule':
                return renderSchedule();
            default:
                return renderOverview();
        }
    };

    return (
        <>
            <Head title="Excel Dashboard" />

            <div className="min-h-screen bg-gray-50 flex">
                {/* Sidebar */}
                <div className="w-64 bg-white shadow-sm border-r">
                    <div className="p-6">
                        <h1 className="text-xl font-bold text-gray-900">Excel Dashboard</h1>
                        <p className="text-sm text-gray-600">Data Analytics Platform</p>
                    </div>

                    <nav className="px-4 pb-4">
                        {sidebarItems.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="mb-6">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    {section.section}
                                </h3>
                                <ul className="space-y-1">
                                    {section.items.map((item) => (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => setCurrentPage(item.id as PageType)}
                                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    currentPage === item.id
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6">
                        {renderPage()}
                    </div>
                </div>
            </div>
        </>
    );
}
