import React from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import {
    BarChart3,
    Upload,
    FileText,
    Database,
    Clock,
    Link as LinkIcon,
    RefreshCw,
    Settings,
    BrainCircuit,
    Database as DatabaseIcon,
    Sparkles,
    LogOut
} from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    showUpdateButton?: boolean;
    onUpdateWidgets?: (dataType: 'ai' | 'raw') => void;
    isUpdating?: boolean;
    currentDataType?: 'ai' | 'raw';
}

export default function DashboardLayout({ children, title = 'Dashboard', description = 'Manage your data and insights', showUpdateButton = false, onUpdateWidgets, isUpdating = false, currentDataType = 'raw' }: DashboardLayoutProps) {
    const { url } = usePage();
    const { post } = useForm();

    const handleLogout = () => {
        post('/logout');
    };

    const sidebarItems = [
        {
            section: 'Dashboards',
            items: [
                { id: 'overview', label: 'Data Overview', icon: BarChart3, href: '/' }
            ]
        },
        {
            section: 'Data Management',
            items: [
                { id: 'upload', label: 'File Management', icon: Upload, href: '/upload-files' },
                { id: 'connected', label: 'Source Files', icon: FileText, href: '/connected-files' },
                { id: 'combine', label: 'Combine Files', icon: LinkIcon, href: '/combine-files' },
                { id: 'widget-selection', label: 'Widget Selection', icon: Settings, href: '/widget-selection' },
                // { id: 'sources', label: 'Data Sources', icon: Database, href: '/data-sources' },
                // { id: 'schedule', label: 'Sync Schedule', icon: Clock, href: '/sync-schedule' }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 px-4 border-b">
                        <h1 className="text-xl font-bold text-gray-900">Excel Dashboard</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-6">
                        {sidebarItems.map((section) => (
                            <div key={section.section}>
                                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {section.section}
                                </h3>
                                <ul className="mt-2 space-y-1">
                                    {section.items.map((item) => (
                                        <li key={item.id}>
                                            <Link
                                                href={item.href}
                                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    url === item.href
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="pl-64">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="py-6 flex items-center justify-between">
                            {/* Left side - Page title */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                                <p className="text-sm text-gray-600">{description}</p>
                            </div>

                                                        {/* Right side - Data Source Switch and Logout */}
                            <div className="flex items-center space-x-3">
                                {showUpdateButton && onUpdateWidgets && (
                                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => onUpdateWidgets('raw')}
                                            disabled={isUpdating}
                                            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                                currentDataType === 'raw'
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {isUpdating && currentDataType === 'raw' ? (
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <DatabaseIcon className="h-4 w-4 mr-2" />
                                            )}
                                            Raw Data
                                        </button>

                                        <button
                                            onClick={() => onUpdateWidgets('ai')}
                                            disabled={isUpdating}
                                            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                                currentDataType === 'ai'
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {isUpdating && currentDataType === 'ai' ? (
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <Sparkles className="h-4 w-4 mr-2" />
                                            )}
                                            AI Insights
                                        </button>
                                    </div>
                                )}

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
