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
    ArrowRight,
    BrainCircuit,
    Database as DatabaseIcon,
    Sparkles
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '@/Layouts/DashboardLayout';

interface FileWidgetConnection {
    id: number;
    uploaded_file_id: number;
    widget_name: string;
    widget_type: string;
    widget_config?: any;
    is_displayed: boolean;
    display_order: number;
    ai_insights?: any;
    uploaded_file?: any;
    created_at: string;
    updated_at: string;
}

interface DashboardProps {
    stats: {
        totalSales: number;
        activeRecruiters: number;
        targetAchievement: number;
        avgCommission: number;
        ai_insights?: any;
    };
    connectedFile?: string;
    chartData?: {
        barChart: Array<{ name: string; value: number }>;
        pieChart: Array<{ name: string; value: number }>;
    };
    chartTitles?: {
        barChart?: string;
        pieChart?: string;
    };
    chartDescriptions?: {
        barChart?: string;
        pieChart?: string;
    };
    tableData?: Array<any>;
    availableColumns?: string[];
    dataType?: 'ai' | 'raw';
    displayedWidgets?: FileWidgetConnection[];
    onboardingData?: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function Dashboard({
    stats,
    connectedFile,
    chartData,
    chartTitles,
    chartDescriptions,
    tableData,
    availableColumns,
    dataType = 'raw',
    displayedWidgets = [],
    onboardingData
}: DashboardProps) {
    const [showDataNotification, setShowDataNotification] = React.useState(false);
    const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({});
    const [showAllFilters, setShowAllFilters] = React.useState(false);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [currentDataType, setCurrentDataType] = React.useState<'ai' | 'raw'>(dataType);
    const [toastMessage, setToastMessage] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

    React.useEffect(() => {
        if (connectedFile) {
            // Only show data notification if we haven't shown it before
            const hasShownData = sessionStorage.getItem('data_notification_shown');
            if (!hasShownData) {
                setShowDataNotification(true);
                setTimeout(() => setShowDataNotification(false), 5000);
                sessionStorage.setItem('data_notification_shown', 'true');
            }
        }
    }, [connectedFile]);

        // Show AI insights notification only when first loading AI data
    React.useEffect(() => {
        if (stats.ai_insights && currentDataType === 'ai' && !showDataNotification) {
            // Only show if we haven't already shown a notification
            const hasShownAI = sessionStorage.getItem('ai_insights_shown');
            if (!hasShownAI) {
                setToastMessage({
                    type: 'success',
                                            message: 'AI-enhanced widgets and charts are now active! Switch between AI Analysis and Raw Data using the toggle above.'
                });
                setTimeout(() => setToastMessage(null), 5000);
                sessionStorage.setItem('ai_insights_shown', 'true');
            }
        }
    }, [stats.ai_insights, currentDataType, showDataNotification]);

            const handleUpdateWidgets = async (dataType: 'ai' | 'raw') => {
        // Don't update if already on the selected data type
        if (currentDataType === dataType) {
            return;
        }

        setIsUpdating(true);

        try {
            // Get the active file ID from the current connected file
            if (!connectedFile) {
                setToastMessage({ type: 'error', message: 'No connected file found' });
                return;
            }

            const endpoint = dataType === 'ai'
                ? `/ai/analyze-file/current`
                : `/dashboard/update-raw-data/current`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                setCurrentDataType(dataType);
                setToastMessage({
                    type: 'success',
                    message: `Switched to ${dataType === 'ai' ? 'AI analysis' : 'raw data'}!`
                });

                // Clear session storage to allow fresh notifications after switch
                sessionStorage.removeItem('ai_insights_shown');
                sessionStorage.removeItem('data_notification_shown');

                // Refresh the page to show updated data
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setToastMessage({ type: 'error', message: data.message || 'Failed to update dashboard' });
            }
        } catch (error) {
            setToastMessage({ type: 'error', message: 'Network error occurred' });
        } finally {
            setIsUpdating(false);
        }
    };

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

    // Apply filters to table data
    const getFilteredTableData = () => {
        if (!tableData || Object.keys(activeFilters).length === 0) {
            return tableData;
        }

        return tableData.filter(row => {
            return Object.entries(activeFilters).every(([column, filterValue]) => {
                const rowValue = row[column];
                return rowValue === filterValue;
            });
        });
    };

