import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, Database, Cloud, Server, Key, Users, FileText, Globe } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function PrivacyPolicy() {
    return (
        <>
            <Head title="Privacy Policy - Excel Dashboard" />

            <DashboardLayout
                title="Privacy Policy"
                description="How we protect your data and ensure your privacy"
            >
                <div className="space-y-8">
                    {/* Introduction */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-6 w-6 text-green-600" />
                                Data Security & Privacy Commitment
                            </CardTitle>
                            <CardDescription>
                                Your privacy and data security are our top priorities. This policy explains how we protect your information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                At Excel Dashboard, we understand the importance of data security and privacy. We've implemented 
                                comprehensive security measures to ensure your files and data remain protected at all times.
                            </p>
                        </CardContent>
                    </Card>

                    {/* File Encryption */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-6 w-6 text-blue-600" />
                                File Encryption & Storage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <h4 className="font-semibold mb-2">Encryption Process</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Files are encrypted using AES-256 encryption before upload</li>
                                        <li>• Each file receives a unique encryption key</li>
                                        <li>• Encryption happens on our secure servers</li>
                                        <li>• Only authorized users can decrypt their own files</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Storage Security</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Encrypted files stored in Cloudflare R2</li>
                                        <li>• Enterprise-grade cloud infrastructure</li>
                                        <li>• Automatic backup and redundancy</li>
                                        <li>• Global CDN for fast access</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Processing Privacy */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-6 w-6 text-purple-600" />
                                AI Processing & Data Privacy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-purple-50 p-4 rounded-lg dark:bg-purple-950">
                                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                                    Important: Your Data Never Leaves Our Infrastructure
                                </h4>
                                <p className="text-sm text-purple-800 dark:text-purple-200">
                                    While we use AI to generate dashboard widgets, your raw files and sensitive data are never 
                                    shared with external AI models or third-party services. All AI processing happens within our 
                                    secure infrastructure using processed, anonymized data only.
                                </p>
                            </div>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <h4 className="font-semibold mb-2">What We Process</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• File structure and metadata</li>
                                        <li>• Column headers and data types</li>
                                        <li>• Statistical summaries (no raw data)</li>
                                        <li>• Chart and visualization suggestions</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">What We Never Share</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Raw file content or data</li>
                                        <li>• Personal or sensitive information</li>
                                        <li>• User account details</li>
                                        <li>• File names or identifiers</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technical Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Server className="h-6 w-6 text-orange-600" />
                                Technical Security Measures
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="text-center p-4 border rounded-lg">
                                    <Key className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                    <h4 className="font-semibold">AES-256 Encryption</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Military-grade encryption for all stored files
                                    </p>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                    <h4 className="font-semibold">Secure Storage</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Cloudflare R2 with enterprise security
                                    </p>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                                    <h4 className="font-semibold">User Isolation</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Complete data separation between users
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compliance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-6 w-6 text-indigo-600" />
                                Compliance & Standards
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">
                                    <Shield className="h-3 w-3 mr-1" />
                                    GDPR Compliant
                                </Badge>
                                <Badge variant="secondary">
                                    <Lock className="h-3 w-3 mr-1" />
                                    SOC 2 Type II
                                </Badge>
                                <Badge variant="secondary">
                                    <Database className="h-3 w-3 mr-1" />
                                    ISO 27001
                                </Badge>
                                <Badge variant="secondary">
                                    <FileText className="h-3 w-3 mr-1" />
                                    Data Residency
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Rights */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Data Rights</CardTitle>
                            <CardDescription>
                                You have complete control over your data
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <h4 className="font-semibold mb-2">Access & Control</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Download your files anytime</li>
                                        <li>• Delete files permanently</li>
                                        <li>• Export your processed data</li>
                                        <li>• Request data deletion</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Transparency</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• View all your uploaded files</li>
                                        <li>• See processing status</li>
                                        <li>• Access audit logs</li>
                                        <li>• Contact support anytime</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Questions About Privacy?</CardTitle>
                            <CardDescription>
                                We're here to help with any privacy concerns
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                If you have any questions about our privacy practices or data security measures, 
                                please don't hesitate to contact our support team.
                            </p>
                            <Button variant="outline">
                                Contact Support
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        </>
    );
} 