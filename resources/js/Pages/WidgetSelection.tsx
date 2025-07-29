import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
    const [isAddingWidget, setIsAddingWidget] = useState(false);
    const [newWidgetName, setNewWidgetName] = useState('');
    const [newWidgetType, setNewWidgetType] = useState('kpi');
    const [newWidgetConfig, setNewWidgetConfig] = useState<any>({});
    const [widgetSuggestions, setWidgetSuggestions] = useState<any>(null);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [functionOptions, setFunctionOptions] = useState<any[]>([]);
    const [isLoadingFunctionOptions, setIsLoadingFunctionOptions] = useState(false);
    const [selectedFunction, setSelectedFunction] = useState<any>(null);
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

    const loadFunctionOptions = async (file: UploadedFile, widgetType: string) => {
        setIsLoadingFunctionOptions(true);
        try {
            const response = await fetch(`/widget-selection/function-options/${file.id}?widget_type=${widgetType}`);
            const data = await response.json();

            if (data.success) {
                setFunctionOptions(data.options);
            } else {
                console.error('Failed to load function options:', data.message);
            }
        } catch (error) {
            console.error('Error loading function options:', error);
        } finally {
            setIsLoadingFunctionOptions(false);
        }
    };

    const loadWidgetSuggestions = async (file: UploadedFile) => {
        setIsLoadingSuggestions(true);
        try {
            const response = await fetch(`/widget-selection/suggestions/${file.id}`);
            const data = await response.json();

            if (data.success) {
                setWidgetSuggestions(data.suggestions);
            } else {
                console.error('Failed to load suggestions:', data.message);
            }
        } catch (error) {
            console.error('Error loading widget suggestions:', error);
        } finally {
            setIsLoadingSuggestions(false);
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
                                                    <BrainCircuit className="h-5 w-5 mr-2 text-blue-600" />
                                                    No Widgets Available
                                                </CardTitle>
                                                <CardDescription>
                                                    This file doesn't have any widgets yet. Generate AI insights to create widgets for this file.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-center py-8">
                                                    <div className="mb-4">
                                                        <BrainCircuit className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                            No Widgets Found
                                                        </h3>
                                                        <p className="text-gray-600 mb-6">
                                                            This file hasn't been analyzed with AI yet. Generate insights to create widgets based on your data.
                                                        </p>
                                                    </div>
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
                                                            onClick={async () => {
                                                                setNewWidgetType('kpi');
                                                                setNewWidgetName('');
                                                                setNewWidgetConfig({});
                                                                setSelectedFunction(null);
                                                                setIsAddingWidget(true);
                                                                if (selectedFile) {
                                                                    await loadWidgetSuggestions(selectedFile);
                                                                    await loadFunctionOptions(selectedFile, 'kpi');
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
                                    {chartWidgets.length > 0 && (
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
                                                            onClick={async () => {
                                                                setNewWidgetType('bar_chart');
                                                                setNewWidgetName('');
                                                                setNewWidgetConfig({});
                                                                setSelectedFunction(null);
                                                                setIsAddingWidget(true);
                                                                if (selectedFile) {
                                                                    await loadWidgetSuggestions(selectedFile);
                                                                    await loadFunctionOptions(selectedFile, 'bar_chart');
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
                                            </CardContent>
                                        </Card>
                                    )}

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

                                    {/* Add New Widget Modal */}
                                    <Dialog open={isAddingWidget} onOpenChange={setIsAddingWidget}>
                                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                            <DialogHeader className="space-y-3">
                                                <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
                                                    <Plus className="h-6 w-6 mr-2 text-blue-600" />
                                                    Add New Widget
                                                </DialogTitle>
                                                <DialogDescription className="text-gray-600 text-base">
                                                    Create a new widget for this file using AI or manual configuration.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-6 py-6">
                                                {/* Creation Method Selection */}
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-semibold text-gray-700">
                                                        Creation Method
                                                    </Label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Button
                                                            variant={newWidgetConfig.method === 'ai' ? 'default' : 'outline'}
                                                            onClick={() => setNewWidgetConfig({ ...newWidgetConfig, method: 'ai' })}
                                                            className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                                                                newWidgetConfig.method === 'ai'
                                                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                                    : 'hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            <BrainCircuit className="h-6 w-6" />
                                                            <span className="font-medium">AI Generated</span>
                                                            <span className="text-xs text-gray-500">Let AI create the widget</span>
                                                        </Button>
                                                        <Button
                                                            variant={newWidgetConfig.method === 'manual' ? 'default' : 'outline'}
                                                            onClick={() => setNewWidgetConfig({ ...newWidgetConfig, method: 'manual' })}
                                                            className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                                                                newWidgetConfig.method === 'manual'
                                                                    ? 'bg-green-50 border-green-200 text-green-700'
                                                                    : 'hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            <Settings className="h-6 w-6" />
                                                            <span className="font-medium">Manual</span>
                                                            <span className="text-xs text-gray-500">Configure manually</span>
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Widget Name - Only for Manual Method */}
                                                {newWidgetConfig.method === 'manual' && (
                                                    <div className="space-y-2">
                                                        <Label htmlFor="widget-name" className="text-sm font-semibold text-gray-700">
                                                            Widget Name
                                                        </Label>
                                                        <Input
                                                            id="widget-name"
                                                            value={newWidgetName}
                                                            onChange={(e) => setNewWidgetName(e.target.value)}
                                                            placeholder="Enter a descriptive name for your widget"
                                                            className="h-12 text-base"
                                                        />
                                                    </div>
                                                )}

                                                {/* AI Method Form */}
                                                {newWidgetConfig.method === 'ai' && (
                                                    <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                        <Label htmlFor="ai-description" className="text-sm font-semibold text-gray-700">
                                                            What should this widget be about?
                                                        </Label>
                                                        <Textarea
                                                            id="ai-description"
                                                            value={newWidgetConfig.aiDescription || ''}
                                                            onChange={(e) => setNewWidgetConfig({ ...newWidgetConfig, aiDescription: e.target.value })}
                                                            placeholder="(Optional) Describe what you want this widget to show or analyze. For example: 'Show total sales by month' or 'Display customer satisfaction trends'. Leave empty to let AI generate a new widget automatically."
                                                            className="min-h-[100px] text-base resize-none"
                                                        />
                                                        <p className="text-xs text-gray-500">
                                                            Optional: Be specific about what data you want to visualize or analyze. Leave empty to let AI generate a completely new widget.
                                                        </p>
                                                    </div>
                                                )}

                                                {/* AI Suggestions for Manual Creation */}
                                                {newWidgetConfig.method === 'manual' && widgetSuggestions && (
                                                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                        <div className="flex items-center space-x-2 mb-3">
                                                            <BrainCircuit className="h-5 w-5 text-blue-600" />
                                                            <h4 className="font-semibold text-blue-900">AI Suggestions</h4>
                                                        </div>

                                                        {isLoadingSuggestions ? (
                                                            <div className="text-center py-4">
                                                                <RefreshCw className="h-6 w-6 text-blue-600 mx-auto mb-2 animate-spin" />
                                                                <p className="text-sm text-blue-700">Loading AI suggestions...</p>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                {/* KPI Suggestions */}
                                                                {widgetSuggestions.kpi_suggestions && widgetSuggestions.kpi_suggestions.length > 0 && (
                                                                    <div>
                                                                        <h5 className="font-medium text-blue-800 mb-2">KPI Widget Suggestions</h5>
                                                                        <div className="grid grid-cols-1 gap-2">
                                                                            {widgetSuggestions.kpi_suggestions.slice(0, 3).map((suggestion: any, index: number) => (
                                                                                <Button
                                                                                    key={index}
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() => {
                                                                                        setNewWidgetType('kpi');
                                                                                        setNewWidgetName(suggestion.name);
                                                                                        setNewWidgetConfig({ ...newWidgetConfig, column: suggestion.column });
                                                                                    }}
                                                                                    className="justify-start text-left h-auto p-3 bg-white hover:bg-blue-50"
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <TrendingUp className="h-4 w-4 text-blue-600" />
                                                                                        <div>
                                                                                            <p className="font-medium text-sm">{suggestion.name}</p>
                                                                                            <p className="text-xs text-gray-600">{suggestion.description}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </Button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Chart Suggestions */}
                                                                {widgetSuggestions.chart_suggestions && widgetSuggestions.chart_suggestions.length > 0 && (
                                                                    <div>
                                                                        <h5 className="font-medium text-blue-800 mb-2">Chart Widget Suggestions</h5>
                                                                        <div className="grid grid-cols-1 gap-2">
                                                                            {widgetSuggestions.chart_suggestions.slice(0, 3).map((suggestion: any, index: number) => (
                                                                                <Button
                                                                                    key={index}
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() => {
                                                                                        setNewWidgetType(suggestion.type);
                                                                                        setNewWidgetName(suggestion.name);
                                                                                        if (suggestion.type === 'bar_chart') {
                                                                                            setNewWidgetConfig({
                                                                                                ...newWidgetConfig,
                                                                                                xAxis: suggestion.x_axis,
                                                                                                yAxis: suggestion.y_axis
                                                                                            });
                                                                                        } else if (suggestion.type === 'pie_chart') {
                                                                                            setNewWidgetConfig({
                                                                                                ...newWidgetConfig,
                                                                                                categoryColumn: suggestion.category_column,
                                                                                                valueColumn: suggestion.value_column
                                                                                            });
                                                                                        }
                                                                                    }}
                                                                                    className="justify-start text-left h-auto p-3 bg-white hover:bg-blue-50"
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        {suggestion.chart_type === 'bar' ? (
                                                                                            <BarChart3 className="h-4 w-4 text-green-600" />
                                                                                        ) : (
                                                                                            <PieChart className="h-4 w-4 text-purple-600" />
                                                                                        )}
                                                                                        <div>
                                                                                            <p className="font-medium text-sm">{suggestion.name}</p>
                                                                                            <p className="text-xs text-gray-600">{suggestion.description}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </Button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Data Insights */}
                                                                {widgetSuggestions.data_insights && widgetSuggestions.data_insights.length > 0 && (
                                                                    <div>
                                                                        <h5 className="font-medium text-blue-800 mb-2">Data Insights</h5>
                                                                        <div className="space-y-2">
                                                                            {widgetSuggestions.data_insights.slice(0, 2).map((insight: any, index: number) => (
                                                                                <div key={index} className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                                                                                    <strong>{insight.display_name}:</strong> {insight.recommendation}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Manual Method Form */}
                                                {newWidgetConfig.method === 'manual' && (
                                                    <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                                        {/* Widget Type Selection */}
                                                        <div className="space-y-2">
                                                            <Label htmlFor="widget-type" className="text-sm font-semibold text-gray-700">
                                                                Widget Type
                                                            </Label>
                                                            <Select onValueChange={async (value) => {
                                                                setNewWidgetType(value);
                                                                setSelectedFunction(null);
                                                                if (selectedFile) {
                                                                    await loadFunctionOptions(selectedFile, value);
                                                                }
                                                            }} value={newWidgetType}>
                                                                <SelectTrigger className="h-12 text-base">
                                                                    <SelectValue placeholder="Select a widget type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="kpi" className="flex items-center space-x-2">
                                                                        <TrendingUp className="h-4 w-4 mr-2" />
                                                                        KPI Widget
                                                                    </SelectItem>
                                                                    <SelectItem value="bar_chart" className="flex items-center space-x-2">
                                                                        <BarChart3 className="h-4 w-4 mr-2" />
                                                                        Bar Chart
                                                                    </SelectItem>
                                                                    <SelectItem value="pie_chart" className="flex items-center space-x-2">
                                                                        <PieChart className="h-4 w-4 mr-2" />
                                                                        Pie Chart
                                                                    </SelectItem>
                                                                    <SelectItem value="table" className="flex items-center space-x-2">
                                                                        <Table className="h-4 w-4 mr-2" />
                                                                        Table
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        {/* Widget Function Selection */}
                                                        {functionOptions.length > 0 && (
                                                            <div className="space-y-2">
                                                                <Label htmlFor="function-select" className="text-sm font-semibold text-gray-700">
                                                                    What should this widget do?
                                                                </Label>
                                                                <Select onValueChange={(value) => {
                                                                    const selected = functionOptions.find(option => option.id === value);
                                                                    setSelectedFunction(selected);
                                                                    if (selected) {
                                                                        setNewWidgetName(selected.label);
                                                                        if (selected.function === 'sum' || selected.function === 'average' || selected.function === 'count' || selected.function === 'min' || selected.function === 'max') {
                                                                            setNewWidgetConfig({ ...newWidgetConfig, column: selected.column, function: selected.function });
                                                                        } else if (selected.function === 'group_by_sum') {
                                                                            setNewWidgetConfig({ ...newWidgetConfig, xAxis: selected.x_axis, yAxis: selected.y_axis, function: selected.function });
                                                                        } else if (selected.function === 'distribution') {
                                                                            setNewWidgetConfig({ ...newWidgetConfig, categoryColumn: selected.category_column, valueColumn: selected.value_column, function: selected.function });
                                                                        }
                                                                    }
                                                                }} value={selectedFunction?.id || ''}>
                                                                    <SelectTrigger className="h-12 text-base">
                                                                        <SelectValue placeholder="Choose what this widget should calculate" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {functionOptions.map((option) => (
                                                                            <SelectItem key={option.id} value={option.id}>
                                                                                <div className="flex flex-col">
                                                                                    <span className="font-medium">{option.label}</span>
                                                                                    <span className="text-xs text-gray-500">{option.description}</span>
                                                                                    {option.formatted_value && (
                                                                                        <span className="text-xs text-blue-600">Current: {option.formatted_value}</span>
                                                                                    )}
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                {selectedFunction && (
                                                                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                                                        <strong>Calculation:</strong> {selectedFunction.calculation}
                                                                        {selectedFunction.formatted_value && (
                                                                            <span className="ml-2 text-blue-600">
                                                                                (Current value: {selectedFunction.formatted_value})
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Chart Configuration for Bar Charts */}
                                                        {newWidgetType === 'bar_chart' && (
                                                            <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                                                                <h4 className="font-semibold text-gray-700 mb-3">Chart Configuration</h4>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="x-axis" className="text-sm font-medium text-gray-600">
                                                                            X-Axis
                                                                        </Label>
                                                                        <Select onValueChange={(value) => setNewWidgetConfig({ ...newWidgetConfig, xAxis: value })} value={newWidgetConfig.xAxis}>
                                                                            <SelectTrigger className="h-10">
                                                                                <SelectValue placeholder="Select X-Axis" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {selectedFile?.processed_data?.headers?.map((header: string) => (
                                                                                    <SelectItem key={header} value={header}>
                                                                                        {header}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="y-axis" className="text-sm font-medium text-gray-600">
                                                                            Y-Axis
                                                                        </Label>
                                                                        <Select onValueChange={(value) => setNewWidgetConfig({ ...newWidgetConfig, yAxis: value })} value={newWidgetConfig.yAxis}>
                                                                            <SelectTrigger className="h-10">
                                                                                <SelectValue placeholder="Select Y-Axis" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {selectedFile?.processed_data?.headers?.map((header: string) => (
                                                                                    <SelectItem key={header} value={header}>
                                                                                        {header}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Chart Configuration for Pie Charts */}
                                                        {newWidgetType === 'pie_chart' && (
                                                            <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                                                                <h4 className="font-semibold text-gray-700 mb-3">Chart Configuration</h4>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="category-column" className="text-sm font-medium text-gray-600">
                                                                            Category Column
                                                                        </Label>
                                                                        <Select onValueChange={(value) => setNewWidgetConfig({ ...newWidgetConfig, categoryColumn: value })} value={newWidgetConfig.categoryColumn}>
                                                                            <SelectTrigger className="h-10">
                                                                                <SelectValue placeholder="Select Category Column" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {selectedFile?.processed_data?.headers?.map((header: string) => (
                                                                                    <SelectItem key={header} value={header}>
                                                                                        {header}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="value-column" className="text-sm font-medium text-gray-600">
                                                                            Value Column
                                                                        </Label>
                                                                        <Select onValueChange={(value) => setNewWidgetConfig({ ...newWidgetConfig, valueColumn: value })} value={newWidgetConfig.valueColumn}>
                                                                            <SelectTrigger className="h-10">
                                                                                <SelectValue placeholder="Select Value Column" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {selectedFile?.processed_data?.headers?.map((header: string) => (
                                                                                    <SelectItem key={header} value={header}>
                                                                                        {header}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setIsAddingWidget(false)}
                                                    className="px-6 py-2"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={async () => {
                                                                                                                if (newWidgetConfig.method === 'ai') {
                                                            console.log('Starting AI widget creation...', {
                                                                file_id: selectedFile?.id,
                                                                description: newWidgetConfig.aiDescription || '',
                                                                widget_type: newWidgetType,
                                                            });

                                                            // Show progress toast for AI widget creation
                                                            const progressToast = toast({
                                                                title: 'Creating AI Widget...',
                                                                description: 'Please wait while AI generates your widget.',
                                                                duration: Infinity, // Keep toast open until completion
                                                            });

                                                            try {
                                                                // Call AI service to create widget
                                                                const response = await fetch('/ai/create-widget', {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                                    },
                                                                    body: JSON.stringify({
                                                                        file_id: selectedFile?.id,
                                                                        description: newWidgetConfig.aiDescription || '',
                                                                        widget_type: newWidgetType,
                                                                    }),
                                                                });

                                                                console.log('Response status:', response.status);
                                                                const data = await response.json();
                                                                console.log('Response data:', data);

                                                                if (data.success) {
                                                                    // Close progress toast and show success
                                                                    progressToast.dismiss();
                                                                    toast({
                                                                        title: 'AI Widget Created!',
                                                                        description: `Widget "${data.widget_name || 'New Widget'}" has been created successfully.`,
                                                                        duration: 5000,
                                                                    });

                                                                    // Reload widgets for the file
                                                                    if (selectedFile) {
                                                                        await handleFileSelect(selectedFile);
                                                                    }

                                                                    // Close the modal and reset form
                                                                    setIsAddingWidget(false);
                                                                    setNewWidgetConfig({});
                                                                    setNewWidgetName('');
                                                                } else {
                                                                    throw new Error(data.message || 'Failed to create widget');
                                                                }
                                                            } catch (error) {
                                                                console.error('Error creating AI widget:', error);
                                                                progressToast.dismiss();
                                                                toast({
                                                                    title: 'Error creating widget',
                                                                    description: error.message || 'There was an error creating the widget. Please try again.',
                                                                    variant: 'destructive',
                                                                    duration: 5000,
                                                                });
                                                            }
                                                        } else if (newWidgetConfig.method === 'manual') {
                                                            // Create manual widget
                                                            console.log('Creating manual widget:', {
                                                                name: newWidgetName,
                                                                type: newWidgetType,
                                                                method: 'manual',
                                                                config: newWidgetConfig,
                                                                fileId: selectedFile?.id,
                                                            });

                                                            try {
                                                                // Call manual widget creation API
                                                                const response = await fetch('/widget-selection/create-manual-widget', {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                                    },
                                                                    body: JSON.stringify({
                                                                        file_id: selectedFile?.id,
                                                                        widget_name: newWidgetName,
                                                                        widget_type: newWidgetType,
                                                                        column: selectedFunction?.column,
                                                                        x_axis: selectedFunction?.x_axis,
                                                                        y_axis: selectedFunction?.y_axis,
                                                                        category_column: selectedFunction?.category_column,
                                                                        value_column: selectedFunction?.value_column,
                                                                        function: selectedFunction?.function,
                                                                    }),
                                                                });

                                                                const data = await response.json();

                                                                if (data.success) {
                                                                    toast({
                                                                        title: 'Widget created!',
                                                                        description: `Widget "${data.widget_name}" has been created successfully.`,
                                                                    });

                                                                    // Reload widgets for the file
                                                                    if (selectedFile) {
                                                                        await handleFileSelect(selectedFile);
                                                                    }

                                                                    // Close the modal and reset form
                                                                    setIsAddingWidget(false);
                                                                    setNewWidgetConfig({});
                                                                    setNewWidgetName('');
                                                                } else {
                                                                    throw new Error(data.message || 'Failed to create widget');
                                                                }
                                                            } catch (error) {
                                                                console.error('Error creating manual widget:', error);
                                                                toast({
                                                                    title: 'Error creating widget',
                                                                    description: error.message || 'There was an error creating the widget. Please try again.',
                                                                    variant: 'destructive',
                                                                    duration: 5000,
                                                                });
                                                            }
                                                        }
                                                    }}
                                                                                                        disabled={
                                                        !newWidgetConfig.method ||
                                                        (newWidgetConfig.method === 'manual' && (
                                                            !newWidgetName ||
                                                            !selectedFunction
                                                        ))
                                                    }
                                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Create Widget
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

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
