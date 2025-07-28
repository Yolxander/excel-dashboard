import React, { useState, useRef } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Plus, MoreHorizontal, Trash2, Download, Eye, RefreshCw } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

interface UploadedFile {
    id: number;
    original_filename: string;
    file_type: string;
    file_size: number;
    status: 'processing' | 'completed' | 'failed';
    processed_data?: {
        headers: string[];
        data: any[];
        total_rows: number;
        total_columns: number;
    };
    error_message?: string;
    created_at: string;
    formatted_file_size?: string;
}

interface UploadFilesProps {
    uploadedFiles: UploadedFile[];
    success?: string;
    error?: string;
}

export default function UploadFiles({ uploadedFiles, success, error }: UploadFilesProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Debug: Log when component mounts
    React.useEffect(() => {
        console.log('UploadFiles component mounted');
        console.log('fileInputRef:', fileInputRef.current);
    }, []);

    // Show success/error messages
    React.useEffect(() => {
        if (success) {
            setUploadMessage(success);
            setTimeout(() => setUploadMessage(''), 5000);
        }
        if (error) {
            setUploadMessage(error);
            setTimeout(() => setUploadMessage(''), 5000);
        }
    }, [success, error]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('File selected:', e.target.files);
        const files = e.target.files;
        if (files && files.length > 0) {
            console.log('Uploading file:', files[0].name);
            uploadFile(files[0]);
        } else {
            console.log('No files selected');
        }
    };

    const uploadFile = async (file: File) => {
        if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
            alert('Please select a valid Excel or CSV file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
            alert('File size must be less than 10MB');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            await router.post('/upload-files', formData, {
                onSuccess: () => {
                    setUploading(false);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                },
                onError: (errors) => {
                    setUploading(false);
                    setUploadMessage('Upload failed: ' + Object.values(errors).join(', '));
                    setTimeout(() => setUploadMessage(''), 5000);
                }
            });
        } catch (error) {
            setUploading(false);
            setUploadMessage('Upload failed');
            setTimeout(() => setUploadMessage(''), 5000);
        }
    };

    const deleteFile = async (id: number) => {
        if (confirm('Are you sure you want to delete this file?')) {
            await router.delete(`/upload-files/${id}`);
        }
    };

    const refreshFiles = async () => {
        setRefreshing(true);
        await router.reload();
        setRefreshing(false);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="default">Completed</Badge>;
            case 'processing':
                return <Badge variant="secondary">Processing</Badge>;
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getFileIcon = (fileType: string) => {
        switch (fileType.toLowerCase()) {
            case 'xlsx':
                return <FileText className="h-8 w-8 text-green-500" />;
            case 'xls':
                return <FileText className="h-8 w-8 text-blue-500" />;
            case 'csv':
                return <FileText className="h-8 w-8 text-orange-500" />;
            default:
                return <FileText className="h-8 w-8 text-gray-500" />;
        }
    };

    return (
        <>
            <Head title="Upload Excel Files - Excel Dashboard" />

            <DashboardLayout
                title="Upload Excel Files"
                description="Upload and process your Excel files to generate dashboards"
            >
                                <div className="flex justify-between items-center mb-6">
                    <Link href="/">
                        <Button variant="outline">
                            ← Back to Dashboard
                        </Button>
                    </Link>
                    <div className="flex space-x-2">

                        <Button
                            variant="outline"
                            onClick={refreshFiles}
                            disabled={refreshing}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </Button>
                    </div>
                </div>
                <div className="space-y-6">
                    {/* Upload Message */}
                    {uploadMessage && (
                        <div className={`p-4 rounded-lg ${
                            uploadMessage.includes('successfully')
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                            {uploadMessage}
                        </div>
                    )}

                    {/* Upload Area */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Files</CardTitle>
                            <CardDescription>Drag and drop Excel files here or click to browse</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                    isDragging
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                                <p className="text-lg font-medium text-gray-900 mb-2">
                                    {uploading ? 'Uploading...' : 'Drop files here'}
                                </p>
                                <p className="text-gray-500 mb-4">Supports .xlsx, .xls, .csv files up to 10MB</p>
                                                                                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            console.log('Choose Files button clicked');
                                            console.log('fileInputRef:', fileInputRef.current);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.click();
                                            } else {
                                                console.error('File input ref is null');
                                            }
                                        }}
                                        disabled={uploading}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        {uploading ? 'Uploading...' : 'Choose Files'}
                                    </Button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />



                                    {/* Alternative method */}
                                    <div className="mt-2">
                                        <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 underline">
                                            Or click here to browse files
                                            <input
                                                type="file"
                                                accept=".xlsx,.xls,.csv"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* File List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Uploaded Files</CardTitle>
                            <CardDescription>Files that have been processed</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {uploadedFiles.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>No files uploaded yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {uploadedFiles.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                {getFileIcon(file.file_type)}
                                                <div>
                                                    <p className="font-medium">{file.original_filename}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : 'Unknown size'} •
                                                        Uploaded {new Date(file.created_at).toLocaleDateString()}
                                                        {file.processed_data && (
                                                            <span> • {file.processed_data.total_rows} rows, {file.processed_data.total_columns} columns</span>
                                                        )}
                                                    </p>
                                                    {file.error_message && (
                                                        <p className="text-sm text-red-500 mt-1">{file.error_message}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getStatusBadge(file.status)}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteFile(file.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Processing Status */}
                    {uploadedFiles.some(f => f.status === 'processing') && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Processing Status</CardTitle>
                                <CardDescription>Current file processing queue</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {uploadedFiles
                                        .filter(f => f.status === 'processing')
                                        .map((file) => (
                                            <div key={file.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                    <span className="text-sm font-medium">{file.original_filename}</span>
                                                </div>
                                                <span className="text-sm text-gray-600">Processing...</span>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}
