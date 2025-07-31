import type React from "react"
import { Head, Link } from '@inertiajs/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Phone, Mail, Clock, Search, BookOpen, Play, Users, Zap, CheckCircle, ArrowRight, HelpCircle, FileText, Video, Headphones } from "lucide-react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

export default function SupportPage() {
  const heroRef = useIntersectionObserver({ threshold: 0.3 })
  const helpRef = useIntersectionObserver({ threshold: 0.2 })
  const resourcesRef = useIntersectionObserver({ threshold: 0.3 })
  const contactRef = useIntersectionObserver({ threshold: 0.2 })
  const faqRef = useIntersectionObserver({ threshold: 0.2 })

  return (
    <>
      <Head title="Support - Xcel Dashboard" />
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
                We're Here to Help
              </h1>

              <p className={`text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto transition-all duration-700 delay-400 ${
                heroRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                Get the help you need, when you need it. Our support team is ready to assist you with any questions about Xcel Dashboard.
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
                    placeholder="Search for help articles, tutorials, and more..."
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
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent transition-transform hover:scale-105">
                  Contact Support
                </Button>
              </div>
            </div>
          </main>

          {/* Help Options Section */}
          <section
            id="help"
            ref={helpRef.ref}
            className={`container mx-auto px-4 py-12 md:py-20 transition-all duration-1000 ease-out ${
              helpRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className={`text-center mb-12 transition-all duration-700 delay-200 ${
              helpRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-sm font-semibold text-gray-700 mb-2">Get Help</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Multiple Ways to Get Support
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the support option that works best for you. We're here to help you succeed with Xcel Dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Help Option 1 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-300 hover:shadow-xl hover:scale-105 ${
                helpRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get instant help from our support team during business hours.
                </p>
                <Button variant="outline" className="w-full">
                  Start Chat
                </Button>
              </div>

              {/* Help Option 2 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-400 hover:shadow-xl hover:scale-105 ${
                helpRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Speak directly with our support team for complex issues.
                </p>
                <Button variant="outline" className="w-full">
                  Call Now
                </Button>
              </div>

              {/* Help Option 3 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-500 hover:shadow-xl hover:scale-105 ${
                helpRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Send us a detailed message and get a response within 24 hours.
                </p>
                <Button variant="outline" className="w-full">
                  Send Email
                </Button>
              </div>

              {/* Help Option 4 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-600 hover:shadow-xl hover:scale-105 ${
                helpRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Support Hours</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Monday - Friday: 9AM - 6PM PST<br />
                  Saturday: 10AM - 4PM PST
                </p>
                <Button variant="outline" className="w-full">
                  View Schedule
                </Button>
              </div>
            </div>
          </section>

          {/* Resources Section */}
          <section
            ref={resourcesRef.ref}
            className={`container mx-auto px-4 py-12 md:py-20 transition-all duration-1000 ease-out ${
              resourcesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className={`text-center mb-12 transition-all duration-700 delay-200 ${
              resourcesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-sm font-semibold text-gray-700 mb-2">Self-Service Resources</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Learn at Your Own Pace
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our comprehensive library of resources to help you get the most out of Xcel Dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Resource 1 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-300 hover:shadow-xl hover:scale-105 ${
                resourcesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Knowledge Base</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Comprehensive documentation covering all features and functionality.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• Step-by-step guides</li>
                  <li>• Best practices</li>
                  <li>• Troubleshooting tips</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Browse Articles
                </Button>
              </div>

              {/* Resource 2 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-500 hover:shadow-xl hover:scale-105 ${
                resourcesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Visual guides and tutorials to help you master Xcel Dashboard.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• Getting started videos</li>
                  <li>• Feature walkthroughs</li>
                  <li>• Advanced techniques</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Watch Videos
                </Button>
              </div>

              {/* Resource 3 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-700 hover:shadow-xl hover:scale-105 ${
                resourcesRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Community Forum</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Connect with other users and share tips and best practices.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• User discussions</li>
                  <li>• Tips and tricks</li>
                  <li>• Feature requests</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Join Community
                </Button>
              </div>
            </div>
          </section>

          {/* Contact Support Section */}
          <section
            id="contact"
            ref={contactRef.ref}
            className={`container mx-auto px-4 py-12 md:py-20 transition-all duration-1000 ease-out ${
              contactRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Contact Form */}
              <div className={`lg:w-1/2 transition-all duration-700 delay-200 ${
                contactRef.hasTriggered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}>
                <Card className="w-full bg-white rounded-xl shadow-lg border border-gray-100/50">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-900">Contact Support</CardTitle>
                    <CardDescription className="text-gray-600">
                      Need help? Fill out the form below and we'll get back to you within 24 hours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                            First Name
                          </label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Enter your first name"
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Enter your last name"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                          Subject
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Select a subject</option>
                          <option value="technical">Technical Issue</option>
                          <option value="billing">Billing Question</option>
                          <option value="feature">Feature Request</option>
                          <option value="general">General Inquiry</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-gray-700">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          placeholder="Describe your issue or question..."
                          className="w-full min-h-[120px]"
                        />
                      </div>

                      <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 transition-transform hover:scale-105">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Support Information */}
              <div className={`lg:w-1/2 space-y-8 transition-all duration-700 delay-400 ${
                contactRef.hasTriggered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Help Fast</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Our support team is here to help you succeed with Xcel Dashboard. Choose the option that works best for you.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Support Method 1 */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Live Chat</h3>
                        <p className="text-gray-600 mb-2">Get instant help during business hours</p>
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                          Start Chat Now
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Support Method 2 */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone Support</h3>
                        <p className="text-gray-600 mb-2">Speak directly with our team</p>
                        <a href="tel:+1-555-123-4567" className="text-green-600 hover:text-green-700 font-medium">
                          +1 (555) 123-4567
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Support Method 3 */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Support</h3>
                        <p className="text-gray-600 mb-2">Get a response within 24 hours</p>
                        <a href="mailto:support@xceldashboard.com" className="text-purple-600 hover:text-purple-700 font-medium">
                          support@xceldashboard.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section
            ref={faqRef.ref}
            className={`container mx-auto px-4 py-12 md:py-20 transition-all duration-1000 ease-out ${
              faqRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className={`text-center mb-12 transition-all duration-700 delay-200 ${
              faqRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-sm font-semibold text-gray-700 mb-2">Frequently Asked Questions</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Common Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find quick answers to the most common support questions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* FAQ Item 1 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-300 hover:shadow-xl hover:scale-105 ${
                faqRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h3 className="text-lg font-bold text-gray-900 mb-3">How do I reset my password?</h3>
                <p className="text-gray-600 text-sm">
                  Click the "Forgot Password" link on the login page. We'll send you an email with instructions to reset your password securely.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-400 hover:shadow-xl hover:scale-105 ${
                faqRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h3 className="text-lg font-bold text-gray-900 mb-3">What file formats do you support?</h3>
                <p className="text-gray-600 text-sm">
                  We support Excel files (.xlsx, .xls) and CSV files. Our platform automatically detects your data structure and suggests the best visualization options.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-500 hover:shadow-xl hover:scale-105 ${
                faqRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h3 className="text-lg font-bold text-gray-900 mb-3">How do I share my dashboard?</h3>
                <p className="text-gray-600 text-sm">
                  You can share dashboards via private links, export them as images or PDFs, or invite team members to collaborate directly on your dashboards.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-600 hover:shadow-xl hover:scale-105 ${
                faqRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Can I cancel my subscription?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.
                </p>
              </div>

              {/* FAQ Item 5 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-700 hover:shadow-xl hover:scale-105 ${
                faqRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h3 className="text-lg font-bold text-gray-900 mb-3">How secure is my data?</h3>
                <p className="text-gray-600 text-sm">
                  Your data is protected with military-grade AES-256 encryption. We never share your information with third parties and all processing happens within our secure infrastructure.
                </p>
              </div>

              {/* FAQ Item 6 */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100/50 transition-all duration-700 delay-800 hover:shadow-xl hover:scale-105 ${
                faqRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Do you offer training?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! We offer free video tutorials, webinars, and personalized training sessions. Contact our support team to schedule a training session for your team.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="container mx-auto px-4 py-12 md:py-20 text-center">
            <p className="text-sm font-semibold text-gray-700 mb-2">Still Need Help?</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already creating beautiful dashboards with Xcel Dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent rounded-full">
                  Contact Support
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
