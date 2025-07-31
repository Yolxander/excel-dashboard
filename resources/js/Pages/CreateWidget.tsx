import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { ArrowLeft, Plus, TrendingUp, BarChart3, PieChart, Table, Database, BrainCircuit, FileText, Save, X, CheckCircle, Circle, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/Layouts/DashboardLayout';

interface UploadedFile {
    id: number;
    filename: string;
    original_filename: string;
    file_path: string;
    file_type: string;
    file_size: number;
    status: 'processing' | 'completed' | 'failed';
    processed_data?: any;
    error_message?: string;
    ai_insights?: any;
    created_at: string;
    updated_at: string;
}

interface CreateWidgetProps {
    file: UploadedFile;
    widgetType: 'kpi' | 'chart';
    dataType: 'raw' | 'ai';
}

export default function CreateWidget({ file, widgetType, dataType }: CreateWidgetProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [widgetName, setWidgetName] = useState('');
    const [chartType, setChartType] = useState<'bar_chart' | 'pie_chart' | 'table'>('bar_chart');
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [operation, setOperation] = useState<'sum' | 'average' | 'count' | 'min' | 'max' | 'custom'>('sum');
    const [customFormula, setCustomFormula] = useState('');
    const [aiDescription, setAiDescription] = useState('');

    const getWidgetTypeLabel = () => {
        if (widgetType === 'kpi') return 'KPI Widget';
        if (widgetType === 'chart') return 'Chart Widget';
        return 'Widget';
    };

    const getDataTypeLabel = () => {
        if (dataType === 'raw') return 'Raw Data Mode';
        if (dataType === 'ai') return 'AI Analysis Mode';
        return '';
    };

    const getDataTypeIcon = () => {
        if (dataType === 'raw') return <Database className="h-5 w-5 text-gray-600" />;
        if (dataType === 'ai') return <BrainCircuit className="h-5 w-5 text-blue-600" />;
        return null;
    };

    const getDataTypeBadge = () => {
        if (dataType === 'raw') return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Manual</Badge>;
        if (dataType === 'ai') return <Badge variant="default" className="bg-blue-100 text-blue-800">AI-powered</Badge>;
        return null;
    };

    const getFileIcon = (fileType: string) => {
        switch (fileType.toLowerCase()) {
            case 'xlsx':
            case 'xls':
                return <FileText className="h-4 w-4 text-green-600" />;
            case 'csv':
                return <FileText className="h-4 w-4 text-blue-600" />;
            default:
                return <FileText className="h-4 w-4 text-gray-600" />;
        }
    };

    const formatFileSize = (bytes: number) => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    const handleCreateWidget = async () => {
        if (!widgetName.trim()) {
            toast({
                title: 'Widget name required',
                description: 'Please enter a name for your widget.',
                variant: 'destructive',
            });
            return;
        }

        if (dataType === 'raw' && selectedColumns.length === 0) {
            toast({
                title: 'Columns required',
                description: 'Please select at least one column for your widget.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            if (dataType === 'ai') {
                // Create AI widget
                const response = await fetch('/ai/create-widget', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        file_id: file.id,
                        description: aiDescription || '',
                        widget_type: widgetType === 'kpi' ? 'kpi' : chartType,
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    toast({
                        title: 'AI Widget Created!',
                        description: `Widget "${data.widget_name || widgetName}" has been created successfully.`,
                    });
                    window.history.back();
                } else {
                    throw new Error(data.message || 'Failed to create widget');
                }
            } else {
                // Create manual widget
                const response = await fetch('/widget-selection/create-manual-widget', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        file_id: file.id,
                        widget_name: widgetName,
                        widget_type: widgetType === 'kpi' ? 'kpi' : chartType,
                        columns: selectedColumns,
                        operation: operation,
                        custom_formula: customFormula,
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    toast({
                        title: 'Widget Created!',
                        description: `Widget "${data.widget_name}" has been created successfully.`,
                    });
                    window.history.back();
                } else {
                    throw new Error(data.message || 'Failed to create widget');
                }
            }
        } catch (error) {
            console.error('Error creating widget:', error);
            toast({
                title: 'Error creating widget',
                description: error.message || 'There was an error creating the widget. Please try again.',
                variant: 'destructive',
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DashboardLayout
                title="Create Widget"
                description="Create a new widget for your dashboard"
                showDataTypeIndicator={true}
                dataType={dataType}
            >
                <div className="space-y-6">
                    {/* Back to Widget Selection Button */}
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Widget Selection
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <div className="space-y-6">
                                {/* File Information Header */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {getFileIcon(file.file_type)}
                                                <div>
                                                    <span className="text-lg font-semibold">{file.original_filename}</span>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        {getDataTypeIcon()}
                                                        <span className="text-sm text-gray-600">{getDataTypeLabel()}</span>
                                                        {getDataTypeBadge()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline" className="text-blue-600 border-blue-200">
                                                    {widgetType === 'kpi' ? 'KPI Widget' : 'Chart Widget'}
                                                </Badge>
                                            </div>
                                        </CardTitle>
                                        <CardDescription>
                                            Create a new {widgetType === 'kpi' ? 'KPI' : 'chart'} widget for this file
                                        </CardDescription>
                                    </CardHeader>
                                </Card>

                                {/* Widget Configuration */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Plus className="h-5 w-5 mr-2" />
                                            Widget Configuration
                                        </CardTitle>
                                        <CardDescription>
                                            Configure your {widgetType === 'kpi' ? 'KPI' : 'chart'} widget settings
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Widget Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="widget-name" className="text-sm font-semibold text-gray-700">
                                                Widget Name
                                            </Label>
                                            <Input
                                                id="widget-name"
                                                value={widgetName}
                                                onChange={(e) => setWidgetName(e.target.value)}
                                                placeholder="Enter a descriptive name for your widget"
                                                className="h-12 text-base"
                                            />
                                        </div>

                                        {/* Chart Type Selection (only for chart widgets) */}
                                        {widgetType === 'chart' && (
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-gray-700">
                                                    Chart Type
                                                </Label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {[
                                                        { value: 'bar_chart', label: 'Bar Chart', icon: BarChart3, color: 'text-green-600', description: 'Compare values' },
                                                        { value: 'pie_chart', label: 'Pie Chart', icon: PieChart, color: 'text-purple-600', description: 'Show proportions' },
                                                        { value: 'table', label: 'Table', icon: Table, color: 'text-orange-600', description: 'Display data in rows' }
                                                    ].map((type) => (
                                                        <Button
                                                            key={type.value}
                                                            variant={chartType === type.value ? 'default' : 'outline'}
                                                            onClick={() => setChartType(type.value as any)}
                                                            className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                                                                chartType === type.value
                                                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                                    : 'hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            <type.icon className={`h-6 w-6 ${type.color}`} />
                                                            <span className="font-medium">{type.label}</span>
                                                            <span className="text-xs text-gray-500">{type.description}</span>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* AI Description (only for AI mode) */}
                                        {dataType === 'ai' && (
                                            <div className="space-y-3">
                                                <Label htmlFor="ai-description" className="text-sm font-semibold text-gray-700">
                                                    AI Description (Optional)
                                                </Label>
                                                <Textarea
                                                    id="ai-description"
                                                    value={aiDescription}
                                                    onChange={(e) => setAiDescription(e.target.value)}
                                                    placeholder="Describe what you want this widget to show or analyze. For example: 'Show total sales by month' or 'Display customer satisfaction trends'. Leave empty to let AI generate automatically."
                                                    className="min-h-[100px] text-base resize-none"
                                                />
                                                <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    <BrainCircuit className="h-4 w-4 text-blue-600 mt-0.5" />
                                                    <div className="text-sm text-blue-700">
                                                        <p className="font-medium mb-1">AI Tip:</p>
                                                        <p>Be specific about what data you want to visualize or analyze. Leave empty to let AI generate a completely new widget.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Column Selection (only for raw mode) */}
                                        {dataType === 'raw' && (
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-gray-700">
                                                    Select Columns
                                                </Label>
                                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                                                    {file.processed_data?.headers?.map((header: string) => (
                                                        <Button
                                                            key={header}
                                                            variant={selectedColumns.includes(header) ? 'default' : 'outline'}
                                                            onClick={() => {
                                                                const newColumns = selectedColumns.includes(header)
                                                                    ? selectedColumns.filter(col => col !== header)
                                                                    : [...selectedColumns, header];
                                                                setSelectedColumns(newColumns);
                                                            }}
                                                            className={`h-auto p-3 text-sm transition-all duration-200 ${
                                                                selectedColumns.includes(header)
                                                                    ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                                                                    : 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 hover:shadow-sm'
                                                            }`}
                                                        >
                                                            {header}
                                                        </Button>
                                                    ))}
                                                </div>
                                                {selectedColumns.length > 0 && (
                                                    <div className="text-sm text-gray-600 bg-green-50 p-2 rounded border border-green-200">
                                                        <span className="font-medium">Selected:</span> {selectedColumns.join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Operation Selection (only for raw mode) */}
                                        {dataType === 'raw' && (
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-gray-700">
                                                    Operation
                                                </Label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[
                                                        { value: 'sum', label: 'Sum', description: 'Add all values' },
                                                        { value: 'average', label: 'Average', description: 'Calculate mean' },
                                                        { value: 'count', label: 'Count', description: 'Count items' },
                                                        { value: 'min', label: 'Minimum', description: 'Find lowest value' },
                                                        { value: 'max', label: 'Maximum', description: 'Find highest value' },
                                                        { value: 'custom', label: 'Custom', description: 'Custom formula' }
                                                    ].map((op) => (
                                                        <Button
                                                            key={op.value}
                                                            variant={operation === op.value ? 'default' : 'outline'}
                                                            onClick={() => setOperation(op.value as any)}
                                                            className={`h-auto p-3 text-sm transition-all duration-200 ${
                                                                operation === op.value
                                                                    ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                                                                    : 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 hover:shadow-sm'
                                                            }`}
                                                        >
                                                            <div className="flex flex-col items-center space-y-1">
                                                                <span className="font-medium">{op.label}</span>
                                                                <span className="text-xs text-gray-500">{op.description}</span>
                                                            </div>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Custom Formula Input (only for raw mode with custom operation) */}
                                        {dataType === 'raw' && operation === 'custom' && (
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-gray-700">
                                                    Custom Formula
                                                </Label>
                                                <Textarea
                                                    value={customFormula}
                                                    onChange={(e) => setCustomFormula(e.target.value)}
                                                    placeholder="Enter your custom formula (e.g., SUM(A1:A10) * 1.1)"
                                                    className="min-h-[80px] text-sm"
                                                />
                                                <p className="text-xs text-gray-500">
                                                    Use column names and mathematical operations
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* File Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Database className="h-5 w-5 mr-2" />
                                        File Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                                        {getFileIcon(file.file_type)}
                                        <div>
                                            <p className="font-medium text-sm text-gray-900">{file.original_filename}</p>
                                            <p className="text-xs text-gray-500">{formatFileSize(file.file_size)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-600">File Type:</span>
                                            <p className="font-medium">{file.file_type.toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Columns:</span>
                                            <p className="font-medium">{file.processed_data?.headers?.length || 0}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Widget Preview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <TrendingUp className="h-5 w-5 mr-2" />
                                        Widget Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Widget Type:</span>
                                            <div className="flex items-center space-x-2">
                                                {widgetType === 'kpi' ? (
                                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                                ) : (
                                                    <BarChart3 className="h-4 w-4 text-green-600" />
                                                )}
                                                <span className="text-sm font-medium">
                                                    {widgetType === 'kpi' ? 'KPI Widget' : `${chartType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Widget Name:</span>
                                            <span className="text-sm font-medium text-gray-900">{widgetName || 'Not set'}</span>
                                        </div>

                                        {dataType === 'raw' && (
                                            <>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Selected Columns:</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {selectedColumns.length > 0 ? selectedColumns.length : 0}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Operation:</span>
                                                    <span className="text-sm font-medium text-gray-900 capitalize">{operation}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Button
                                    onClick={handleCreateWidget}
                                    disabled={isLoading || !widgetName.trim() || (dataType === 'raw' && selectedColumns.length === 0)}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Widget
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    className="w-full"
                                    size="lg"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
