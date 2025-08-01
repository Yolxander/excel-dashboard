import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
    FileText,
    BarChart3,
    PieChart,
    TrendingUp,
    Table,
    Plus,
    X,
    BrainCircuit,
    Settings,
    CheckCircle,
    Circle,
    ArrowLeft,
    ArrowRight,
    Save,
    RefreshCw,
    Database,
    Link as LinkIcon,
    Sparkles
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
    dataType: 'raw' | 'ai';
}

export default function WidgetSelection({
    uploadedFiles,
    currentFile,
    availableWidgets,
    displayedWidgets,
    dataType
}: WidgetSelectionProps) {
    const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(currentFile);
    const [widgets, setWidgets] = useState<FileWidgetConnection[]>(availableWidgets);
    const [displayedWidgetIds, setDisplayedWidgetIds] = useState<number[]>(
        displayedWidgets.map(w => w.id)
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

    const { toast } = useToast();

    // Initialize state on component mount
    useEffect(() => {
        // Set initial widgets state
        if (availableWidgets.length > 0) {
            setWidgets(availableWidgets);
            setDisplayedWidgetIds(displayedWidgets.map(w => w.id));
        }
    }, [availableWidgets, displayedWidgets]);

    // Load widgets when component mounts or currentFile changes
    useEffect(() => {
        const loadInitialData = async () => {
            if (currentFile) {
                await handleFileSelect(currentFile);
            } else if (availableWidgets.length > 0) {
                // If no currentFile but we have availableWidgets, use the first file
                const firstFile = uploadedFiles.find(f => f.id === availableWidgets[0].uploaded_file_id);
                if (firstFile) {
                    await handleFileSelect(firstFile);
                }
            }
            setIsInitialLoading(false);
        };

        loadInitialData();
    }, [currentFile, availableWidgets, uploadedFiles]);

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
                return <BrainCircuit className="h-4 w-4 text-blue-600" />;
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

        const isCurrentlySelected = displayedWidgetIds.includes(widgetId);

        if (isCurrentlySelected) {
            // Deselecting is always allowed
            setDisplayedWidgetIds(prev => prev.filter(id => id !== widgetId));
        } else {
            // Check limits before selecting
            if (widget.widget_type === 'kpi') {
                const currentKpiCount = displayedWidgetIds.filter(id =>
                    widgets.find(w => w.id === id)?.widget_type === 'kpi'
                ).length;

                if (currentKpiCount >= 4) {
                    toast({
                        title: 'Selection limit reached',
                        description: 'You can only select up to 4 KPI widgets. Please deselect another KPI widget first.',
                        variant: 'warning',
                    });
                    return;
                }
            } else if (widget.widget_type === 'bar_chart' || widget.widget_type === 'pie_chart') {
                const currentChartCount = displayedWidgetIds.filter(id =>
                    widgets.find(w => w.id === id)?.widget_type === 'bar_chart' ||
                    widgets.find(w => w.id === id)?.widget_type === 'pie_chart'
                ).length;

                if (currentChartCount >= 2) {
                    toast({
                        title: 'Selection limit reached',
                        description: 'You can only select up to 2 chart widgets. Please deselect another chart widget first.',
                        variant: 'warning',
                    });
                    return;
                }
            }

            // Add the widget to selection
            setDisplayedWidgetIds(prev => [...prev, widgetId]);
        }
    };

    const handleRemoveWidget = async (widgetId: number) => {
        try {
            const response = await fetch(`/widget-selection/remove-widget/${widgetId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                // Remove from displayed widgets if it was selected
                setDisplayedWidgetIds(prev => prev.filter(id => id !== widgetId));

                // Remove from widgets list
                setWidgets(prev => prev.filter(widget => widget.id !== widgetId));

                toast({
                    title: 'Widget removed!',
                    description: 'The widget has been removed successfully.',
                });
            } else {
                throw new Error(data.message || 'Failed to remove widget');
            }
        } catch (error) {
            console.error('Error removing widget:', error);
            toast({
                title: 'Error removing widget',
                description: error.message || 'There was an error removing the widget. Please try again.',
                variant: 'destructive',
            });
        }
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
                toast({
                    title: 'Widget selection saved successfully!',
                    description: 'Your widget selection has been saved.',
                });
            }
        } catch (error) {
            console.error('Error saving widget selection:', error);
            toast({
                title: 'Error saving widget selection.',
                description: 'There was an error saving your widget selection. Please try again.',
                variant: 'destructive',
            });
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
                toast({
                    title: 'File connected to dashboard!',
                    description: 'Your file has been connected to the dashboard.',
                });
            }
        } catch (error) {
            console.error('Error connecting file:', error);
            toast({
                title: 'Error connecting file.',
                description: 'There was an error connecting your file. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const analyzeFileWithAI = async (file: UploadedFile) => {
        setIsGeneratingInsights(true);
        try {
            const response = await fetch(`/ai/analyze-file/${file.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'AI analysis completed successfully!',
                    description: 'Enhanced widgets and charts are now available. Refreshing widgets...',
                });

                // Reload widgets for the file
                await handleFileSelect(file);

                toast({
                    title: 'Widgets generated!',
                    description: 'AI has generated widgets for your file. You can now select which ones to display.',
                });
            } else {
                toast({
                    title: 'AI analysis failed',
                    description: data.message || 'Failed to generate insights for this file.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error analyzing file with AI:', error);
            toast({
                title: 'Network error',
                description: 'Failed to connect to AI service. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsGeneratingInsights(false);
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
            <DashboardLayout
                title="Widget Selection"
                description="Customize and manage your dashboard widgets"
                showDataTypeIndicator={true}
                dataType={dataType}
            >
                <div className="space-y-6">
                    {/* Back to Dashboard Button */}
                    <div className="flex justify-end">
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
                        <div className="lg:col-span-2" key={selectedFile?.id || 'no-file'}>
                            {isInitialLoading ? (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Loading Widgets...
                                        </h3>
                                        <p className="text-gray-600">
                                            Please wait while we load your widgets
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : selectedFile ? (
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

                                    {/* Selection Limits Reminder */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 text-sm font-bold">!</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-blue-900 mb-1">
                                                    Selection Limits Reminder
                                                </h3>
                                                <div className="text-sm text-blue-700 space-y-1">
                                                    <p>• You can select <strong>up to 4 KPI widgets</strong> (currently {displayedWidgetIds.filter(id => widgets.find(w => w.id === id)?.widget_type === 'kpi').length}/4 selected)</p>
                                                    <p>• You can select <strong>up to 2 chart widgets</strong> (currently {displayedWidgetIds.filter(id => widgets.find(w => w.id === id)?.widget_type === 'bar_chart' || widgets.find(w => w.id === id)?.widget_type === 'pie_chart').length}/2 selected)</p>
                                                    <p>• Only selected widgets will appear on your dashboard</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Check if file has widgets */}
                                    {widgets.length === 0 ? (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center">
                                                    {dataType === 'raw' ? (
                                                        <Database className="h-5 w-5 mr-2 text-blue-600" />
                                                    ) : (
                                                        <BrainCircuit className="h-5 w-5 mr-2 text-blue-600" />
                                                    )}
                                                    No Widgets Available
                                                </CardTitle>
                                                <CardDescription>
                                                    {dataType === 'raw'
                                                        ? 'This file doesn\'t have any widgets yet. Create widgets manually to analyze your data.'
                                                        : 'This file doesn\'t have any widgets yet. Generate AI insights to create widgets for this file.'
                                                    }
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-center py-8">
                                                    <div className="mb-4">
                                                        {dataType === 'raw' ? (
                                                            <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                        ) : (
                                                            <BrainCircuit className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                        )}
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                            No Widgets Found
                                                        </h3>
                                                        <p className="text-gray-600 mb-6">
                                                            {dataType === 'raw'
                                                                ? 'Create widgets manually by selecting columns and operations from your data.'
                                                                : 'This file hasn\'t been analyzed with AI yet. Generate insights to create widgets based on your data.'
                                                            }
                                                        </p>
                                                    </div>
                                                    {dataType === 'raw' ? (
                                                        <div className="space-y-3">
                                                            <Button
                                                                onClick={() => {
                                                                    if (selectedFile) {
                                                                        window.location.href = `/create-widget/${selectedFile.id}/kpi`;
                                                                    }
                                                                }}
                                                                className="bg-blue-600 hover:bg-blue-700 mr-3"
                                                            >
                                                                <Plus className="h-4 w-4 mr-2" />
                                                                Create KPI Widget
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    if (selectedFile) {
                                                                        window.location.href = `/create-widget/${selectedFile.id}/chart`;
                                                                    }
                                                                }}
                                                                variant="outline"
                                                            >
                                                                <BarChart3 className="h-4 w-4 mr-2" />
                                                                Create Chart Widget
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            onClick={() => analyzeFileWithAI(selectedFile)}
                                                            disabled={isGeneratingInsights}
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            {isGeneratingInsights ? (
                                                                <>
                                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                                    Generating Insights...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Sparkles className="h-4 w-4 mr-2" />
                                                                    Generate Insights
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <>
                                            {/* KPI Widgets */}
                                            {kpiWidgets.length > 0 && (
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                <Database className="h-5 w-5 mr-2" />
                                                                KPI Widgets
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Badge variant="outline" className="text-blue-600 border-blue-200">
                                                                    {displayedWidgetIds.filter(id => widgets.find(w => w.id === id)?.widget_type === 'kpi').length}/4 Selected
                                                                </Badge>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        if (selectedFile) {
                                                                            window.location.href = `/create-widget/${selectedFile.id}/kpi`;
                                                                        }
                                                                    }}
                                                                >
                                                                    <Plus className="h-4 w-4 mr-1" />
                                                                    Add KPI
                                                                </Button>
                                                            </div>
                                                        </CardTitle>
                                                        <CardDescription>
                                                            Select up to 4 KPI widgets to display on your dashboard
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {kpiWidgets.map((widget) => {
                                                                const isSelected = displayedWidgetIds.includes(widget.id);
                                                                const isDisabled = !isSelected &&
                                                                    displayedWidgetIds.filter(id =>
                                                                        widgets.find(w => w.id === id)?.widget_type === 'kpi'
                                                                    ).length >= 4;

                                                                return (
                                                                    <div
                                                                        key={widget.id}
                                                                        className={`p-4 border rounded-lg transition-colors ${
                                                                            isSelected
                                                                                ? 'border-blue-500 bg-blue-50'
                                                                                : isDisabled
                                                                                ? 'border-gray-200 bg-gray-50 opacity-60'
                                                                                : 'border-gray-200 hover:border-gray-300'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center space-x-3">
                                                                                <Checkbox
                                                                                    checked={isSelected}
                                                                                    onCheckedChange={() => handleWidgetToggle(widget.id)}
                                                                                    disabled={isDisabled}
                                                                                />
                                                                                <div className="flex items-center space-x-2">
                                                                                    {getWidgetIcon(widget.widget_type)}
                                                                                    <span className={`font-medium ${isDisabled ? 'text-gray-500' : ''}`}>
                                                                                        {widget.widget_name}
                                                                                    </span>
                                                                                    {isDisabled && (
                                                                                        <Badge variant="secondary" className="text-xs">
                                                                                            Limit Reached
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => handleRemoveWidget(widget.id)}
                                                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                        {widget.widget_config?.description && (
                                                                            <p className={`text-sm mt-2 ml-6 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                                {widget.widget_config.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}

                                                                                        {/* Chart Widgets */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <BarChart3 className="h-5 w-5 mr-2" />
                                                            Chart Widgets
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                                                                {displayedWidgetIds.filter(id => widgets.find(w => w.id === id)?.widget_type === 'bar_chart' || widgets.find(w => w.id === id)?.widget_type === 'pie_chart').length}/2 Selected
                                                            </Badge>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    if (selectedFile) {
                                                                        window.location.href = `/create-widget/${selectedFile.id}/chart`;
                                                                    }
                                                                }}
                                                            >
                                                                <Plus className="h-4 w-4 mr-1" />
                                                                Add Chart
                                                            </Button>
                                                        </div>
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Select up to 2 chart widgets to display on your dashboard
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    {chartWidgets.length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {chartWidgets.map((widget) => {
                                                                const isSelected = displayedWidgetIds.includes(widget.id);
                                                                const isDisabled = !isSelected &&
                                                                    displayedWidgetIds.filter(id =>
                                                                        widgets.find(w => w.id === id)?.widget_type === 'bar_chart' ||
                                                                        widgets.find(w => w.id === id)?.widget_type === 'pie_chart'
                                                                    ).length >= 2;

                                                                return (
                                                                    <div
                                                                        key={widget.id}
                                                                        className={`p-4 border rounded-lg transition-colors ${
                                                                            isSelected
                                                                                ? 'border-blue-500 bg-blue-50'
                                                                                : isDisabled
                                                                                ? 'border-gray-200 bg-gray-50 opacity-60'
                                                                                : 'border-gray-200 hover:border-gray-300'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center space-x-3">
                                                                                <Checkbox
                                                                                    checked={isSelected}
                                                                                    onCheckedChange={() => handleWidgetToggle(widget.id)}
                                                                                    disabled={isDisabled}
                                                                                />
                                                                                <div className="flex items-center space-x-2">
                                                                                    {getWidgetIcon(widget.widget_type)}
                                                                                    <span className={`font-medium ${isDisabled ? 'text-gray-500' : ''}`}>
                                                                                        {widget.widget_name}
                                                                                    </span>
                                                                                    {isDisabled && (
                                                                                        <Badge variant="secondary" className="text-xs">
                                                                                            Limit Reached
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => handleRemoveWidget(widget.id)}
                                                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                        {widget.widget_config?.description && (
                                                                            <p className={`text-sm mt-2 ml-6 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                                {widget.widget_config.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                                No Chart Widgets
                                                            </h3>
                                                            <p className="text-gray-600 mb-6">
                                                                Create chart widgets to visualize your data
                                                            </p>
                                                            <Button
                                                                onClick={() => {
                                                                    if (selectedFile) {
                                                                        window.location.href = `/create-widget/${selectedFile.id}/chart`;
                                                                    }
                                                                }}
                                                                className="bg-blue-600 hover:bg-blue-700"
                                                            >
                                                                <Plus className="h-4 w-4 mr-2" />
                                                                Create Chart Widget
                                                            </Button>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>

                                            {/* Table Widgets */}
                                            {tableWidgets.length > 0 && (
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center">
                                                            <FileText className="h-5 w-5 mr-2" />
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
                                        </>
                                    )}
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
