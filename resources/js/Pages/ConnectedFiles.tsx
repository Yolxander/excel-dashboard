import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    FileText,
    Database,
    Link as LinkIcon,
    Unlink,
    Upload,
    BarChart3,
    PieChart,
    TrendingUp,
    Users,
    Activity,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    Settings,
    Plus,
    Trash2,
    Eye,
    Download,
    BrainCircuit,
    Sparkles,
    Info
} from 'lucide-react';
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

interface DashboardWidget {
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

interface ConnectedFilesProps {
    uploadedFiles: UploadedFile[];
    dashboardWidgets: DashboardWidget[];

}

export default function ConnectedFiles({ uploadedFiles, dashboardWidgets }: ConnectedFilesProps) {
    const [connectingFile, setConnectingFile] = React.useState<number | null>(null);
    const [disconnectingFile, setDisconnectingFile] = React.useState<number | null>(null);
    const [analyzingFile, setAnalyzingFile] = React.useState<number | null>(null);
    const [toastMessage, setToastMessage] = React.useState<{ type: 'success' | 'error', message: string, showDashboardLink?: boolean } | null>(null);
    const [selectedFileForInsights, setSelectedFileForInsights] = React.useState<UploadedFile | null>(null);
    const [showInsightsModal, setShowInsightsModal] = React.useState(false);
    const [connectedFileIds, setConnectedFileIds] = React.useState<Set<number>>(
        new Set(dashboardWidgets.filter(w => w.is_displayed).map(w => w.uploaded_file_id))
    );

            const connectFile = async (fileId: number) => {
        setConnectingFile(fileId);
        try {
            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }

            // First, connect the file
            const connectResponse = await fetch(`/connected-files/${fileId}/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
            });

                        if (!connectResponse.ok) {
                const errorText = await connectResponse.text();
                throw new Error(`HTTP ${connectResponse.status}: ${errorText}`);
            }

            const connectResult = await connectResponse.json();

            if (connectResult.success) {
                // Update the connected files state
                setConnectedFileIds(prev => new Set([...prev, fileId]));

                // Check if the file already has AI insights
                const file = uploadedFiles.find(f => f.id === fileId);
                const hasInsights = file && file.ai_insights;

                if (hasInsights) {
                    // File already has insights, just connect it
                    setToastMessage({
                        type: 'success',
                        message: 'File connected successfully! AI insights are already available on the dashboard.',
                        showDashboardLink: true
                    });
                } else {
                    // File doesn't have insights, generate them
                    setToastMessage({
                        type: 'success',
                        message: 'File connected successfully! Now generating AI insights...',
                        showDashboardLink: true
                    });

                    // Then trigger AI analysis
                    setAnalyzingFile(fileId);
                    try {
                        const aiResponse = await fetch(`/ai/analyze-file/${fileId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                            },
                        });

                        const aiData = await aiResponse.json();

                        if (aiData.success) {
                            setToastMessage({
                                type: 'success',
                                message: 'File connected and AI analysis completed! Enhanced widgets and charts are now available on the dashboard.',
                                showDashboardLink: true
                            });
                        } else {
                            setToastMessage({
                                type: 'error',
                                message: `File connected but AI analysis failed: ${aiData.message || 'Unknown error'}`
                            });
                        }
                    } catch (aiError) {
                        setToastMessage({
                            type: 'error',
                            message: 'File connected but AI analysis failed due to network error'
                        });
                    } finally {
                        setAnalyzingFile(null);
                    }
                }
            } else {
                setToastMessage({ type: 'error', message: connectResult.error || 'Failed to connect file' });
            }
        } catch (error) {
            setToastMessage({ type: 'error', message: 'Failed to connect file' });
        } finally {
            setConnectingFile(null);
        }
    };

    const disconnectFile = async (fileId: number) => {
        setDisconnectingFile(fileId);
        try {
            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }

            const response = await fetch(`/connected-files/${fileId}/disconnect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
            });

                        if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();

            if (result.success) {
                // Update the connected files state
                setConnectedFileIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(fileId);
                    return newSet;
                });

                setToastMessage({
                    type: 'success',
                    message: result.message,
                    showDashboardLink: true
                });
            } else {
                setToastMessage({ type: 'error', message: result.error || 'Failed to disconnect file' });
            }
        } catch (error) {
            setToastMessage({ type: 'error', message: 'Failed to disconnect file' });
        } finally {
            setDisconnectingFile(null);
        }
    };

    const analyzeFileWithAI = async (fileId: number) => {
        setAnalyzingFile(fileId);
        try {
            const response = await fetch(`/ai/analyze-file/${fileId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

                        if (data.success) {
                setToastMessage({
                    type: 'success',
                    message: 'AI analysis completed successfully! Enhanced widgets and charts are now available on the dashboard.'
                });
                // Redirect to dashboard to see the AI insights
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            } else {
                setToastMessage({ type: 'error', message: data.message || 'AI analysis failed' });
            }
        } catch (error) {
            setToastMessage({ type: 'error', message: 'Network error during AI analysis' });
        } finally {
            setAnalyzingFile(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
            case 'processing':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Processing</Badge>;
            case 'failed':
                return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getFileIcon = (fileType: string) => {
        switch (fileType.toLowerCase()) {
            case 'xlsx':
            case 'xls':
                return <FileText className="h-5 w-5 text-green-600" />;
            case 'csv':
                return <FileText className="h-5 w-5 text-blue-600" />;
            default:
                return <FileText className="h-5 w-5 text-gray-600" />;
        }
    };

    const getWidgetIcon = (widgetType: string) => {
        switch (widgetType) {
            case 'kpi':
                return <TrendingUp className="h-4 w-4" />;
            case 'bar_chart':
                return <BarChart3 className="h-4 w-4" />;
            case 'pie_chart':
                return <PieChart className="h-4 w-4" />;
            case 'table':
                return <Database className="h-4 w-4" />;
            default:
                return <Settings className="h-4 w-4" />;
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

    const isFileConnected = (fileId: number) => {
        return connectedFileIds.has(fileId);
    };

    return (
        <>
            <Head title="Connected Files" />

            <DashboardLayout
                title="File Management"
                description="Upload, connect, and analyze your Excel files with AI insights"
                showEditButton={true}
            >
                {/* Toast Notification */}
                {toastMessage && (
                    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-sm ${
                        toastMessage.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {toastMessage.type === 'success' ? (
                                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                                )}
                                <div>
                                    <p className="text-sm font-medium">{toastMessage.message}</p>
                                    {toastMessage.showDashboardLink && (
                                        <Link href="/dashboard" className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 inline-block">
                                            See Dashboard →
                                        </Link>
                                    )}
                                </div>
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

                    <div className="space-y-6">
                    {/* Uploaded Files Section */}
                            <Card>
                                <CardHeader>
                            <CardTitle className="flex items-center">
                                <Database className="h-5 w-5 mr-2" />
                                Uploaded Files
                            </CardTitle>
                            <CardDescription>
                                Manage your Excel files and connect them to dashboard widgets
                            </CardDescription>
                                </CardHeader>
                                <CardContent>
                            {uploadedFiles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                        {uploadedFiles.map((file) => (
                                        <Card key={file.id} className="relative min-h-[200px] flex flex-col">
                                            <CardHeader className="pb-4 flex-shrink-0">
                                        <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        {getFileIcon(file.file_type)}
                                                        <div>
                                                            <CardTitle className="text-sm">{file.original_filename}</CardTitle>
                                                            <CardDescription className="text-xs">
                                                                {formatFileSize(file.file_size)} • {file.file_type.toUpperCase()}
                                                            </CardDescription>
                                                        </div>
                                        </div>
                                                    {isFileConnected(file.id) && (
                                                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                                                            <LinkIcon className="h-3 w-3 mr-1" />
                                                            Connected
                                                        </Badge>
                                                    )}
                                        </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusBadge(file.status)}
                                                        {file.ai_insights && (
                                                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                                                <Sparkles className="h-3 w-3 mr-1" />
                                                                AI Analyzed
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(file.created_at).toLocaleDateString()}
                                                    </span>
                                        </div>
                                            </CardHeader>
                                            <div className="flex-1"></div>
                                            <CardContent className="pt-0 pb-2 mt-auto">
                                                <div className="flex space-x-2">
                                                    {file.status === 'completed' && (
                                                        <>
                                                            {isFileConnected(file.id) ? (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => disconnectFile(file.id)}
                                                                    disabled={disconnectingFile === file.id}
                                                                    className="flex-1"
                                                                >
                                                                    {disconnectingFile === file.id ? (
                                                                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                                                                    ) : (
                                                                        <Unlink className="h-4 w-4 mr-2" />
                                                                    )}
                                                                    Disconnect
                                            </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    onClick={() => connectFile(file.id)}
                                                                    disabled={connectingFile === file.id || analyzingFile === file.id}
                                                                    className="flex-1"
                                                                >
                                                                    {connectingFile === file.id ? (
                                                                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                                                                    ) : analyzingFile === file.id ? (
                                                                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                                                                    ) : (
                                                                        <LinkIcon className="h-4 w-4 mr-2" />
                                                                    )}
                                                                    {connectingFile === file.id ? 'Connecting...' : analyzingFile === file.id ? 'Analyzing...' : file.ai_insights ? 'Connect' : 'Connect & Analyze'}
                                            </Button>
                                                            )}
                                                        </>
                                                    )}
                                                                                                                                    <Button
                                                variant={file.ai_insights ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => analyzeFileWithAI(file.id)}
                                                disabled={analyzingFile === file.id}
                                                title={file.ai_insights ? "Re-analyze with AI" : "Analyze with AI"}
                                                className={file.ai_insights ? "bg-purple-600 hover:bg-purple-700" : ""}
                                            >
                                                {analyzingFile === file.id ? (
                                                    <Clock className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Sparkles className="h-4 w-4" />
                                                )}
                                            </Button>

                                            {file.ai_insights && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedFileForInsights(file);
                                                        setShowInsightsModal(true);
                                                    }}
                                                    title="View AI Insights"
                                                >
                                                    <Info className="h-4 w-4" />
                                                </Button>
                                            )}
                                    </div>
                                </CardContent>
                            </Card>
                                    ))}
                                        </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No files uploaded yet</p>
                                    <p className="text-sm text-gray-400 mb-4">Upload Excel files to get started</p>
                                    <Link href="/upload-files">
                                        <Button>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Files
                                            </Button>
                                    </Link>
                                        </div>
                            )}
                                </CardContent>
                            </Card>

                    {/* Dashboard Widgets Section */}
                            <Card>
                                <CardHeader>
                            <CardTitle className="flex items-center">
                                <Settings className="h-5 w-5 mr-2" />
                                Dashboard Widgets
                            </CardTitle>
                            <CardDescription>
                                Track which widgets are connected to which files
                            </CardDescription>
                                </CardHeader>
                                <CardContent>
                            {dashboardWidgets.filter(widget => !widget.widget_name.includes('Combined Data')).length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Widget</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Connected File</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Order</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dashboardWidgets
                                            .filter(widget => !widget.widget_name.includes('Combined Data'))
                                            .map((widget) => (
                                            <TableRow key={widget.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        {getWidgetIcon(widget.widget_type)}
                                                        <span>{widget.widget_name}</span>
                                        </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">
                                                        {widget.widget_type.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {widget.uploaded_file ? (
                                                        <div className="flex items-center space-x-2">
                                                            {getFileIcon(widget.uploaded_file.file_type)}
                                                            <span className="text-sm">{widget.uploaded_file.original_filename}</span>
                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No file connected</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {widget.is_displayed ? (
                                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-gray-500">{widget.display_order}</span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-8">
                                    <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No widgets configured</p>
                                    <p className="text-sm text-gray-400">Connect a file to create dashboard widgets</p>
                                        </div>
                            )}
                                </CardContent>
                            </Card>


                    </div>
                </DashboardLayout>

                {/* AI Insights Modal */}
                {showInsightsModal && selectedFileForInsights && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h2>
                                        <p className="text-gray-600">Intelligent analysis of your data using AI/ML</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowInsightsModal(false)}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {/* Data Analysis Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Analysis</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedFileForInsights.ai_insights?.widget_insights &&
                                                Object.entries(selectedFileForInsights.ai_insights.widget_insights).map(([key, insight]: [string, any]) => (
                                                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-medium text-gray-900">
                                                                {insight.widget_name || key.replace(/_/g, ' ')}
                                                            </h4>
                                                            <span className="text-2xl font-bold text-blue-600">
                                                                {insight.value}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600">
                                                            {insight.description}
                                                        </p>
                                                        {insight.source_column && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Source: {insight.source_column}
                                                            </p>
                                                        )}
                                                        {insight.widget_type && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Type: {insight.widget_type.replace('_', ' ')}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>

                                    {/* Widget Recommendations Section */}
                                    {selectedFileForInsights.ai_insights?.widget_recommendations && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Widget Recommendations</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedFileForInsights.ai_insights.widget_recommendations.map((recommendation: any, index: number) => (
                                                    <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-medium text-green-900">
                                                                {recommendation.widget_name}
                                                            </h4>
                                                            <Badge variant="outline" className="text-xs">
                                                                {recommendation.widget_type.replace('_', ' ')}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-green-800 mb-2">
                                                            {recommendation.description}
                                                        </p>
                                                        {recommendation.source_columns && (
                                                            <p className="text-xs text-green-600">
                                                                Source: {recommendation.source_columns.join(', ')}
                                                            </p>
                                                        )}
                                                        {recommendation.calculation_method && (
                                                            <p className="text-xs text-green-600 mt-1">
                                                                Method: {recommendation.calculation_method}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-green-500 mt-2">
                                                            Priority: {recommendation.priority || 'N/A'}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* AI Recommendations Section */}
                                    {selectedFileForInsights.ai_insights?.data_insights && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <p className="text-sm text-blue-800 mb-2">
                                                    {selectedFileForInsights.ai_insights.data_insights}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Chart Recommendations */}
                                    {selectedFileForInsights.ai_insights?.chart_recommendations && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Analysis</h3>
                                            <div className="space-y-4">
                                                {Object.entries(selectedFileForInsights.ai_insights.chart_recommendations).map(([chartType, config]: [string, any]) => (
                                                    <div key={chartType} className="bg-gray-50 rounded-lg p-4">
                                                        <h4 className="font-medium text-gray-900 mb-2 capitalize">
                                                            {chartType.replace(/_/g, ' ')} Analysis
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {config.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {config.description}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