    // Apply filters to chart data
    const getFilteredChartData = () => {
        if (!chartData || Object.keys(activeFilters).length === 0) {
            return chartData;
        }

        const filteredTableData = getFilteredTableData();
        if (!filteredTableData || filteredTableData.length === 0) {
            return chartData;
        }

        // Recalculate chart data based on filtered table data
        const newChartData = { ...chartData };

        // Recalculate bar chart data
        if (chartData.barChart && chartData.barChart.length > 0) {
            // This is a simplified recalculation - in a real app, you'd want more sophisticated logic
            const barChartColumn = chartTitles?.barChart?.toLowerCase().includes('team') ? 'team_home' : 'home_goal';
            const barChartData = filteredTableData.reduce((acc, row) => {
                const key = row[barChartColumn] || 'Unknown';
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {});

            newChartData.barChart = Object.entries(barChartData).map(([name, value]) => ({
                name,
                value: value as number
            }));
        }

        // Recalculate pie chart data
        if (chartData.pieChart && chartData.pieChart.length > 0) {
            const pieChartColumn = chartTitles?.pieChart?.toLowerCase().includes('team') ? 'team_home' : 'home_goal';
            const pieChartData = filteredTableData.reduce((acc, row) => {
                const key = row[pieChartColumn] || 'Unknown';
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {});

            newChartData.pieChart = Object.entries(pieChartData).map(([name, value]) => ({
                name,
                value: value as number
            }));
        }

        return newChartData;
    };

    // Apply filters to stats
    const getFilteredStats = () => {
        if (!stats || Object.keys(activeFilters).length === 0) {
            return stats;
        }

        const filteredTableData = getFilteredTableData();
        if (!filteredTableData || filteredTableData.length === 0) {
            return stats;
        }

        // Recalculate stats based on filtered data
        const newStats = { ...stats };

        // Recalculate total sales (assuming it's based on some numeric column)
        if (filteredTableData.length > 0) {
            const numericColumns = ['home_goal', 'away_goal', 'played'];
            const totalSales = numericColumns.reduce((sum, col) => {
                return sum + filteredTableData.reduce((colSum, row) => {
                    const value = parseFloat(row[col]) || 0;
                    return colSum + value;
                }, 0);
            }, 0);

            newStats.totalSales = Math.round(totalSales);
            newStats.activeRecruiters = filteredTableData.length;
            newStats.targetAchievement = Math.round((totalSales / 1000) * 100); // Simplified calculation
            newStats.avgCommission = totalSales > 0 ? Math.round(totalSales / filteredTableData.length) : 0;
        }

        return newStats;
    };

    const visibleColumns = availableColumns && availableColumns.length > 3 && !showAllFilters
        ? availableColumns.slice(0, 3)
        : availableColumns;

    const getWidgetIcon = (widgetType: string) => {
        switch (widgetType) {
            case 'kpi':
                return DollarSign;
            case 'bar_chart':
                return BarChart3;
            case 'pie_chart':
                return PieChartIcon;
            case 'table':
                return TableIcon;
            default:
                return Activity;
        }
    };

    const getWidgetValue = (widget: FileWidgetConnection) => {
        const aiInsights = widget.ai_insights;
        if (!aiInsights) return '0';

        const value = aiInsights.value || 0;

        // Format based on widget name
        if (widget.widget_name.toLowerCase().includes('total') || widget.widget_name.toLowerCase().includes('sales')) {
            return `$${value.toLocaleString()}`;
        } else if (widget.widget_name.toLowerCase().includes('percentage') || widget.widget_name.toLowerCase().includes('achievement')) {
            return `${value}%`;
        } else {
            return value.toString();
        }
    };

    const getWidgetDescription = (widget: FileWidgetConnection) => {
        const aiInsights = widget.ai_insights;
        if (aiInsights?.description) {
            return aiInsights.description;
        }

        // Default descriptions based on widget name
        if (widget.widget_name.toLowerCase().includes('total')) {
            return 'Total value';
        } else if (widget.widget_name.toLowerCase().includes('unique')) {
            return 'Unique count';
        } else if (widget.widget_name.toLowerCase().includes('average')) {
            return 'Average value';
        } else {
            return 'Data metric';
        }
    };

    const getWidgetTrend = (widget: FileWidgetConnection) => {
        const aiInsights = widget.ai_insights;
        return aiInsights?.trend || '+0%';
    };

    // Create KPI cards from displayed widgets
    const kpiCards = displayedWidgets
        .filter(widget => widget.widget_type === 'kpi')
        .map(widget => ({
            title: widget.widget_name,
            value: getWidgetValue(widget),
            icon: getWidgetIcon(widget.widget_type),
            description: getWidgetDescription(widget),
            trend: getWidgetTrend(widget),
            trendUp: true,
            aiSource: widget.ai_insights?.source_column,
            aiMethod: widget.ai_insights?.calculation_method,
        }));

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
                <div className="flex items-center justify-between">
                    <div>
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

                    {/* Data Source Indicator */}
                    {connectedFile && (
                        <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                                {currentDataType === 'ai' ? (
                                    <>
                                        <BrainCircuit className="h-3 w-3 mr-1" />
                                        AI Analysis
                                    </>
                                ) : (
                                    <>
                                        <DatabaseIcon className="h-3 w-3 mr-1" />
                                        Raw Data
                                    </>
                                )}
                            </Badge>
                        </div>
                    )}
                </div>
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
                            {/* AI Insights */}
                            {(kpi.aiSource || kpi.aiMethod) && (
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                    <div className="flex items-center text-xs text-blue-600">
                                        <Activity className="h-3 w-3 mr-1" />
                                        <span className="font-medium">AI Analysis</span>
                                    </div>
                                    {kpi.aiSource && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Source: {kpi.aiSource}
                                        </p>
                                    )}
                                    {kpi.aiMethod && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Method: {kpi.aiMethod}
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>



            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayedWidgets
                    .filter(widget => widget.widget_type === 'bar_chart' || widget.widget_type === 'pie_chart')
                    .map((widget, index) => (
                        <Card key={widget.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    {currentDataType === 'ai' ? (
                                        <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                                    ) : (
                                        getWidgetIcon(widget.widget_type) === BarChart3 ? (
                                            <BarChart3 className="h-5 w-5 mr-2" />
                                        ) : (
                                            <PieChart className="h-5 w-5 mr-2" />
                                        )
                                    )}
                                    {widget.widget_name}
                                </CardTitle>
                                <CardDescription>
                                    {widget.widget_config?.description ||
                                        (widget.widget_type === 'bar_chart' ? 'Bar chart visualization' : 'Pie chart visualization')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {widget.widget_type === 'bar_chart' && getFilteredChartData() && getFilteredChartData().barChart && getFilteredChartData().barChart.length > 0 ? (
                                    <ChartContainer config={barChartConfig}>
                                        <BarChart data={getFilteredChartData().barChart}>
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
                                ) : widget.widget_type === 'pie_chart' && getFilteredChartData() && getFilteredChartData().pieChart && getFilteredChartData().pieChart.length > 0 ? (
                                    <ChartContainer config={pieChartConfig}>
                                        <RechartsPieChart>
                                            <Pie
                                                data={getFilteredChartData().pieChart}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="hsl(var(--chart-1))"
                                                dataKey="value"
                                            >
                                                {getFilteredChartData().pieChart.map((entry, index) => (
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
                                            {widget.widget_type === 'bar_chart' ? (
                                                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            ) : (
                                                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            )}
                                            <p className="text-gray-500">No chart data available</p>
                                            <p className="text-sm text-gray-400">Upload an Excel file to see charts</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
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
                                        {getFilteredTableData() && getFilteredTableData().length > 0 && (
                                            <>
                                                {Array.from(new Set(getFilteredTableData().map(row => row[column]))).slice(0, 10).map((value, valueIndex) => (
                                                    <option key={valueIndex} value={value}>{value}</option>
                                                ))}
                                                {Array.from(new Set(getFilteredTableData().map(row => row[column]))).length > 10 && (
                                                    <option disabled>... and {Array.from(new Set(getFilteredTableData().map(row => row[column]))).length - 10} more</option>
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
                    {getFilteredTableData() && getFilteredTableData().length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {Object.keys(getFilteredTableData()[0]).map((header) => (
                                        <TableHead key={header}>{header}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {getFilteredTableData().map((row, index) => (
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
                description="View your Excel data insights and analytics"
                showUpdateButton={!!connectedFile}
                onUpdateWidgets={handleUpdateWidgets}
                isUpdating={isUpdating}
                currentDataType={currentDataType}
                showEditButton={!!connectedFile}
                onboardingData={onboardingData}
            >
                {(showDataNotification || toastMessage) && (
                    <div className="fixed bottom-4 right-4 z-50 p-4 border rounded-lg shadow-lg max-w-sm">
                        {showDataNotification && (
                            <div className="bg-green-50 border-green-200">
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

                        {toastMessage && (
                            <div className={`${toastMessage.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {toastMessage.type === 'success' ? (
                                                <CheckCircle className="h-5 w-5 text-green-400" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5 text-red-400" />
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <p className={`text-sm font-medium ${toastMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                                {toastMessage.message}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setToastMessage(null)}
                                        className={`ml-3 ${toastMessage.type === 'success' ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600'}`}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!connectedFile ? renderWelcomeState() : renderOverview()}
            </DashboardLayout>
        </>
    );
}
