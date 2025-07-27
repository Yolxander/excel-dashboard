import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Plus, Play, Pause, RefreshCw, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function SyncSchedule() {
    return (
        <>
            <Head title="Sync Schedule - Excel Dashboard" />

            <DashboardLayout
                title="Sync Schedule"
                description="Manage automated data synchronization"
            >
                <div className="flex justify-end mb-6">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Job
                    </Button>
                </div>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Sales Data Sync</CardTitle>
                                            <CardDescription>Sync sales data from PostgreSQL database</CardDescription>
                                        </div>
                                        <Badge variant="default">Active</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Frequency</p>
                                            <p className="text-sm">Daily</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Next Run</p>
                                            <p className="text-sm">Tomorrow 2:00 AM</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Last Run</p>
                                            <p className="text-sm">Today 2:00 AM</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm">
                                                <Play className="h-4 w-4 mr-2" />
                                                Run Now
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Pause className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>API Data Refresh</CardTitle>
                                            <CardDescription>Refresh data from Sales API</CardDescription>
                                        </div>
                                        <Badge variant="default">Active</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Frequency</p>
                                            <p className="text-sm">Hourly</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Next Run</p>
                                            <p className="text-sm">In 15 minutes</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Last Run</p>
                                            <p className="text-sm">45 minutes ago</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm">
                                                <Play className="h-4 w-4 mr-2" />
                                                Run Now
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Pause className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Weekly Report Sync</CardTitle>
                                            <CardDescription>Generate weekly performance reports</CardDescription>
                                        </div>
                                        <Badge variant="secondary">Paused</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Frequency</p>
                                            <p className="text-sm">Weekly</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Next Run</p>
                                            <p className="text-sm">Paused</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Last Run</p>
                                            <p className="text-sm">1 week ago</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm">
                                                <Play className="h-4 w-4 mr-2" />
                                                Resume
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Play className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Marketing Data Sync</CardTitle>
                                            <CardDescription>Sync marketing campaign data</CardDescription>
                                        </div>
                                        <Badge variant="default">Active</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Frequency</p>
                                            <p className="text-sm">Every 6 hours</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Next Run</p>
                                            <p className="text-sm">In 3 hours</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Last Run</p>
                                            <p className="text-sm">3 hours ago</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm">
                                                <Play className="h-4 w-4 mr-2" />
                                                Run Now
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Pause className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Monthly Analytics Sync</CardTitle>
                                            <CardDescription>Generate monthly analytics reports</CardDescription>
                                        </div>
                                        <Badge variant="secondary">Error</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Frequency</p>
                                            <p className="text-sm">Monthly</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Next Run</p>
                                            <p className="text-sm text-red-600">Failed</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Last Run</p>
                                            <p className="text-sm">Failed 2 days ago</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm">
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Retry
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <AlertCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Job Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Statistics</CardTitle>
                                <CardDescription>Overview of sync job performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">5</div>
                                        <div className="text-sm text-gray-600">Total Jobs</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">3</div>
                                        <div className="text-sm text-gray-600">Active</div>
                                    </div>
                                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-600">1</div>
                                        <div className="text-sm text-gray-600">Paused</div>
                                    </div>
                                    <div className="text-center p-4 bg-red-50 rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">1</div>
                                        <div className="text-sm text-gray-600">Error</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest sync job executions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <div>
                                                <p className="text-sm font-medium">Sales Data Sync</p>
                                                <p className="text-xs text-gray-600">Completed successfully</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-600">2 hours ago</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <div>
                                                <p className="text-sm font-medium">API Data Refresh</p>
                                                <p className="text-xs text-gray-600">Completed successfully</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-600">45 minutes ago</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                            <div>
                                                <p className="text-sm font-medium">Monthly Analytics Sync</p>
                                                <p className="text-xs text-gray-600">Failed - Connection timeout</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-600">2 days ago</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <div>
                                                <p className="text-sm font-medium">Marketing Data Sync</p>
                                                <p className="text-xs text-gray-600">Completed successfully</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-600">3 hours ago</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common sync operations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                                        <Plus className="h-6 w-6 mb-2" />
                                        <span>Create New Job</span>
                                    </Button>
                                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                                        <RefreshCw className="h-6 w-6 mb-2" />
                                        <span>Run All Jobs</span>
                                    </Button>
                                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                                        <Calendar className="h-6 w-6 mb-2" />
                                        <span>Schedule Settings</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DashboardLayout>
            </>
        );
    }
