import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/input';
import { AIInsights } from '@/components/ui/ai-insights';
import {
    FileText,
    Upload,
    Link as LinkIcon,
    Unlink,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    Plus,
    Trash2,
    Download,
    Eye,
    Sparkles,
    RefreshCw,
    Brain,
    Lightbulb,
    TrendingUp,
    AlertTriangle,
    Info,
    Settings
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

interface UploadedFile {
    id: number;
    original_filename: string;
    file_size: number;
    status: string;
    created_at: string;
    processed_data?: {
        headers: string[];
        data: any[];
        total_rows: number;
        total_columns: number;
    };
}

interface DashboardWidget {
    id: number;
    widget_type: string;
    widget_name: string;
    uploaded_file_id: number | null;
    is_active: boolean;
    display_order: number;
    uploaded_file?: UploadedFile;
}

interface AIInsights {
    suggested_filename?: string;
    combination_strategy?: string;
    expected_insights?: string[];
    potential_challenges?: string[];
    recommendations?: string[];
    business_value?: string;
    data_insights?: string[];
    key_discoveries?: string[];
    business_opportunities?: string[];
    data_quality_insights?: string[];
    analytics_recommendations?: string[];
    newColumnsCreated?: { name: string; description: string }[];
    optimizationsMade?: string[];
}

interface PreviewData {
    filesData: any[];
    aiInsights: AIInsights;
    combinedFileName: string;
    estimatedRows: number;
    estimatedColumns: number;
    newColumnsCreated?: { name: string; description: string }[];
    optimizationsMade?: string[];
}

interface CombineFilesProps {
    uploadedFiles: UploadedFile[];
    connectedWidgets: DashboardWidget[];
}

export default function CombineFiles({ uploadedFiles, connectedWidgets }: CombineFilesProps) {
    const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
    const [isCombining, setIsCombining] = useState(false);
    const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleFileSelection = (fileId: number) => {
        const file = uploadedFiles.find(f => f.id === fileId);
        if (!file) return;

        setSelectedFiles(prev => {
            const isSelected = prev.some(f => f.id === fileId);
            if (isSelected) {
                return prev.filter(f => f.id !== fileId);
            } else {
                return [...prev, file];
            }
        });

        // Clear preview data when file selection changes
        if (previewData) {
            setPreviewData(null);
            setShowPreview(false);
        }
    };

    const generateAIPreview = async () => {
        if (selectedFiles.length < 2) {
            setToastMessage({ type: 'error', message: 'Please select at least 2 files to combine' });
            return;
        }

        setIsGeneratingPreview(true);
        try {
            const response = await fetch('/combine-files/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    selectedFiles: selectedFiles.map(f => f.id),
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setPreviewData(result.preview);
                setShowPreview(true);
                setToastMessage({ type: 'success', message: 'AI preview generated successfully' });
            } else {
                setToastMessage({ type: 'error', message: result.error || 'Error generating preview' });
            }
        } catch (error) {
            console.error('Network error:', error);
            setToastMessage({ type: 'error', message: 'Network error occurred' });
        } finally {
            setIsGeneratingPreview(false);
        }
    };

    const regenerateAIInsights = async () => {
        if (!previewData) return;

        setIsRegenerating(true);
        try {
            const response = await fetch('/combine-files/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    selectedFiles: selectedFiles.map(f => f.id),
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setPreviewData(result.preview);
                setToastMessage({ type: 'success', message: 'AI insights regenerated successfully' });
            } else {
                setToastMessage({ type: 'error', message: result.error || 'Error regenerating insights' });
            }
        } catch (error) {
            console.error('Network error during regeneration:', error);
            setToastMessage({ type: 'error', message: 'Network error occurred' });
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleCombineFiles = async () => {
        if (selectedFiles.length < 2) {
            setToastMessage({ type: 'error', message: 'Please select at least 2 files to combine' });
            return;
        }

        setIsCombining(true);

        try {
            const response = await fetch('/combine-files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    selectedFiles: selectedFiles.map(f => f.id),
                    aiInsights: previewData?.aiInsights,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setToastMessage({
                    type: 'success',
                    message: `Files combined successfully! New AI-optimized file created with ${previewData?.newColumnsCreated?.length || 0} new columns.`
                });
                setSelectedFiles([]);
                setPreviewData(null);
                setShowPreview(false);

                // Refresh the page to show the new combined file
                router.reload();
            } else {
                console.error('Combine files error:', result);
                setToastMessage({ type: 'error', message: result.error || 'Error combining files' });
            }
        } catch (error) {
            console.error('Network error during file combination:', error);
            setToastMessage({ type: 'error', message: 'Network error occurred while combining files' });
        } finally {
            setIsCombining(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
            case 'processing':
                return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Processing</Badge>;
            case 'error':
                return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'xlsx':
            case 'xls':
                return <FileText className="h-5 w-5 text-green-600" />;
            case 'csv':
                return <FileText className="h-5 w-5 text-blue-600" />;
            default:
                return <FileText className="h-5 w-5 text-gray-600" />;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const isFileConnected = (fileId: number) => {
        return connectedWidgets.some(widget => widget.uploaded_file_id === fileId);
    };

    const completedFiles = uploadedFiles.filter(file => file.status === 'completed');

    return (
        <DashboardLayout
            title="Combine Files"
            description="AI-powered file combination with intelligent insights and preview"
        >
            <Head title="Combine Files" />

            <div className="space-y-6">

                {/* Toast Message */}
                {toastMessage && (
                    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm ${
                        toastMessage.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {toastMessage.type === 'success' ? (
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 mr-2" />
                                )}
                                <span className="text-sm font-medium">{toastMessage.message}</span>
                            </div>
                            <button
                                onClick={() => setToastMessage(null)}
                                className="text-gray-400 hover:text-gray-600 ml-3"
                            >
                                <XCircle className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* File Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-600" />
                            Select Files to Combine
                        </CardTitle>
                        <CardDescription>
                            Choose 2 or more files to combine with AI-powered insights
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {completedFiles.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No completed files available for combining</p>
                                <Link href="/upload-files" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                                    Upload some files first
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {completedFiles.map((file) => (
                                    <Card key={file.id} className={`cursor-pointer transition-all ${
                                        selectedFiles.some(f => f.id === file.id)
                                            ? 'ring-2 ring-blue-500 bg-blue-50'
                                            : 'hover:shadow-md'
                                    }`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox
                                                    checked={selectedFiles.some(f => f.id === file.id)}
                                                    onCheckedChange={() => handleFileSelection(file.id)}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        {getFileIcon(file.original_filename)}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {file.original_filename}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {formatFileSize(file.file_size)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        {getStatusBadge(file.status)}
                                                        {isFileConnected(file.id) && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <LinkIcon className="h-3 w-3 mr-1" />
                                                                Connected
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {file.processed_data && (
                                                        <div className="mt-2 text-xs text-gray-500">
                                                            {file.processed_data.total_rows} rows • {file.processed_data.total_columns} columns
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Intelligent File Combination */}
                {selectedFiles.length >= 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                                Intelligent File Combination
                            </CardTitle>
                            <CardDescription>
                                AI-powered analysis and intelligent combination of selected files
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Initial State - AI Intelligence Ready */}
                            {!showPreview && (
                                <div className="space-y-6">
                                    {/* AI Intelligence Ready */}
                                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                                        <div className="flex items-center mb-4">
                                            <Brain className="h-6 w-6 text-purple-600 mr-3" />
                                            <h4 className="text-lg font-semibold text-purple-900">AI Intelligence Ready</h4>
                                        </div>
                                        <div className="text-sm text-purple-800 space-y-2">
                                            <p>• AI will analyze file relationships and find meaningful connections</p>
                                            <p>• Create new columns with derived insights and metrics</p>
                                            <p>• Remove empty columns and optimize data structure</p>
                                            <p>• Generate business-relevant insights from combined data</p>
                                        </div>
                                    </div>

                                    {/* Combination Summary */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h5 className="font-medium text-gray-900 mb-3">Combination Summary</h5>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Files Selected:</span>
                                                <span className="ml-2 font-medium">{selectedFiles.length}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Total Rows:</span>
                                                <span className="ml-2 font-medium">
                                                    {selectedFiles.reduce((total, file) => total + (file.processed_data?.total_rows || 0), 0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={generateAIPreview}
                                            disabled={isGeneratingPreview}
                                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                                        >
                                            {isGeneratingPreview ? (
                                                <>
                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    Analyzing Files...
                                                </>
                                            ) : (
                                                <>
                                                    <Brain className="h-4 w-4 mr-2" />
                                                    Preview Files Combination
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={handleCombineFiles}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            Combine Files Now
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Preview Results State */}
                            {showPreview && (
                                previewData && (
                                    <div className="space-y-6">
                                        {/* File Summary */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <FileText className="h-4 w-4 text-blue-600 mr-2" />
                                                    <span className="font-medium text-blue-900">Files Selected</span>
                                                </div>
                                                <p className="text-2xl font-bold text-blue-700">{selectedFiles.length}</p>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                                                    <span className="font-medium text-green-900">Estimated Rows</span>
                                                </div>
                                                <p className="text-2xl font-bold text-green-700">{previewData.estimatedRows.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-purple-50 p-4 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <Settings className="h-4 w-4 text-purple-600 mr-2" />
                                                    <span className="font-medium text-purple-900">Estimated Columns</span>
                                                </div>
                                                <p className="text-2xl font-bold text-purple-700">{previewData.estimatedColumns}</p>
                                            </div>
                                        </div>

                                        {/* AI Insights */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-gray-900 flex items-center">
                                                    <Brain className="h-4 w-4 mr-2 text-purple-600" />
                                                    AI Analysis Results
                                                </h4>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={regenerateAIInsights}
                                                    disabled={isRegenerating}
                                                >
                                                    <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                                                    Regenerate
                                                </Button>
                                            </div>

                                            {/* Data Insights */}
                                            {previewData.aiInsights.data_insights && (
                                                <div className="bg-green-50 p-4 rounded-lg">
                                                    <div className="flex items-center mb-2">
                                                        <Lightbulb className="h-4 w-4 text-green-600 mr-2" />
                                                        <span className="font-medium text-green-900">Data Insights</span>
                                                    </div>
                                                    <ul className="text-sm text-green-800 space-y-1">
                                                        {previewData.aiInsights.data_insights.map((insight, index) => (
                                                            <li key={index} className="flex items-start">
                                                                <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-600" />
                                                                {insight}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Key Discoveries */}
                                            {previewData.aiInsights.key_discoveries && (
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <div className="flex items-center mb-2">
                                                        <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                                                        <span className="font-medium text-blue-900">Key Discoveries</span>
                                                    </div>
                                                    <ul className="text-sm text-blue-800 space-y-1">
                                                        {previewData.aiInsights.key_discoveries.map((discovery, index) => (
                                                            <li key={index} className="flex items-start">
                                                                <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-blue-600" />
                                                                {discovery}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Business Opportunities */}
                                            {previewData.aiInsights.business_opportunities && (
                                                <div className="bg-purple-50 p-4 rounded-lg">
                                                    <div className="flex items-center mb-2">
                                                        <Settings className="h-4 w-4 text-purple-600 mr-2" />
                                                        <span className="font-medium text-purple-900">Business Opportunities</span>
                                                    </div>
                                                    <ul className="text-sm text-purple-800 space-y-1">
                                                        {previewData.aiInsights.business_opportunities.map((opportunity, index) => (
                                                            <li key={index} className="flex items-start">
                                                                <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-purple-600" />
                                                                {opportunity}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Data Quality Insights */}
                                            {previewData.aiInsights.data_quality_insights && (
                                                <div className="bg-orange-50 p-4 rounded-lg">
                                                    <div className="flex items-center mb-2">
                                                        <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                                                        <span className="font-medium text-orange-900">Data Quality Insights</span>
                                                    </div>
                                                    <ul className="text-sm text-orange-800 space-y-1">
                                                        {previewData.aiInsights.data_quality_insights.map((insight, index) => (
                                                            <li key={index} className="flex items-start">
                                                                <Info className="h-3 w-3 mr-2 mt-0.5 text-orange-600" />
                                                                {insight}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Analytics Recommendations */}
                                            {previewData.aiInsights.analytics_recommendations && (
                                                <div className="bg-indigo-50 p-4 rounded-lg">
                                                    <div className="flex items-center mb-2">
                                                        <Brain className="h-4 w-4 text-indigo-600 mr-2" />
                                                        <span className="font-medium text-indigo-900">Analytics Recommendations</span>
                                                    </div>
                                                    <ul className="text-sm text-indigo-800 space-y-1">
                                                        {previewData.aiInsights.analytics_recommendations.map((recommendation, index) => (
                                                            <li key={index} className="flex items-start">
                                                                <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-indigo-600" />
                                                                {recommendation}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* New Columns Created */}
                                            {previewData.newColumnsCreated && previewData.newColumnsCreated.length > 0 && (
                                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                                    <div className="flex items-center mb-2">
                                                        <Plus className="h-4 w-4 text-yellow-600 mr-2" />
                                                        <span className="font-medium text-yellow-900">New Columns Created</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {previewData.newColumnsCreated.map((column, index) => (
                                                            <div key={index} className="text-sm text-yellow-800">
                                                                <div className="font-medium">{column.name}</div>
                                                                <div className="text-xs opacity-75">{column.description}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Optimizations Made */}
                                            {previewData.optimizationsMade && previewData.optimizationsMade.length > 0 && (
                                                <div className="bg-teal-50 p-4 rounded-lg">
                                                    <div className="flex items-center mb-2">
                                                        <Settings className="h-4 w-4 text-teal-600 mr-2" />
                                                        <span className="font-medium text-teal-900">Optimizations Applied</span>
                                                    </div>
                                                    <ul className="text-sm text-teal-800 space-y-1">
                                                        {previewData.optimizationsMade.map((optimization, index) => (
                                                            <li key={index} className="flex items-start">
                                                                <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-teal-600" />
                                                                {optimization}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Final Configuration */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Final File Name
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter final file name"
                                                    value={previewData?.combinedFileName || ''}
                                                    onChange={(e) => setPreviewData(prev => prev ? { ...prev, combinedFileName: e.target.value } : null)}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-md border border-indigo-200">
                                                <h4 className="font-medium text-indigo-900 mb-2 flex items-center">
                                                    <Lightbulb className="h-4 w-4 mr-2" />
                                                    Intelligent Combination Features:
                                                </h4>
                                                <ul className="text-sm text-indigo-800 space-y-1">
                                                    <li>• AI-optimized column structure</li>
                                                    <li>• New relationship-based columns</li>
                                                    <li>• Removed empty and redundant data</li>
                                                    <li>• Enhanced data quality and consistency</li>
                                                    <li>• Business-ready analytics dataset</li>
                                                </ul>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setPreviewData(null);
                                                        setShowPreview(false);
                                                    }}
                                                    className="flex-1"
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Start Over
                                                </Button>

                                                <Button
                                                    onClick={handleCombineFiles}
                                                    disabled={isCombining || !previewData?.combinedFileName.trim()}
                                                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                                >
                                                    {isCombining ? (
                                                        <>
                                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                            Generating Combined File...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="h-4 w-4 mr-2" />
                                                            Generate Combined File
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Connected Widgets */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dashboard Widgets</CardTitle>
                        <CardDescription>
                            Currently connected widgets and their data sources
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {connectedWidgets.length === 0 ? (
                            <div className="text-center py-8">
                                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No widgets currently connected to dashboard</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {connectedWidgets.map((widget) => (
                                    <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                {widget.widget_type === 'kpi' && <FileText className="h-4 w-4 text-blue-600" />}
                                                {widget.widget_type === 'bar_chart' && <FileText className="h-4 w-4 text-green-600" />}
                                                {widget.widget_type === 'pie_chart' && <FileText className="h-4 w-4 text-purple-600" />}
                                                {widget.widget_type === 'table' && <FileText className="h-4 w-4 text-orange-600" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{widget.widget_name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {widget.uploaded_file ? (
                                                        <span className="flex items-center">
                                                            <LinkIcon className="h-3 w-3 mr-1 text-green-600" />
                                                            {widget.uploaded_file.original_filename}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">No file connected</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={widget.is_active ? "default" : "secondary"}>
                                            {widget.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
