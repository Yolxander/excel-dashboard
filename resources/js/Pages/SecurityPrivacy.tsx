import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, Database, Cloud, ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function SecurityPrivacy() {
    return (
        <>
            <Head title="Security & Privacy - Excel Dashboard" />

            <DashboardLayout
                title="Security & Privacy"
                description="How we protect your data and ensure your privacy"
            >
                <div className="space-y-6">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link href="/upload-files">
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Upload Files
                            </Button>
                        </Link>
                    </div>

                    {/* Main Privacy Notice */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-green-600" />
                                Data Security & Privacy
                            </CardTitle>
                            <CardDescription>
                                Your data security is our top priority. Here's how we protect your information:
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">End-to-End Encryption</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        All uploaded files are encrypted using AES-256 encryption before being stored in secure cloud storage.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Database className="h-4 w-4 text-purple-600" />
                                        <span className="font-medium">Secure Storage</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Encrypted files are stored in secure cloud storage with enterprise-grade security measures.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-orange-600" />
                                        <span className="font-medium">AI Processing Privacy</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        While we use AI to generate widgets, your raw data is never shared with external AI models or third parties.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Cloud className="h-4 w-4 text-green-600" />
                                        <span className="font-medium">Cloudflare R2 Storage</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Files are stored in Cloudflare R2 with automatic encryption and global CDN distribution.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                    Important Privacy Information
                                </h4>
                                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                    <li>• Your files are encrypted before being uploaded to our secure storage</li>
                                    <li>• Only authorized users can access their own encrypted files</li>
                                    <li>• AI-generated widgets are created from processed data, not raw files</li>
                                    <li>• No personal or sensitive data is shared with external AI services</li>
                                    <li>• All data processing happens within our secure infrastructure</li>
                                </ul>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    <Lock className="h-3 w-3 mr-1" />
                                    AES-256 Encryption
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                    <Shield className="h-3 w-3 mr-1" />
                                    GDPR Compliant
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                    <Database className="h-3 w-3 mr-1" />
                                    Secure Cloud Storage
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                    <Eye className="h-3 w-3 mr-1" />
                                    Private AI Processing
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Security Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Technical Security Details</CardTitle>
                            <CardDescription>
                                Advanced security measures protecting your data
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <h4 className="font-semibold mb-2">Encryption Process</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• AES-256 encryption for all file content</li>
                                        <li>• Unique encryption keys per file</li>
                                        <li>• Secure key management</li>
                                        <li>• End-to-end encryption</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Access Control</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• User-based file isolation</li>
                                        <li>• Secure authentication</li>
                                        <li>• Session management</li>
                                        <li>• Audit logging</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Processing Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Processing & Privacy</CardTitle>
                            <CardDescription>
                                How we use AI while protecting your data
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-green-50 p-4 rounded-lg dark:bg-green-950">
                                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                                    Your Data Never Leaves Our Infrastructure
                                </h4>
                                <p className="text-sm text-green-800 dark:text-green-200">
                                    While we use AI to generate dashboard widgets, your raw files and sensitive data are never
                                    shared with external AI models or third-party services. All AI processing happens within our
                                    secure infrastructure using processed, anonymized data only.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Questions About Security?</CardTitle>
                            <CardDescription>
                                We're here to help with any security concerns
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                If you have any questions about our security measures or privacy practices,
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
