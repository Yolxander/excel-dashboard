import type React from "react"
import { Head, Link } from '@inertiajs/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, FileText, Video, Play, Users, Zap, CheckCircle, ArrowRight, HelpCircle, Code, Database, BarChart3, Upload, Download, Settings, Shield, Globe, Clock, Star, TrendingUp, Lightbulb, Target, Rocket } from "lucide-react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

export default function DocumentationPage() {
  const heroRef = useIntersectionObserver({ threshold: 0.3 })
  const guidesRef = useIntersectionObserver({ threshold: 0.2 })
  const apiRef = useIntersectionObserver({ threshold: 0.3 })
  const examplesRef = useIntersectionObserver({ threshold: 0.2 })
  const resourcesRef = useIntersectionObserver({ threshold: 0.2 })

  return (
    <>
      <Head title="Documentation - Xcel Dashboard" />
      <div className="bg-white p-4">
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
          {/* Header */}
          <header className="w-full px-6 py-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg px-6 py-3 shadow-sm border border-gray-100/50 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">X</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Xcel Dashboard</span>
                </Link>

                <nav className="hidden md:flex items-center space-x-8">
                  <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                    Home
                  </Link>
                  <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                    About
                  </Link>
                  <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                    Contact
                  </Link>
                  <Link href="/security" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                    Security
                  </Link>
                  <Link href="/support" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                    Support
                  </Link>
                  <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                    Sign in
                  </Link>
                </nav>

                <Link href="/register" className="text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors">Sign up</Link>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <main className="container mx-auto px-4 py-12 md:py-20">
            <div
              ref={heroRef.ref}
              className={`text-center max-w-7xl mx-auto transition-all duration-1000 ease-out ${
                heroRef.hasTriggered
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <h1 className={`text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-700 delay-200 ${
                heroRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                Complete Documentation
              </h1>

              <p className={`text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto transition-all duration-700 delay-400 ${
                heroRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                Everything you need to know about Xcel Dashboard. From getting started to advanced features, find comprehensive guides and tutorials.
              </p>

              {/* Search Bar */}
              <div
                className={`max-w-2xl mx-auto mb-8 transition-all duration-700 delay-600 ${
                  heroRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search documentation, guides, and tutorials..."
                    className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                  />
                </div>
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-800 ${
                  heroRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <Link href="/login">
                  <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 transition-transform hover:scale-105">
                    Try Xcel Dashboard
                  </Button>
                </Link>
                <Link href="/support">
                  <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent transition-transform hover:scale-105">
                    Get Support
                  </Button>
                </Link>
              </div>
            </div>
          </main>

          {/* Quick Start Guide Section */}
          <section
            id="guides"
            ref={guidesRef.ref}
            className={`container mx-auto px-4 py-12 md:py-20 transition-all duration-1000 ease-out ${
              guidesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className={`text-center mb-12 transition-all duration-700 delay-200 ${
              guidesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-sm font-semibold text-gray-700 mb-2">Getting Started</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Quick Start Guide
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get up and running with Xcel Dashboard in minutes. Follow these simple steps to create your first dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-300 hover:shadow-xl hover:scale-105 ${
                guidesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Step 1: Upload Your Data</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Upload your Excel files or CSV data. Our platform automatically detects your data structure.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Supported formats: .xlsx, .xls, .csv
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Automatic data detection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Secure file processing
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </div>

              {/* Step 2 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-500 hover:shadow-xl hover:scale-105 ${
                guidesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Step 2: Create Visualizations</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Choose from our library of chart types and create beautiful, interactive visualizations.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    15+ chart types available
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Interactive dashboards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Real-time updates
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  View Charts
                </Button>
              </div>

              {/* Step 3 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-700 hover:shadow-xl hover:scale-105 ${
                guidesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Step 3: Share & Collaborate</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Share your dashboards with your team and collaborate in real-time.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Private sharing links
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Team collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Export to PDF/Image
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Learn Sharing
                </Button>
              </div>
            </div>
          </section>

          {/* API Documentation Section */}
          <section
            ref={apiRef.ref}
            className={`container mx-auto px-4 py-12 md:py-20 transition-all duration-1000 ease-out ${
              apiRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className={`text-center mb-12 transition-all duration-700 delay-200 ${
              apiRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-sm font-semibold text-gray-700 mb-2">Developer Resources</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                API Documentation
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Integrate Xcel Dashboard into your applications with our comprehensive REST API.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* API Overview */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-300 hover:shadow-xl hover:scale-105 ${
                apiRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">REST API</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Complete REST API for programmatic access to Xcel Dashboard features.
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Authentication</span>
                    <Badge variant="secondary">OAuth 2.0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rate Limiting</span>
                    <Badge variant="secondary">1000 req/hour</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Format</span>
                    <Badge variant="secondary">JSON</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View API Docs
                </Button>
              </div>

              {/* SDKs */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-500 hover:shadow-xl hover:scale-105 ${
                apiRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">SDKs & Libraries</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Official SDKs and libraries for popular programming languages.
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">JavaScript/Node.js</span>
                    <Badge variant="secondary">v2.1.0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Python</span>
                    <Badge variant="secondary">v1.8.2</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">PHP</span>
                    <Badge variant="secondary">v1.5.0</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Download SDKs
                </Button>
              </div>
            </div>
          </section>

          {/* Examples & Tutorials Section */}
          <section
            ref={examplesRef.ref}
            className={`container mx-auto px-4 py-12 md:py-20 transition-all duration-1000 ease-out ${
              examplesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className={`text-center mb-12 transition-all duration-700 delay-200 ${
              examplesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-sm font-semibold text-gray-700 mb-2">Learn by Example</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Examples & Tutorials
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real-world examples and step-by-step tutorials to help you master Xcel Dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Example 1 */}
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100/50 transition-all duration-700 delay-300 hover:shadow-xl hover:scale-105 ${
                examplesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Sales Dashboard</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Create a comprehensive sales dashboard with revenue tracking and performance metrics.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Beginner</Badge>
                    <span className="text-sm text-gray-500">15 min read</span>
                  </div>
                </div>
              </div>

              {/* Example 2 */}
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100/50 transition-all duration-700 delay-400 hover:shadow-xl hover:scale-105 ${
                examplesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Marketing Analytics</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Track marketing campaigns and analyze customer engagement with interactive charts.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Intermediate</Badge>
                    <span className="text-sm text-gray-500">25 min read</span>
                  </div>
                </div>
              </div>

              {/* Example 3 */}
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100/50 transition-all duration-700 delay-500 hover:shadow-xl hover:scale-105 ${
                examplesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">HR Analytics</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Monitor employee performance and workforce analytics with detailed visualizations.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Advanced</Badge>
                    <span className="text-sm text-gray-500">35 min read</span>
                  </div>
                </div>
              </div>

              {/* Example 4 */}
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100/50 transition-all duration-700 delay-600 hover:shadow-xl hover:scale-105 ${
                examplesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Inventory Management</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Track inventory levels and manage stock with real-time dashboards.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Intermediate</Badge>
                    <span className="text-sm text-gray-500">20 min read</span>
                  </div>
                </div>
              </div>

              {/* Example 5 */}
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100/50 transition-all duration-700 delay-700 hover:shadow-xl hover:scale-105 ${
                examplesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Security Monitoring</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Monitor system security and track security events with detailed dashboards.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Advanced</Badge>
                    <span className="text-sm text-gray-500">30 min read</span>
                  </div>
                </div>
              </div>

              {/* Example 6 */}
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100/50 transition-all duration-700 delay-800 hover:shadow-xl hover:scale-105 ${
                examplesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Custom Integrations</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Learn how to integrate Xcel Dashboard with your existing tools and workflows.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Expert</Badge>
                    <span className="text-sm text-gray-500">45 min read</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Resources Section */}
          <section
            ref={resourcesRef.ref}
            className={`container mx-auto px-4 py-12 md:py-20 transition-all duration-1000 ease-out ${
              resourcesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className={`text-center mb-12 transition-all duration-700 delay-200 ${
              resourcesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-sm font-semibold text-gray-700 mb-2">Additional Resources</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                More Learning Materials
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore additional resources to deepen your knowledge and skills with Xcel Dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Video Tutorials */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-300 hover:shadow-xl hover:scale-105 ${
                resourcesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Step-by-step video guides covering all aspects of Xcel Dashboard.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• Getting Started Series</li>
                  <li>• Advanced Features</li>
                  <li>• Best Practices</li>
                  <li>• Troubleshooting</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Watch Videos
                </Button>
              </div>

              {/* Community Forum */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-500 hover:shadow-xl hover:scale-105 ${
                resourcesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Community Forum</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Connect with other users, share tips, and get help from the community.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• User Discussions</li>
                  <li>• Tips & Tricks</li>
                  <li>• Feature Requests</li>
                  <li>• Showcase Projects</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Join Community
                </Button>
              </div>

              {/* Webinars */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-700 hover:shadow-xl hover:scale-105 ${
                resourcesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Live Webinars</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Join live webinars with our product experts and learn advanced techniques.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• Monthly Q&A Sessions</li>
                  <li>• Feature Deep Dives</li>
                  <li>• Industry Best Practices</li>
                  <li>• Interactive Workshops</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Register Now
                </Button>
              </div>

              {/* Certification */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-900 hover:shadow-xl hover:scale-105 ${
                resourcesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Certification Program</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get certified in Xcel Dashboard and showcase your expertise.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• Beginner Certification</li>
                  <li>• Advanced Certification</li>
                  <li>• Expert Certification</li>
                  <li>• Official Badges</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Get Certified
                </Button>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="container mx-auto px-4 py-12 md:py-20 text-center">
            <p className="text-sm font-semibold text-gray-700 mb-2">Ready to Start?</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Begin Your Journey
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Start creating beautiful dashboards with Xcel Dashboard today. Join thousands of users who are already transforming their data into insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/support">
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent rounded-full">
                  Get Help
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
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
            <div className="flex space-x-12">
              {/* Resources */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/security" className="text-gray-600 hover:text-gray-900 transition-colors">Security</Link></li>
                  <li><Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/support" className="text-gray-600 hover:text-gray-900 transition-colors">Support</Link></li>
                  <li><Link href="/documentation" className="text-gray-600 hover:text-gray-900 transition-colors">Documentation</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link></li>
                  <li><Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link></li>
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
    </>
  )
}
