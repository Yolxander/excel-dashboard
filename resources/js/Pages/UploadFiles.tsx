import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Plus, MoreHorizontal } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function UploadFiles() {
    return (
        <>
            <Head title="Upload Excel Files - Excel Dashboard" />

            <DashboardLayout
                title="Upload Excel Files"
                description="Upload and process your Excel files to generate dashboards"
            >
                <div className="flex justify-end mb-6">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Files
                    </Button>
                </div>
                    <div className="space-y-6">
                        {/* Upload Area */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Files</CardTitle>
                                <CardDescription>Drag and drop Excel files here or click to browse</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-lg font-medium text-gray-900 mb-2">Drop files here</p>
                                    <p className="text-gray-500 mb-4">Supports .xlsx, .xls, .csv files up to 10MB</p>
                                    <Button variant="outline">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Choose Files
                                    </Button>
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
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <FileText className="h-8 w-8 text-blue-500" />
                                            <div>
                                                <p className="font-medium">Sales_Data_Sample.xlsx</p>
                                                <p className="text-sm text-gray-500">6.3 KB • Uploaded 2 hours ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="default">Processed</Badge>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <FileText className="h-8 w-8 text-green-500" />
                                            <div>
                                                <p className="font-medium">Recruiter_Performance.csv</p>
                                                <p className="text-sm text-gray-500">245 B • Uploaded 1 day ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="default">Processed</Badge>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <FileText className="h-8 w-8 text-yellow-500" />
                                            <div>
                                                <p className="font-medium">Q4_Financial_Report.xlsx</p>
                                                <p className="text-sm text-gray-500">2.1 MB • Uploaded 3 days ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="secondary">Processing</Badge>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Processing Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Processing Status</CardTitle>
                                <CardDescription>Current file processing queue</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium">Q4_Financial_Report.xlsx</span>
                                        </div>
                                        <span className="text-sm text-gray-600">Processing... 75%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-sm font-medium">Sales_Data_Sample.xlsx</span>
                                        </div>
                                        <span className="text-sm text-gray-600">Completed</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DashboardLayout>
            </>
        );
    }
