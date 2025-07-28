import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
    Eye
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

interface CombineFilesProps {
    uploadedFiles: UploadedFile[];
    connectedWidgets: DashboardWidget[];
}

export default function CombineFiles({ uploadedFiles, connectedWidgets }: CombineFilesProps) {
    const [selectedFiles, setSelectedFiles] = React.useState<number[]>([]);
    const [combinedFileName, setCombinedFileName] = React.useState('');
    const [isCombining, setIsCombining] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);



    const handleFileSelection = (fileId: number) => {
        setSelectedFiles(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    };

    const handleCombineFiles = async () => {
        if (selectedFiles.length < 2) {
            setToastMessage({ type: 'error', message: 'Please select at least 2 files to combine' });
            return;
        }

        if (!combinedFileName.trim()) {
            setToastMessage({ type: 'error', message: 'Please enter a name for the combined file' });
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
                    selectedFiles,
                    combinedFileName: combinedFileName.trim(),
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setToastMessage({ type: 'success', message: result.message });
                setSelectedFiles([]);
                setCombinedFileName('');
                // Reload the page to show the new combined file
                window.location.reload();
            } else {
                setToastMessage({ type: 'error', message: result.error || 'Error combining files' });
            }
        } catch (error) {
            setToastMessage({ type: 'error', message: 'Network error occurred' });
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
            description="Select multiple Excel files to combine them into a single dataset"
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
                        <CardTitle>Select Files to Combine</CardTitle>
                        <CardDescription>
                            Choose 2 or more completed files to combine into a single dataset
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
                                        selectedFiles.includes(file.id)
                                            ? 'ring-2 ring-blue-500 bg-blue-50'
                                            : 'hover:shadow-md'
                                    }`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox
                                                    checked={selectedFiles.includes(file.id)}
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

                {/* Combine Configuration */}
                {selectedFiles.length >= 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Combine Configuration</CardTitle>
                            <CardDescription>
                                Configure the combined file settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Combined File Name
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Enter combined file name (e.g., Combined_Data_2024)"
                                    value={combinedFileName}
                                    onChange={(e) => setCombinedFileName(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            <div className="bg-blue-50 p-4 rounded-md">
                                <h4 className="font-medium text-blue-900 mb-2">What will be combined:</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• All data from {selectedFiles.length} selected files</li>
                                    <li>• A "Source File" column will be added to track the origin</li>
                                    <li>• Combined file will be automatically connected to dashboard</li>
                                    <li>• New dashboard widgets will be created for the combined data</li>
                                </ul>
                            </div>

                            <Button
                                onClick={handleCombineFiles}
                                disabled={isCombining || !combinedFileName.trim()}
                                className="w-full"
                            >
                                {isCombining ? (
                                    <>
                                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                                        Combining Files...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Combine Files
                                    </>
                                )}
                            </Button>
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
