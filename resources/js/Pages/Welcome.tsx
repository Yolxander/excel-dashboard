import type React from "react"
import { Head, Link } from '@inertiajs/react'
import { Button } from "@/components/ui/button"
import { Settings, ShieldCheck, Package, Puzzle, Upload, BarChart3, Calculator, Brain, Building2, ShoppingCart, Factory, GraduationCap, Heart, FileSpreadsheet, ArrowRight, Users, TrendingUp, Lock, Target, Wrench, Sparkles } from "lucide-react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

export default function WelcomePage() {
  const heroRef = useIntersectionObserver({ threshold: 0.3 })
  const featuresRef = useIntersectionObserver({ threshold: 0.2 })
  const dashboardRef = useIntersectionObserver({ threshold: 0.3 })
  const ctaRef = useIntersectionObserver({ threshold: 0.3 })
  const industryRef = useIntersectionObserver({ threshold: 0.2 })
  const testimonialsRef = useIntersectionObserver({ threshold: 0.2 })

  return (
    <>
      <Head title="Xcel Dashboard - Turn Any Excel File into a Beautiful Dashboard" />
      <div className="bg-white p-4">
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
          {/* Header */}
          <header className="w-full px-6 py-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg px-6 py-3 shadow-sm border border-gray-100/50 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">X</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Xcel Dashboard</span>
                </div>

                <nav className="hidden md:flex items-center space-x-8">
                  <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                    Features
                  </Link>
                  <Link href="#industries" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                    Industries
                  </Link>
                  <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                    Testimonials
                  </Link>
                  <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                    How It Works
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
                Turn Any Excel File into a Beautiful Dashboard in Minutes — No Code Required
              </h1>

              <p className={`text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto transition-all duration-700 delay-400 ${
                heroRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                Whether you're tracking sales, managing inventory, reviewing performance, or organizing project metrics — Xcel Dashboard transforms your Excel files into interactive dashboards that save time, boost clarity, and drive smarter decisions.
              </p>

              {/* Dashboard Mockup */}
              <div
                ref={dashboardRef.ref}
                className={`relative mb-12 transition-all duration-1000 delay-600 ${
                  dashboardRef.hasTriggered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <img
                  src="/welcome/dashboard.png"
                  alt="Xcel Dashboard Interface showing interactive data visualization"
                  width={1000}
                  height={600}
                  className="mx-auto rounded-2xl shadow-2xl"
                />
              </div>

              {/* CTA Buttons */}
              <div
                ref={ctaRef.ref}
                className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-800 ${
                  ctaRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <Link href="/login">
                  <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 transition-transform hover:scale-105">
                    Try Xcel Dashboard Now
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent transition-transform hover:scale-105">
                  Request a Demo
                </Button>
              </div>
            </div>
          </main>

          {/* Features Section */}
          <section
            id="features"
            ref={featuresRef.ref}
            className={`container mx-auto px-4 py-12 md:py-20 transition-all duration-1000 ease-out ${
              featuresRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-8">
              <div className={`md:w-1/2 transition-all duration-700 delay-200 ${
                featuresRef.hasTriggered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}>
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-gray-700 rounded-full mr-2" />
                  What You Can Do
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Built for Teams, Trusted by Everyone
                </h2>
              </div>
              <div className={`md:w-1/2 flex flex-col items-start md:items-end text-left md:text-right transition-all duration-700 delay-400 ${
                featuresRef.hasTriggered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}>
                <p className="text-lg text-gray-600 mb-6 max-w-md">
                  Simply drag & drop your Excel files and watch them transform into beautiful, interactive dashboards. No coding required, no learning curve.
                </p>
                <Button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-full flex items-center gap-2 transition-transform hover:scale-105">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Feature Card 1 */}
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100/50 transition-all duration-700 delay-300 hover:shadow-xl hover:scale-105 ${
                featuresRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Upload Excel Files
                  </h3>
                  <p className="text-gray-600 text-base">
                    Simply drag & drop your .xlsx or .csv file. Xcel reads your data instantly — no formulas, no coding.
                  </p>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100/50 transition-all duration-700 delay-500 hover:shadow-xl hover:scale-105 ${
                featuresRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Generate Real-Time Dashboards
                  </h3>
                  <p className="text-gray-600 text-base">
                    See your data come to life through charts, graphs, scorecards, and tables. Choose from pre-built templates or build your own view.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature Card 3 */}
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100/50 transition-all duration-700 delay-700 hover:shadow-xl hover:scale-105 ${
                featuresRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <Calculator className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Custom Metrics & Calculations
                  </h3>
                  <p className="text-gray-600 text-base">
                    Add your own formulas — like (Revenue - Cost) / Revenue — or define custom KPIs. Xcel lets you create dashboards that speak your language.
                  </p>
                </div>
              </div>

              {/* Feature Card 4 */}
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100/50 transition-all duration-700 delay-900 hover:shadow-xl hover:scale-105 ${
                featuresRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    AI Insights (Beta)
                  </h3>
                  <p className="text-gray-600 text-base">
                    Let our AI detect trends, anomalies, and give you tailored insights based on your data type, industry, and business goals.
                  </p>
                </div>
              </div>
            </div>
          </section>

                    {/* Industry Use Cases Section */}
          <section
            id="industries"
            ref={industryRef.ref}
            className={`container mx-auto px-4 py-12 md:py-20 transition-all duration-1000 ease-out ${
              industryRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className={`text-center mb-12 transition-all duration-700 delay-200 ${
              industryRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-center">
                <span className="w-2 h-2 bg-gray-700 rounded-full mr-2" />
                Designed for Any Use Case
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">Industry Solutions</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From recruiting to retail, healthcare to manufacturing — Xcel Dashboard adapts to your industry and workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Industry Card 1 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-300 hover:shadow-xl hover:scale-105 ${
                industryRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Recruiting</h3>
                <p className="text-gray-600 text-sm">Commission tracking, placement success rate, recruiter performance</p>
              </div>

              {/* Industry Card 2 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-400 hover:shadow-xl hover:scale-105 ${
                industryRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Retail</h3>
                <p className="text-gray-600 text-sm">Inventory movement, top products, sales by region</p>
              </div>

              {/* Industry Card 3 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-500 hover:shadow-xl hover:scale-105 ${
                industryRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Operations</h3>
                <p className="text-gray-600 text-sm">Vendor performance, logistics KPIs, process tracking</p>
              </div>

              {/* Industry Card 4 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-600 hover:shadow-xl hover:scale-105 ${
                industryRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Healthcare</h3>
                <p className="text-gray-600 text-sm">Patient throughput, equipment usage, staffing dashboards</p>
              </div>

              {/* Industry Card 5 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-700 hover:shadow-xl hover:scale-105 ${
                industryRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Education</h3>
                <p className="text-gray-600 text-sm">Student performance, attendance trends, curriculum tracking</p>
              </div>

              {/* Industry Card 6 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-800 hover:shadow-xl hover:scale-105 ${
                industryRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <Factory className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Manufacturing</h3>
                <p className="text-gray-600 text-sm">Production targets, QC metrics, downtime reports</p>
              </div>
            </div>
          </section>

                    {/* Testimonials Section */}
          <section
            id="testimonials"
            ref={testimonialsRef.ref}
            className={`container mx-auto px-4 py-12 md:py-20 text-center transition-all duration-1000 ease-out ${
              testimonialsRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className={`transition-all duration-700 delay-200 ${
              testimonialsRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-sm font-semibold text-gray-700 mb-2">Trusted by Teams</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                What our users are saying
              </h2>
              <p className="text-lg text-gray-600 mb-12">From analysts to managers, founders to ops teams</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial Card 1 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 flex flex-col items-start text-left transition-all duration-700 delay-300 hover:shadow-xl hover:scale-105 ${
                testimonialsRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="mb-4">
                  <span className="font-bold text-gray-900">HumanContact</span>
                </div>
                <p className="text-gray-700 text-sm mb-6 flex-grow">
                  &quot;Xcel Dashboard transformed our reporting process completely. We went from spending hours on manual reports to having beautiful, interactive dashboards in minutes. The team loves how easy it is to share insights.&quot;
                </p>
                <div className="mt-auto">
                  <p className="font-semibold text-gray-900">Kristina</p>
                  <p className="text-gray-600 text-sm">Operations Manager</p>
                </div>
              </div>

              {/* Testimonial Card 2 (with gradient) */}
              <div className={`bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border border-gray-100/50 flex flex-col items-start text-left transition-all duration-700 delay-500 hover:shadow-xl hover:scale-105 ${
                testimonialsRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="mb-4">
                  <span className="font-bold text-gray-900">Jonex Solutions</span>
                </div>
                <p className="text-gray-700 text-sm mb-6 flex-grow">
                  &quot;The real-time data visualization capabilities are incredible. Our clients can now see their performance metrics instantly, and the AI insights help us identify opportunities we would have missed before.&quot;
                </p>
                <div className="mt-auto">
                  <p className="font-semibold text-gray-900">Alexander</p>
                  <p className="text-gray-600 text-sm">Data Analyst</p>
                </div>
              </div>

              {/* Testimonial Card 3 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 flex flex-col items-start text-left transition-all duration-700 delay-700 hover:shadow-xl hover:scale-105 ${
                testimonialsRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="mb-4">
                  <span className="font-bold text-gray-900">Sempre Studios</span>
                </div>
                <p className="text-gray-700 text-sm mb-6 flex-grow">
                  &quot;As a creative agency, we needed a way to present data beautifully to our clients. Xcel Dashboard lets us create stunning visualizations that match our brand aesthetic while delivering powerful insights.&quot;
                </p>
                <div className="mt-auto">
                  <p className="font-semibold text-gray-900">Shannon</p>
                  <p className="text-gray-600 text-sm">Creative Director</p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="container mx-auto px-4 py-12 md:py-20 text-center">
            <p className="text-sm font-semibold text-gray-700 mb-2">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">Simple 4-Step Process</h2>
            <p className="text-lg text-gray-600 mb-12">Get started in minutes, not hours</p>

            <div className="flex flex-col md:flex-row items-start gap-12">
              {/* Left side: Process Steps */}
              <div className="md:w-1/2 space-y-6">
                <div className="bg-white rounded-lg p-6 border border-gray-100/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                    Upload Your Excel File
                  </h3>
                  <p className="text-gray-600 text-sm">Drag & drop your .xlsx or .csv file</p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-100/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                    Choose a Template
                  </h3>
                  <p className="text-gray-600 text-sm">Select from pre-built templates or start from scratch</p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-100/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                    Customize & Configure
                  </h3>
                  <p className="text-gray-600 text-sm">Add charts, filters, and custom calculations</p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-100/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">4</div>
                    Share & Collaborate
                  </h3>
                  <p className="text-gray-600 text-sm">Get instant, shareable insights with your team</p>
                </div>
              </div>

              {/* Right side: Security & Features */}
              <div className="md:w-1/2 text-left space-y-6">
                <div className="bg-white rounded-lg p-6 border border-gray-100/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Secure & Shareable
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>• Password-protected dashboards</li>
                    <li>• Encrypted file handling</li>
                    <li>• Private link sharing</li>
                    <li>• Team-based access permissions</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-100/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Ideal For
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>• Analysts tired of rebuilding PowerPoint reports</li>
                    <li>• Managers needing weekly updates from spreadsheets</li>
                    <li>• Founders and ops teams who live in Excel</li>
                    <li>• Anyone who wants clarity without complexity</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-100/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Coming Soon
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>• Live integrations with Google Sheets, OneDrive, and Dropbox</li>
                    <li>• Scheduled email reports</li>
                    <li>• Multi-file blending and joins</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="container mx-auto px-4 py-12 md:py-20 text-center">
            <p className="text-sm font-semibold text-gray-700 mb-2">Get Started Free</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              No tech setup. No learning curve.
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Just upload your Excel file and watch the magic happen.
            </p>
            <Link href="/login">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full">
                Try Xcel Dashboard Now
              </Button>
            </Link>
            <div className="relative mt-12">
              <img
                src="/welcome/files.png"
                alt="Blurred Dashboard Interface"
                width={800}
                height={400}
                className="mx-auto rounded-2xl shadow-2xl opacity-70"
              />
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
              <Link href="/terms-of-service" className="text-sm text-gray-600 hover:text-gray-900 transition-colors underline">
                Terms of Service
              </Link>
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


