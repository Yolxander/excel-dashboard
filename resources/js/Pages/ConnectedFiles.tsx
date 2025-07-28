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
    BrainCircuit
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
    created_at: string;
    updated_at: string;
}

interface DashboardWidget {
    id: number;
    widget_type: string;
    widget_name: string;
    widget_config?: any;
    uploaded_file_id?: number;
    is_active: boolean;
    display_order: number;
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
    const [toastMessage, setToastMessage] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);

    const connectFile = async (fileId: number) => {
        setConnectingFile(fileId);
        try {
            const response = await fetch(`/connected-files/${fileId}/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();

            if (result.success) {
                setToastMessage({ type: 'success', message: result.message });
                // Refresh the page to show updated data
                router.reload();
            } else {
                setToastMessage({ type: 'error', message: result.error || 'Failed to connect file' });
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
            const response = await fetch(`/connected-files/${fileId}/disconnect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();

            if (result.success) {
                setToastMessage({ type: 'success', message: result.message });
                // Refresh the page to show updated data
                router.reload();
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
                    message: 'AI analysis completed successfully! Check the dashboard for enhanced insights.'
                });
                // Redirect to dashboard to see the AI insights
                setTimeout(() => {
                    window.location.href = '/';
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
        return dashboardWidgets.some(widget => widget.uploaded_file_id === fileId && widget.is_active);
    };

    return (
        <>
            <Head title="Connected Files" />

            <DashboardLayout
                title="Connected Files"
                description="Manage your uploaded files and their dashboard connections"
            >
                {/* Toast Notification */}
                {toastMessage && (
                    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-sm ${
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
                                <p className="text-sm font-medium">{toastMessage.message}</p>
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
                                        <Card key={file.id} className="relative">
                                            <CardHeader className="pb-3">
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
                                                    {getStatusBadge(file.status)}
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(file.created_at).toLocaleDateString()}
                                                    </span>
                                        </div>
                                            </CardHeader>
                                            <CardContent className="pt-0">
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
                                                                    disabled={connectingFile === file.id}
                                                                    className="flex-1"
                                                                >
                                                                    {connectingFile === file.id ? (
                                                                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                                                                    ) : (
                                                                        <LinkIcon className="h-4 w-4 mr-2" />
                                                                    )}
                                                                    Connect
                                            </Button>
                                                            )}
                                                        </>
                                                    )}
                                                                                                                                    <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => analyzeFileWithAI(file.id)}
                                                disabled={analyzingFile === file.id}
                                                title="Analyze with AI"
                                            >
                                                {analyzingFile === file.id ? (
                                                    <Clock className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <BrainCircuit className="h-4 w-4" />
                                                )}
                                            </Button>
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
                                                    {widget.is_active ? (
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
            </>
        );
    }
