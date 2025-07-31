import type React from "react"
import { Head, Link } from '@inertiajs/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, Copyright, MessageSquare, Scale, AlertTriangle, Users, Lock, CheckCircle, ArrowRight, HelpCircle, Globe, Settings, Mail, Phone, MapPin, Database, Eye, Edit, Trash2, Download, Settings as SettingsIcon } from "lucide-react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

export default function PrivacyPolicyPage() {
  const heroRef = useIntersectionObserver({ threshold: 0.3 })
  const contentRef = useIntersectionObserver({ threshold: 0.2 })

  return (
    <>
      <Head title="Privacy Policy - Xcel Dashboard" />
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
                Privacy Policy
              </h1>

              <p className={`text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto transition-all duration-700 delay-400 ${
                heroRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                Xcel Dashboard ("we", "our", "us") is committed to protecting your privacy and ensuring your data is secure. Our practices comply fully with the Personal Information Protection and Electronic Documents Act (PIPEDA).
              </p>

              {/* Last Updated */}
              <div
                className={`mb-8 transition-all duration-700 delay-600 ${
                  heroRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <Badge variant="outline" className="text-sm">
                  Last Updated: July 30, 2025
                </Badge>
              </div>
            </div>
          </main>

          {/* Two Column Layout */}
          <section
            ref={contentRef.ref}
            className={`container mx-auto px-4 py-12 md:py-20 transition-all duration-1000 ease-out ${
              contentRef.hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Navigation */}
              <div className={`lg:w-1/3 transition-all duration-700 delay-200 ${
                contentRef.hasTriggered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}>
                <Card className="bg-white rounded-xl shadow-lg border border-gray-100/50 sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">Table of Contents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      <a href="#information-collected" className="block p-3 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors">
                        1. What Information Do We Collect?
                      </a>
                      <a href="#how-collected" className="block p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        2. How Do We Collect Your Information?
                      </a>
                      <a href="#why-collected" className="block p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        3. Why Do We Collect Your Information?
                      </a>
                      <a href="#protection" className="block p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        4. How Is Your Information Protected?
                      </a>
                      <a href="#consent" className="block p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        5. Consent
                      </a>
                      <a href="#third-parties" className="block p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        6. Disclosure to Third Parties
                      </a>
                      <a href="#cookies" className="block p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        7. Cookies & Tracking
                      </a>
                      <a href="#access-correction" className="block p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        8. Access and Correction
                      </a>
                      <a href="#changes" className="block p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        9. Changes to This Policy
                      </a>
                      <a href="#contact" className="block p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        10. Questions & Contact
                      </a>
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Content */}
              <div className={`lg:w-2/3 transition-all duration-700 delay-400 ${
                contentRef.hasTriggered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}>
                <div className="space-y-8">
                  {/* Section 1: What Information Do We Collect? */}
                  <Card className="bg-white rounded-xl shadow-lg border border-gray-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <span className="text-blue-600">1.</span>
                        What Information Do We Collect?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        We may collect and store the following personal information:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Name and contact information (email, phone number)</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Employment information (such as company name, position)</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Payment or banking details (if applicable)</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Information related to Excel data processing and dashboard creation</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Any other information voluntarily provided by you</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 2: How Do We Collect Your Information? */}
                  <Card className="bg-white rounded-xl shadow-lg border border-gray-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <span className="text-blue-600">2.</span>
                        How Do We Collect Your Information?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Your information is collected through:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Direct interactions via email, forms, or chat</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Registration or sign-up processes</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Use of our Excel-based dashboard platform</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Automatic tracking technologies (cookies, analytics tools)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 3: Why Do We Collect Your Information? */}
                  <Card className="bg-white rounded-xl shadow-lg border border-gray-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <span className="text-blue-600">3.</span>
                        Why Do We Collect Your Information?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        We collect your personal information only for purposes including:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Providing access to our Excel dashboard platform and services</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Managing user accounts and permissions</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Handling communications, inquiries, and customer support</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Processing payments or transactions securely</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Complying with legal or regulatory obligations</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Improving and customizing our services based on your needs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 4: How Is Your Information Protected? */}
                  <Card className="bg-white rounded-xl shadow-lg border border-gray-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <span className="text-blue-600">4.</span>
                        How Is Your Information Protected?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        We take the security of your data seriously. Measures include:
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Data Encryption</h4>
                          <p className="text-blue-800 text-sm">All data transmitted between your browser and our servers is protected by SSL/TLS encryption.</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Data Storage</h4>
                          <p className="text-green-800 text-sm">Sensitive data stored on our servers or third-party systems is encrypted using secure AES encryption methods.</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2">Limited Access</h4>
                          <p className="text-purple-800 text-sm">Only authorized personnel have access to your personal information.</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <h4 className="font-semibold text-orange-900 mb-2">Regular Audits</h4>
                          <p className="text-orange-800 text-sm">We conduct regular reviews of our data security practices to ensure compliance.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 5: Consent */}
                  <Card className="bg-white rounded-xl shadow-lg border border-gray-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <span className="text-blue-600">5.</span>
                        Consent
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        By using our platform, you consent to the collection, use, and disclosure of your personal information as described in this policy. You can withdraw your consent at any time, subject to contractual or legal restrictions.
                      </p>
                      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          <strong>Important:</strong> As a startup, we are committed to transparency and will always inform you of any changes to how we use your data.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 6: Disclosure to Third Parties */}
                  <Card className="bg-white rounded-xl shadow-lg border border-gray-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <span className="text-blue-600">6.</span>
                        Disclosure to Third Parties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        We do <strong>not</strong> sell your personal data. However, we may share your information:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">With trusted service providers and partners necessary for our services (e.g., hosting services, analytics providers)</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">To comply with applicable laws, regulations, or legal processes</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">In cases involving security or fraud prevention</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">With your explicit consent</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 7: Cookies & Tracking */}
                  <Card className="bg-white rounded-xl shadow-lg border border-gray-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <span className="text-blue-600">7.</span>
                        Cookies & Tracking
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Our platform may use cookies or similar technologies to:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Improve user experience</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Analyze usage patterns</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Provide customized services</p>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-800 text-sm">
                          <strong>Control:</strong> You can control cookie settings directly through your browser preferences.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 8: Access and Correction */}
                  <Card className="bg-white rounded-xl shadow-lg border border-gray-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <span className="text-blue-600">8.</span>
                        Access and Correction
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Under PIPEDA, you have the right to:
                      </p>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3">
                          <Eye className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Access your personal information we hold</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Edit className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Correct or update inaccurate or incomplete information</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Trash2 className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">Withdraw your consent to our use of your personal data (subject to legal or contractual obligations)</p>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 text-sm mb-2">
                          <strong>To request access, corrections, or withdrawals, please contact us at:</strong>
                        </p>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600">• Email: <a href="mailto:privacy@xceldashboard.com" className="text-blue-600 hover:text-blue-700 underline">privacy@xceldashboard.com</a></p>
                          <p className="text-gray-600">• Mail: Toronto, Ontario, Canada</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 9: Changes to This Policy */}
                  <Card className="bg-white rounded-xl shadow-lg border border-gray-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <span className="text-blue-600">9.</span>
                        Changes to This Policy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        We may occasionally update this Privacy Policy. Updates will be posted directly to our website at: <a href="/privacy-policy" className="text-blue-600 hover:text-blue-700 underline">xceldashboard.com/privacy-policy</a>.
                      </p>
                      <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                        <p className="text-orange-800 text-sm">
                          <strong>Startup Note:</strong> As we grow and evolve, we may need to update this policy. We will always notify you of significant changes.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 10: Questions & Contact */}
                  <Card className="bg-white rounded-xl shadow-lg border border-gray-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <span className="text-blue-600">10.</span>
                        Questions & Contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        If you have any questions, concerns, or complaints about our privacy practices, please contact our Privacy Officer at:
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Privacy Officer</h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-blue-800">• Email: <a href="mailto:privacy@xceldashboard.com" className="text-blue-600 hover:text-blue-700 underline">privacy@xceldashboard.com</a></p>
                            <p className="text-blue-800">• Address: Toronto, Ontario, Canada</p>
                          </div>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Office of the Privacy Commissioner of Canada (OPC)</h4>
                          <p className="text-green-800 text-sm mb-2">If you're unsatisfied with our response, you may contact the OPC:</p>
                          <div className="space-y-1 text-sm">
                            <p className="text-green-800">• Website: <a href="https://www.priv.gc.ca" className="text-green-600 hover:text-green-700 underline">priv.gc.ca</a></p>
                            <p className="text-green-800">• Telephone: 1-800-282-1376</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="container mx-auto px-4 py-12 md:py-20 text-center">
            <p className="text-sm font-semibold text-gray-700 mb-2">Questions About Our Privacy Policy?</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              We're Here to Help
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              If you have any questions about our privacy practices, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full">
                  Contact Us
                </Button>
              </Link>
              <Link href="/security">
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent rounded-full">
                  Security Overview
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
              <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors underline">
                Privacy Policy
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
