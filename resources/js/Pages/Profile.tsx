import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, User, Mail, Lock, Save, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/Layouts/DashboardLayout';

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

export default function Profile() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { toast } = useToast();

    const profileForm = useForm({
        name: user.name,
        email: user.email,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post('/profile/update', {
            onSuccess: () => {
                toast({
                    title: 'Profile Updated',
                    description: 'Your profile has been updated successfully.',
                });
            },
            onError: (errors) => {
                toast({
                    title: 'Error',
                    description: 'There was an error updating your profile.',
                    variant: 'destructive',
                });
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.post('/profile/update-password', {
            onSuccess: () => {
                toast({
                    title: 'Password Updated',
                    description: 'Your password has been updated successfully.',
                });
                passwordForm.reset();
            },
            onError: (errors) => {
                toast({
                    title: 'Error',
                    description: 'There was an error updating your password.',
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <>
            <Head title="Profile" />
            <DashboardLayout title="Profile" description="Manage your account settings">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Profile Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>
                                Update your personal information and email address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            className="pl-10"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    {profileForm.errors.name && (
                                        <p className="text-sm text-red-600">{profileForm.errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                            className="pl-10"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    {profileForm.errors.email && (
                                        <p className="text-sm text-red-600">{profileForm.errors.email}</p>
                                    )}
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={profileForm.processing}
                                    className="w-full"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {profileForm.processing ? 'Updating...' : 'Update Profile'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Separator />

                    {/* Password Change */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                Change Password
                            </CardTitle>
                            <CardDescription>
                                Update your password to keep your account secure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current_password">Current Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="current_password"
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={passwordForm.data.current_password}
                                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                            className="pl-10 pr-10"
                                            placeholder="Enter your current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {passwordForm.errors.current_password && (
                                        <p className="text-sm text-red-600">{passwordForm.errors.current_password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={passwordForm.data.password}
                                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                                            className="pl-10 pr-10"
                                            placeholder="Enter your new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {passwordForm.errors.password && (
                                        <p className="text-sm text-red-600">{passwordForm.errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                            className="pl-10 pr-10"
                                            placeholder="Confirm your new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {passwordForm.errors.password_confirmation && (
                                        <p className="text-sm text-red-600">{passwordForm.errors.password_confirmation}</p>
                                    )}
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={passwordForm.processing}
                                    className="w-full"
                                >
                                    <Key className="h-4 w-4 mr-2" />
                                    {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        </>
    );
} 