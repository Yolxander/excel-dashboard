import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorProps {
    error: {
        code: number;
        message: string;
    };
}

export default function Error({ error }: ErrorProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Automatically show the modal when the page loads
        setIsModalOpen(true);
    }, []);

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // After closing, redirect to home
        setTimeout(() => {
            window.location.href = '/';
        }, 300);
    };

    return (
        <>
            <Head title="Technical Issue" />
            
            {/* Fallback content in case modal doesn't load */}
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900">
                            Technical Issue
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-600 mb-6">
                            We are currently experiencing some technical issues. It should be fixed soon.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button onClick={handleRefresh} className="w-full">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Try Again
                            </Button>
                            <Button onClick={handleGoHome} variant="outline" className="w-full">
                                <Home className="mr-2 h-4 w-4" />
                                Go Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center text-xl font-semibold">
                            Technical Issue
                        </DialogTitle>
                        <DialogDescription className="text-center text-gray-600">
                            We are currently experiencing some technical issues. It should be fixed soon.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex flex-col gap-3 mt-6">
                        <Button onClick={handleRefresh} className="w-full">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                        <Button onClick={handleCloseModal} variant="outline" className="w-full">
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
} 