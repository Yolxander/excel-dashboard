import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Plus, RefreshCw, CheckCircle, XCircle, AlertCircle, Settings, Key } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function DataSources() {
    return (
        <>
            <Head title="Data Sources - Excel Dashboard" />

            <DashboardLayout
                title="Data Sources"
                description="Configure external data connections"
            >
                <div className="flex justify-end mb-6">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Source
                    </Button>
                </div>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Database className="h-5 w-5 text-blue-500" />
                                            <CardTitle className="text-lg">PostgreSQL Database</CardTitle>
                                        </div>
                                        <Badge variant="default">Active</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Connected</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Host:</span>
                                            <span className="text-sm">localhost:5432</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Database:</span>
                                            <span className="text-sm">sales_db</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Last sync:</span>
                                            <span className="text-sm">2 hours ago</span>
                                        </div>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Test Connection
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
                                        <div className="flex items-center space-x-2">
                                            <Database className="h-5 w-5 text-green-500" />
                                            <CardTitle className="text-lg">Sales API</CardTitle>
                                        </div>
                                        <Badge variant="default">Active</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Connected</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Endpoint:</span>
                                            <span className="text-sm">api.sales.com</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Version:</span>
                                            <span className="text-sm">v2.1</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Last sync:</span>
                                            <span className="text-sm">45 minutes ago</span>
                                        </div>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Test Connection
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
                                        <div className="flex items-center space-x-2">
                                            <Database className="h-5 w-5 text-gray-500" />
                                            <CardTitle className="text-lg">Google Sheets</CardTitle>
                                        </div>
                                        <Badge variant="secondary">Inactive</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <XCircle className="h-4 w-4 text-red-500" />
                                            <span className="text-sm">Disconnected</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Sheet ID:</span>
                                            <span className="text-sm">1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Last sync:</span>
                                            <span className="text-sm">Never</span>
                                        </div>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Connect
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
                                        <div className="flex items-center space-x-2">
                                            <Database className="h-5 w-5 text-purple-500" />
                                            <CardTitle className="text-lg">MySQL Database</CardTitle>
                                        </div>
                                        <Badge variant="default">Active</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Connected</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Host:</span>
                                            <span className="text-sm">db.company.com:3306</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Database:</span>
                                            <span className="text-sm">analytics_db</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Last sync:</span>
                                            <span className="text-sm">1 hour ago</span>
                                        </div>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Test Connection
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
                                        <div className="flex items-center space-x-2">
                                            <Database className="h-5 w-5 text-orange-500" />
                                            <CardTitle className="text-lg">REST API</CardTitle>
                                        </div>
                                        <Badge variant="secondary">Error</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <AlertCircle className="h-4 w-4 text-orange-500" />
                                            <span className="text-sm">Connection Error</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Endpoint:</span>
                                            <span className="text-sm">api.external.com</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Error:</span>
                                            <span className="text-sm text-red-600">Authentication failed</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Last sync:</span>
                                            <span className="text-sm">3 days ago</span>
                                        </div>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Retry
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Key className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Database className="h-5 w-5 text-indigo-500" />
                                            <CardTitle className="text-lg">MongoDB</CardTitle>
                                        </div>
                                        <Badge variant="default">Active</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Connected</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Host:</span>
                                            <span className="text-sm">mongo.company.com:27017</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Database:</span>
                                            <span className="text-sm">user_data</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Last sync:</span>
                                            <span className="text-sm">30 minutes ago</span>
                                        </div>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Test Connection
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
                                <CardDescription>Overview of your data source connections</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">6</div>
                                        <div className="text-sm text-gray-600">Total Sources</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">4</div>
                                        <div className="text-sm text-gray-600">Active</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">1</div>
                                        <div className="text-sm text-gray-600">Error</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-600">1</div>
                                        <div className="text-sm text-gray-600">Inactive</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common data source operations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                                        <Plus className="h-6 w-6 mb-2" />
                                        <span>Add New Source</span>
                                    </Button>
                                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                                        <RefreshCw className="h-6 w-6 mb-2" />
                                        <span>Test All Connections</span>
                                    </Button>
                                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                                        <Settings className="h-6 w-6 mb-2" />
                                        <span>Connection Settings</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DashboardLayout>
            </>
        );
    }
