import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
    FileText,
    BarChart3,
    PieChart,
    Table,
    Settings,
    CheckCircle,
    Eye,
    EyeOff,
    ArrowLeft,
    Save,
    RefreshCw,
    Database,
    Link as LinkIcon,
    Unlink,
} from 'lucide-react';

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

interface FileWidgetConnection {
    id: number;
    uploaded_file_id: number;
    widget_name: string;
    widget_type: string;
    widget_config?: any;
    is_displayed: boolean;
    display_order: number;
    ai_insights?: any;
    uploaded_file?: UploadedFile;
    created_at: string;
    updated_at: string;
}

interface WidgetSelectionProps {
    uploadedFiles: UploadedFile[];
    currentFile: UploadedFile | null;
    availableWidgets: FileWidgetConnection[];
    displayedWidgets: FileWidgetConnection[];
}

export default function WidgetSelection({
    uploadedFiles,
    currentFile,
    availableWidgets,
    displayedWidgets
}: WidgetSelectionProps) {
    const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(currentFile);
    const [widgets, setWidgets] = useState<FileWidgetConnection[]>(availableWidgets);
    const [displayedWidgetIds, setDisplayedWidgetIds] = useState<number[]>(
        displayedWidgets.map(w => w.id)
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    // Check if selected file is connected to dashboard
    useEffect(() => {
        if (selectedFile) {
            const connectedWidgets = widgets.filter(w => w.is_displayed);
            setIsConnected(connectedWidgets.length > 0);
        }
    }, [selectedFile, widgets]);

    const getWidgetIcon = (widgetType: string) => {
        switch (widgetType) {
            case 'kpi':
                return <Database className="h-4 w-4 text-blue-600" />;
            case 'bar_chart':
                return <BarChart3 className="h-4 w-4 text-green-600" />;
            case 'pie_chart':
                return <PieChart className="h-4 w-4 text-purple-600" />;
            case 'table':
                return <Table className="h-4 w-4 text-orange-600" />;
            default:
                return <FileText className="h-4 w-4 text-gray-600" />;
        }
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

    const handleFileSelect = async (file: UploadedFile) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/widget-selection/widgets/${file.id}`);
            const data = await response.json();

            if (data.success) {
                setSelectedFile(file);
                setWidgets(data.availableWidgets);
                setDisplayedWidgetIds(data.displayedWidgets.map((w: any) => w.id));

                // Update connection status
                const connectedWidgets = data.availableWidgets.filter((w: any) => w.is_displayed);
                setIsConnected(connectedWidgets.length > 0);
            }
        } catch (error) {
            console.error('Error loading widgets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWidgetToggle = (widgetId: number) => {
        const widget = widgets.find(w => w.id === widgetId);
        if (!widget) return;

        const currentKpiSelected = displayedWidgetIds.filter(id =>
            widgets.find(w => w.id === id)?.widget_type === 'kpi'
        ).length;

        const currentChartSelected = displayedWidgetIds.filter(id =>
            widgets.find(w => w.id === id)?.widget_type === 'bar_chart' ||
            widgets.find(w => w.id === id)?.widget_type === 'pie_chart'
        ).length;

        // Check limits
        if (widget.widget_type === 'kpi' && !displayedWidgetIds.includes(widgetId) && currentKpiSelected >= 4) {
            return; // Can't select more than 4 KPI widgets
        }

        if ((widget.widget_type === 'bar_chart' || widget.widget_type === 'pie_chart') &&
            !displayedWidgetIds.includes(widgetId) && currentChartSelected >= 2) {
            return; // Can't select more than 2 chart widgets
        }

        setDisplayedWidgetIds(prev => {
            if (prev.includes(widgetId)) {
                return prev.filter(id => id !== widgetId);
            } else {
                return [...prev, widgetId];
            }
        });
    };

    const handleSaveSelection = async () => {
        if (!selectedFile) return;

        setIsSaving(true);
        try {
            const response = await fetch('/widget-selection/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    fileId: selectedFile.id,
                    selectedWidgetIds: displayedWidgetIds,
                }),
            });

            const data = await response.json();
            if (data.success) {
                // Update the widgets state to reflect the new display status
                setWidgets(prev => prev.map(widget => ({
                    ...widget,
                    is_displayed: displayedWidgetIds.includes(widget.id)
                })));

                // Show success message
                alert('Widget selection saved successfully!');
            }
        } catch (error) {
            console.error('Error saving widget selection:', error);
            alert('Error saving widget selection. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleConnectFile = async (file: UploadedFile) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/widget-selection/connect/${file.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            if (data.success) {
                setSelectedFile(file);
                // Reload widgets for the connected file
                await handleFileSelect(file);
                // Update connection status
                setIsConnected(true);
            }
        } catch (error) {
            console.error('Error connecting file:', error);
        } finally {
            setIsLoading(false);
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

    const kpiWidgets = widgets.filter(w => w.widget_type === 'kpi');
    const chartWidgets = widgets.filter(w => ['bar_chart', 'pie_chart'].includes(w.widget_type));
    const tableWidgets = widgets.filter(w => w.widget_type === 'table');

    return (
        <>
            <Head title="Widget Selection" />
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Widget Selection</h1>
                            <p className="text-gray-600 mt-2">
                                Choose which widgets to display on your dashboard
                            </p>
                        </div>
                        <Link href="/dashboard">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* File Selection */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Database className="h-5 w-5 mr-2" />
                                        Connected Files
                                    </CardTitle>
                                    <CardDescription>
                                        Select a file to manage its widgets
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {uploadedFiles.map((file) => (
                                            <div
                                                key={file.id}
                                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                    selectedFile?.id === file.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => handleFileSelect(file)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        {getFileIcon(file.file_type)}
                                                        <div>
                                                            <p className="font-medium text-sm text-gray-900">
                                                                {file.original_filename}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {formatFileSize(file.file_size)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {selectedFile?.id === file.id && (
                                                        <CheckCircle className="h-4 w-4 text-blue-600" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Widget Selection */}
                        <div className="lg:col-span-2">
                            {selectedFile ? (
                                <div className="space-y-6">
                                    {/* Current File Info */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    {getFileIcon(selectedFile.file_type)}
                                                    <span className="ml-2">{selectedFile.original_filename}</span>
                                                </div>
                                                {isConnected ? (
                                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Connected to Dashboard
                                                    </Badge>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleConnectFile(selectedFile)}
                                                        disabled={isLoading}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        {isLoading ? (
                                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <LinkIcon className="h-4 w-4" />
                                                        )}
                                                        Connect to Dashboard
                                                    </Button>
                                                )}
                                            </CardTitle>
                                            <CardDescription>
                                                Select up to 4 KPI widgets and 2 chart widgets to display
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>

                                    {/* KPI Widgets */}
                                    {kpiWidgets.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center">
                                                    <Database className="h-5 w-5 mr-2" />
                                                    KPI Widgets (Select up to 4 of 6)
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {kpiWidgets.map((widget) => (
                                                        <div
                                                            key={widget.id}
                                                            className={`p-4 border rounded-lg ${
                                                                displayedWidgetIds.includes(widget.id)
                                                                    ? 'border-blue-500 bg-blue-50'
                                                                    : 'border-gray-200'
                                                            }`}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <Checkbox
                                                                    checked={displayedWidgetIds.includes(widget.id)}
                                                                    onCheckedChange={() => handleWidgetToggle(widget.id)}
                                                                    disabled={!displayedWidgetIds.includes(widget.id) &&
                                                                        displayedWidgetIds.filter(id =>
                                                                            widgets.find(w => w.id === id)?.widget_type === 'kpi'
                                                                        ).length >= 4}
                                                                />
                                                                <div className="flex items-center space-x-2">
                                                                    {getWidgetIcon(widget.widget_type)}
                                                                    <span className="font-medium">{widget.widget_name}</span>
                                                                </div>
                                                            </div>
                                                            {widget.widget_config?.description && (
                                                                <p className="text-sm text-gray-600 mt-2 ml-6">
                                                                    {widget.widget_config.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Chart Widgets */}
                                    {chartWidgets.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center">
                                                    <BarChart3 className="h-5 w-5 mr-2" />
                                                    Chart Widgets (Select up to 2 of 4)
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {chartWidgets.map((widget) => (
                                                        <div
                                                            key={widget.id}
                                                            className={`p-4 border rounded-lg ${
                                                                displayedWidgetIds.includes(widget.id)
                                                                    ? 'border-blue-500 bg-blue-50'
                                                                    : 'border-gray-200'
                                                            }`}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <Checkbox
                                                                    checked={displayedWidgetIds.includes(widget.id)}
                                                                    onCheckedChange={() => handleWidgetToggle(widget.id)}
                                                                    disabled={!displayedWidgetIds.includes(widget.id) &&
                                                                        displayedWidgetIds.filter(id =>
                                                                            widgets.find(w => w.id === id)?.widget_type === 'bar_chart' ||
                                                                            widgets.find(w => w.id === id)?.widget_type === 'pie_chart'
                                                                        ).length >= 2}
                                                                />
                                                                <div className="flex items-center space-x-2">
                                                                    {getWidgetIcon(widget.widget_type)}
                                                                    <span className="font-medium">{widget.widget_name}</span>
                                                                </div>
                                                            </div>
                                                            {widget.widget_config?.description && (
                                                                <p className="text-sm text-gray-600 mt-2 ml-6">
                                                                    {widget.widget_config.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Table Widgets */}
                                    {tableWidgets.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center">
                                                    <Table className="h-5 w-5 mr-2" />
                                                    Table Widgets
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {tableWidgets.map((widget) => (
                                                        <div
                                                            key={widget.id}
                                                            className={`p-4 border rounded-lg ${
                                                                displayedWidgetIds.includes(widget.id)
                                                                    ? 'border-blue-500 bg-blue-50'
                                                                    : 'border-gray-200'
                                                            }`}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <Checkbox
                                                                    checked={displayedWidgetIds.includes(widget.id)}
                                                                    onCheckedChange={() => handleWidgetToggle(widget.id)}
                                                                />
                                                                <div className="flex items-center space-x-2">
                                                                    {getWidgetIcon(widget.widget_type)}
                                                                    <span className="font-medium">{widget.widget_name}</span>
                                                                </div>
                                                            </div>
                                                            {widget.widget_config?.description && (
                                                                <p className="text-sm text-gray-600 mt-2 ml-6">
                                                                    {widget.widget_config.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Save Button */}
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleSaveSelection}
                                            disabled={isSaving}
                                            className="w-full md:w-auto"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Save Selection
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No File Selected
                                        </h3>
                                        <p className="text-gray-600">
                                            Select a file from the list to manage its widgets
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
