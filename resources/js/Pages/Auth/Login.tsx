import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login - Xcel Dashboard" />
            <div className="bg-white p-4">
                <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                    {/* Login Form */}
                    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-md w-full space-y-8">
                            {/* Logo and Title */}
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">X</span>
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Xcel Dashboard</h1>
                                <p className="text-gray-600">Sign in to your account</p>
                            </div>

                            {/* Login Card */}
                            <Card className="w-full bg-white rounded-xl shadow-lg border border-gray-100/50">
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl font-semibold text-gray-900">Welcome back</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Enter your credentials to access your dashboard
                                    </CardDescription>
                                </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="pl-10"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="pl-10 pr-10"
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Remember me</span>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 transition-transform hover:scale-105"
                                    size="lg"
                                >
                                    {processing ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Signing in...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            Sign in
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    )}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or</span>
                                </div>
                            </div>

                            {/* Register Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link
                                        href="/register"
                                        className="font-medium text-slate-800 hover:text-slate-700 transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left Side - Brand & Social */}
                        <div className="space-y-6">
                            {/* Logo and Description */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">X</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Xcel Dashboard</h3>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                                    Xcel Dashboard empowers teams to transform raw Excel data into clear, compelling visualizations — making insights easier to share, understand, and act on.
                                </p>
                            </div>

                            {/* Social Media Icons */}
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Right Side - Navigation Links */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Product */}
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4">Product</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">Dashboard</Link></li>
                                    <li><Link href="/upload-files" className="text-gray-600 hover:text-gray-900 transition-colors">Upload Files</Link></li>
                                    <li><Link href="/connected-files" className="text-gray-600 hover:text-gray-900 transition-colors">Source Files</Link></li>
                                    <li><Link href="/combine-files" className="text-gray-600 hover:text-gray-900 transition-colors">Combine Files</Link></li>
                                </ul>
                            </div>

                            {/* Resources */}
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/security" className="text-gray-600 hover:text-gray-900 transition-colors">Security</Link></li>
                                    <li><Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                                    <li><a href="mailto:support@xceldashboard.com" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Documentation</a></li>
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Careers</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Partners</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section - Legal & Copyright */}
                    <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-600">&copy; 2025 Xcel Dashboard. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors underline">
                                Privacy Policy
                            </Link>
                            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors underline">
                                Terms of Service
                            </a>
                            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors underline">
                                Cookies Settings
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
        </>
    );
}
