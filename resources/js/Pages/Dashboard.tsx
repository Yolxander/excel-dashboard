import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    ChevronUp,
    MoreHorizontal,
    Plus,
    Play,
    Pause,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    XCircle,
    FileSpreadsheet,
    BarChart,
    PieChart as PieChartIcon,
    Table as TableIcon,
    ArrowRight
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '@/Layouts/DashboardLayout';

interface DashboardProps {
    stats: {
        totalSales: number;
        activeRecruiters: number;
        targetAchievement: number;
        avgCommission: number;
    };
    connectedFile?: string;
    chartData?: {
        barChart: Array<{ name: string; value: number }>;
        pieChart: Array<{ name: string; value: number }>;
    };
    tableData?: Array<any>;
    availableColumns?: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function Dashboard({ stats, connectedFile, chartData, tableData, availableColumns }: DashboardProps) {
    const [showDataNotification, setShowDataNotification] = React.useState(false);
    const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({});
    const [showAllFilters, setShowAllFilters] = React.useState(false);

    React.useEffect(() => {
        if (connectedFile) {
            setShowDataNotification(true);
            setTimeout(() => setShowDataNotification(false), 5000);
        }
    }, [connectedFile]);

    const handleFilterChange = (column: string, value: string) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };

            if (value === `All ${column}`) {
                // Remove the filter if it's set to "All"
                delete newFilters[column];
            } else {
                // Set the filter value
                newFilters[column] = value;
            }

