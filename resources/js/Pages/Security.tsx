import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, Database, Cloud, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Security() {
    return (
        <>
            <Head title="Security - Xcel Dashboard" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link href="/">
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Home
                                    </Button>
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900">Security</h1>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Introduction */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Your Security is Our Priority
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                We implement enterprise-grade security measures to protect your data at every step.
                            </p>
                        </div>

                        {/* Security Features Grid */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="h-5 w-5 text-blue-600" />
                                        End-to-End Encryption
                                    </CardTitle>
                                    <CardDescription>
                                        Military-grade encryption for all your data
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            AES-256 encryption for all files
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Unique encryption keys per file
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Encrypted in transit and at rest
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Database className="h-5 w-5 text-purple-600" />
                                        Secure Cloud Storage
                                    </CardTitle>
                                    <CardDescription>
                                        Enterprise-grade infrastructure
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            AWS S3 with automatic encryption
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Global CDN for fast access
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Automatic backup and redundancy
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-5 w-5 text-orange-600" />
                                        AI Processing Privacy
                                    </CardTitle>
                                    <CardDescription>
                                        Your data never leaves our infrastructure
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            No external AI model access
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Processed data only for AI
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            No third-party data sharing
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Cloud className="h-5 w-5 text-green-600" />
                                        Access Control
                                    </CardTitle>
                                    <CardDescription>
                                        Granular permissions and authentication
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            User-specific file access
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Password-protected dashboards
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Private link sharing
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Security Badges */}
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Certifications</h3>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Badge variant="secondary" className="text-sm">
                                    <Shield className="h-3 w-3 mr-1" />
                                    SOC 2 Compliant
                                </Badge>
                                <Badge variant="secondary" className="text-sm">
                                    <Lock className="h-3 w-3 mr-1" />
                                    GDPR Ready
                                </Badge>
                                <Badge variant="secondary" className="text-sm">
                                    <Database className="h-3 w-3 mr-1" />
                                    HIPAA Compatible
                                </Badge>
                                <Badge variant="secondary" className="text-sm">
                                    <Cloud className="h-3 w-3 mr-1" />
                                    AWS Security
                                </Badge>
                            </div>
                        </div>

                        {/* Important Notice */}
                        <Card className="border-orange-200 bg-orange-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-orange-800">
                                    <AlertTriangle className="h-5 w-5" />
                                    Important Security Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-orange-800 space-y-2">
                                    <p className="text-sm">
                                        • Your files are encrypted before being uploaded to our secure storage
                                    </p>
                                    <p className="text-sm">
                                        • Only authorized users can access their own encrypted files
                                    </p>
                                    <p className="text-sm">
                                        • AI-generated widgets are created from processed data, not raw files
                                    </p>
                                    <p className="text-sm">
                                        • No personal or sensitive data is shared with external AI services
                                    </p>
                                    <p className="text-sm">
                                        • All data processing happens within our secure infrastructure
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CTA */}
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Ready to Get Started?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Join thousands of users who trust Xcel Dashboard with their data
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register">
                                    <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white">
                                        Start Free Trial
                                    </Button>
                                </Link>
                                <Link href="/privacy-policy">
                                    <Button variant="outline" size="lg">
                                        Read Privacy Policy
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 