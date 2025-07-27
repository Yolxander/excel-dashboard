import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Play, Pause, Settings, BarChart3, Table } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function ConnectedFiles() {
    return (
        <>
            <Head title="Connected Files - Excel Dashboard" />

            <DashboardLayout
                title="Connected Files"
                description="Manage your connected data sources and files"
            >
                <div className="flex justify-end mb-6">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Connect File
                    </Button>
                </div>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Sales_Data_Sample.xlsx</CardTitle>
                                            <CardDescription>6.3 KB • 3 charts • 2 tables</CardDescription>
                                        </div>
                                        <Badge variant="default">Connected</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Auto-sync</span>
                                            <Button variant="outline" size="sm">
                                                <Play className="h-4 w-4 mr-2" />
                                                Enabled
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Sync frequency</span>
                                            <select className="border rounded px-2 py-1 text-sm">
                                                <option>Daily</option>
                                                <option>Hourly</option>
                                                <option>Weekly</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Last sync</span>
                                            <span className="text-sm">2 hours ago</span>
                                        </div>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <BarChart3 className="h-4 w-4 mr-2" />
                                                View Charts
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <Table className="h-4 w-4 mr-2" />
                                                View Tables
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Recruiter_Performance.csv</CardTitle>
                                            <CardDescription>245 B • 2 charts • 1 table</CardDescription>
                                        </div>
                                        <Badge variant="default">Connected</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Auto-sync</span>
                                            <Button variant="outline" size="sm">
                                                <Pause className="h-4 w-4 mr-2" />
                                                Disabled
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Sync frequency</span>
                                            <select className="border rounded px-2 py-1 text-sm">
                                                <option>Weekly</option>
                                                <option>Daily</option>
                                                <option>Hourly</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Last sync</span>
                                            <span className="text-sm">1 day ago</span>
                                        </div>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <BarChart3 className="h-4 w-4 mr-2" />
                                                View Charts
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <Table className="h-4 w-4 mr-2" />
                                                View Tables
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Q4_Financial_Report.xlsx</CardTitle>
                                            <CardDescription>2.1 MB • 5 charts • 3 tables</CardDescription>
                                        </div>
                                        <Badge variant="secondary">Processing</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Auto-sync</span>
                                            <Button variant="outline" size="sm" disabled>
                                                <Pause className="h-4 w-4 mr-2" />
                                                Disabled
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Processing</span>
                                            <span className="text-sm text-blue-600">75% complete</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Estimated time</span>
                                            <span className="text-sm">2 minutes remaining</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Marketing_Campaign_Data.xlsx</CardTitle>
                                            <CardDescription>1.8 MB • 4 charts • 2 tables</CardDescription>
                                        </div>
                                        <Badge variant="default">Connected</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Auto-sync</span>
                                            <Button variant="outline" size="sm">
                                                <Play className="h-4 w-4 mr-2" />
                                                Enabled
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Sync frequency</span>
                                            <select className="border rounded px-2 py-1 text-sm">
                                                <option>Daily</option>
                                                <option>Hourly</option>
                                                <option>Weekly</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Last sync</span>
                                            <span className="text-sm">6 hours ago</span>
                                        </div>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <BarChart3 className="h-4 w-4 mr-2" />
                                                View Charts
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <Table className="h-4 w-4 mr-2" />
                                                View Tables
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Connection Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Connection Statistics</CardTitle>
                                <CardDescription>Overview of your connected files</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">4</div>
                                        <div className="text-sm text-gray-600">Total Files</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">3</div>
                                        <div className="text-sm text-gray-600">Connected</div>
                                    </div>
                                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-600">1</div>
                                        <div className="text-sm text-gray-600">Processing</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">14</div>
                                        <div className="text-sm text-gray-600">Total Charts</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DashboardLayout>
            </>
        );
    }