            return newFilters;
        });
    };

    const visibleColumns = availableColumns && availableColumns.length > 3 && !showAllFilters
        ? availableColumns.slice(0, 3)
        : availableColumns;

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

    // Chart configurations for shadcn
    const barChartConfig = {
        value: {
            label: "Value",
            color: "hsl(var(--chart-1))",
        },
    };

    const pieChartConfig = {
        value: {
            label: "Value",
            color: "hsl(var(--chart-1))",
        },
    };

    const renderWelcomeState = () => (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Welcome back! 👋</h2>
                    <p className="text-xl text-blue-100 mb-6">
                        Upload an Excel file to see your data visualized in charts and tables
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/upload-files">
                            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg">
                                <Upload className="h-5 w-5 mr-2" />
                                Upload Excel File
                            </Button>
                        </Link>
                        <Link href="/connected-files">
                            <Button variant="outline" className="border-2 border-white text-blue-600 hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold shadow-lg transition-all duration-200">
                                <FileSpreadsheet className="h-5 w-5 mr-2" />
                                Connect File
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* How it works section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <Upload className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">1. Upload Your File</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Upload your Excel (.xlsx, .xls) or CSV file through our secure upload system
                        </p>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <BarChart className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-lg">2. Connect to Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Connect your uploaded file to the dashboard to start visualizing your data
                        </p>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <PieChartIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">3. View Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Explore interactive charts, tables, and key performance indicators
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Features preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart3 className="h-5 w-5 mr-2" />
                            Interactive Charts
                        </CardTitle>
                        <CardDescription>
                            Dynamic bar charts and pie charts that update with your data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Upload a file to see charts</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <TableIcon className="h-5 w-5 mr-2" />
                            Data Tables
                        </CardTitle>
                        <CardDescription>
                            View and filter your raw data in organized tables
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <TableIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Upload a file to see tables</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>


        </div>
    );

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
                <p className="text-blue-100">
                    {connectedFile
                        ? `Your dashboard is connected to ${connectedFile} with dynamic data from your uploaded file`
                        : 'Upload an Excel file to see your data visualized in charts and tables'
                    }
                </p>
                {!connectedFile && (
                    <div className="mt-4">
                        <Link href="/upload-files">
                            <Button className="bg-white text-blue-600 hover:bg-gray-100">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Excel File
                            </Button>
                        </Link>
                    </div>
                )}
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
                        <CardTitle>Performance Overview</CardTitle>
                        <CardDescription>Data from your Excel file</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {chartData && chartData.barChart && chartData.barChart.length > 0 ? (
                            <ChartContainer config={barChartConfig}>
                                <BarChart data={chartData.barChart}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <ChartTooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <ChartTooltipContent
                                                        payload={payload}
                                                        label={payload[0].payload.name}
                                                    />
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                                </BarChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                                <div className="text-center">
                                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No chart data available</p>
                                    <p className="text-sm text-gray-400">Upload an Excel file to see charts</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Distribution</CardTitle>
                        <CardDescription>Data breakdown from your file</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {chartData && chartData.pieChart && chartData.pieChart.length > 0 ? (
                            <ChartContainer config={pieChartConfig}>
                                <RechartsPieChart>
                                    <Pie
                                        data={chartData.pieChart}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="hsl(var(--chart-1))"
                                        dataKey="value"
                                    >
                                        {chartData.pieChart.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <ChartTooltipContent
                                                        payload={payload}
                                                        label={payload[0].payload.name}
                                                    />
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                </RechartsPieChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                                <div className="text-center">
                                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No chart data available</p>
                                    <p className="text-sm text-gray-400">Upload an Excel file to see charts</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Data Filters</CardTitle>
                    <CardDescription>Filter your dashboard data by Excel columns</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        {visibleColumns && visibleColumns.length > 0 ? (
                            visibleColumns.map((column, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Filter className="h-4 w-4 text-gray-500" />
                                    <select
                                        className={`border rounded-md px-3 py-1 text-sm ${activeFilters[column] ? 'border-blue-500 bg-blue-50' : ''}`}
                                        value={activeFilters[column] ? activeFilters[column] : `All ${column}`}
                                        onChange={(e) => handleFilterChange(column, e.target.value)}
                                    >
                                        <option value={`All ${column}`}>All {column}</option>
                                        {tableData && tableData.length > 0 && (
                                            <>
                                                {Array.from(new Set(tableData.map(row => row[column]))).slice(0, 10).map((value, valueIndex) => (
                                                    <option key={valueIndex} value={value}>{value}</option>
                                                ))}
                                                {Array.from(new Set(tableData.map(row => row[column]))).length > 10 && (
                                                    <option disabled>... and {Array.from(new Set(tableData.map(row => row[column]))).length - 10} more</option>
                                                )}
                                            </>
                                        )}
                                    </select>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Filter className="h-4 w-4 text-gray-500" />
                                <select className="border rounded-md px-3 py-1 text-sm" disabled>
                                    <option>No data available</option>
                                </select>
                            </div>
                        )}

                        {/* See More/Less Button */}
                        {availableColumns && availableColumns.length > 3 && (
                            <div className="flex items-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAllFilters(!showAllFilters)}
                                    className="text-xs hover:bg-gray-50 transition-colors"
                                >
                                    {showAllFilters ? (
                                        <>
                                            <ChevronUp className="h-3 w-3 mr-1" />
                                            Show Less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="h-3 w-3 mr-1" />
                                            See More ({availableColumns.length - 3} more)
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Time-based filters */}
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <select className="border rounded-md px-3 py-1 text-sm">
                                <option>All Time</option>
                                <option>Last 30 Days</option>
                                <option>Last 7 Days</option>
                                <option>Last 90 Days</option>
                                <option>This Year</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    {Object.keys(activeFilters).length > 0 ? (
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center space-x-2 mb-2">
                                <Filter className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(activeFilters).map(([column, value]) => (
                                    <Badge key={column} variant="secondary" className="text-xs">
                                        {column}: {value}
                                        <button
                                            onClick={() => handleFilterChange(column, `All ${column}`)}
                                            className="ml-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center space-x-2">
                                <Filter className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-500">No active filters - showing all data</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dynamic Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Excel Data Table</CardTitle>
                    <CardDescription>Raw data from your uploaded file</CardDescription>
                </CardHeader>
                <CardContent>
                    {tableData && tableData.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {Object.keys(tableData[0]).map((header) => (
                                        <TableHead key={header}>{header}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableData.map((row, index) => (
                                    <TableRow key={index}>
                                        {Object.values(row).map((value, cellIndex) => (
                                            <TableCell key={cellIndex}>
                                                {typeof value === 'number' ? value.toLocaleString() : value}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No data available</p>
                            <p className="text-sm text-gray-400">Upload an Excel file to see your data</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );

    return (
        <>
            <Head title="Excel Dashboard" />

            <DashboardLayout
                title="Data Overview"
                description="Welcome to your Excel Dashboard. Here's an overview of your data analytics."
            >
                {showDataNotification && (
                    <div className="fixed top-4 right-4 z-50 p-4 bg-green-50 border border-green-200 rounded-lg shadow-lg max-w-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        Dashboard updated with data from {connectedFile}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDataNotification(false)}
                                className="text-green-400 hover:text-green-600 ml-3"
                            >
                                <XCircle className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {!connectedFile ? renderWelcomeState() : renderOverview()}
            </DashboardLayout>
        </>
    );
}
