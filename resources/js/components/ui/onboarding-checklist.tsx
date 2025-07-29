import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, X, ChevronDown, ChevronUp, Trophy, Sparkles, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
    id: number;
    step_key: string;
    step_name: string;
    step_description: string;
    is_completed: boolean;
    completed_at: string | null;
}

interface OnboardingData {
    should_show: boolean;
    progress: {
        total_steps: number;
        completed_steps: number;
        progress_percentage: number;
        steps: OnboardingStep[];
    };
    is_completed: boolean;
}

interface OnboardingChecklistProps {
    className?: string;
    initialData?: OnboardingData;
}

export default function OnboardingChecklist({ className = '', initialData }: OnboardingChecklistProps) {
    const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(initialData || null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [showCelebration, setShowCelebration] = useState(false);
    const [previousProgress, setPreviousProgress] = useState(0);
    const { toast } = useToast();

    console.log('OnboardingChecklist props:', { initialData, className });
    console.log('OnboardingChecklist state:', { onboardingData, isExpanded, isLoading, showCelebration });

    useEffect(() => {
        if (!initialData) {
            fetchOnboardingData();
        }
    }, [initialData]);

    // Real-time progress checking
    useEffect(() => {
        // Check progress every 3 seconds if onboarding is not completed
        if (onboardingData && !onboardingData.is_completed) {
            const interval = setInterval(() => {
                checkProgress();
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [onboardingData]);

    // Check for completion and show celebration
    useEffect(() => {
        if (onboardingData && onboardingData.progress) {
            const currentProgress = onboardingData.progress.progress_percentage;

            // Check if user just completed all steps
            if (currentProgress === 100 && previousProgress < 100) {
                setShowCelebration(true);
                toast({
                    title: "🎉 Congratulations!",
                    description: "You've completed the onboarding process!",
                    variant: "default",
                });

                // Hide celebration after 5 seconds
                setTimeout(() => {
                    setShowCelebration(false);
                }, 5000);
            }

            setPreviousProgress(currentProgress);
        }
    }, [onboardingData, previousProgress, toast]);

    const fetchOnboardingData = async () => {
        try {
            console.log('Fetching onboarding data...');
            const response = await fetch('/onboarding/data', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Onboarding data received:', data);
                setOnboardingData(data);

                // Check if any new steps were completed
                if (data.progress.completed_steps > 0) {
                    const newlyCompleted = data.progress.steps.filter((step: OnboardingStep) =>
                        step.is_completed && step.completed_at
                    );

                    if (newlyCompleted.length > 0) {
                        // Show success toast for newly completed steps
                        newlyCompleted.forEach((step: OnboardingStep) => {
                            toast({
                                title: "🎉 Onboarding Progress!",
                                description: `Great job! You've completed: ${step.step_name}`,
                                className: "border-green-200 bg-green-50 text-green-800",
                            });
                        });
                    }
                }
            } else {
                console.error('Failed to fetch onboarding data:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch onboarding data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkProgress = async () => {
        try {
            const response = await fetch('/onboarding/check-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const newData = data.onboarding_data;

                // Check if any new steps were completed
                if (onboardingData && newData.progress) {
                    const oldCompletedSteps = onboardingData.progress.steps.filter(step => step.is_completed);
                    const newCompletedSteps = newData.progress.steps.filter(step => step.is_completed);

                    // Find newly completed steps
                    const newlyCompleted = newCompletedSteps.filter(newStep =>
                        !oldCompletedSteps.some(oldStep => oldStep.id === newStep.id)
                    );

                    // Show toast for newly completed steps
                    newlyCompleted.forEach(step => {
                        toast({
                            title: "🎉 Step Completed!",
                            description: `Great job! You've completed: ${step.step_name}`,
                            className: "border-green-200 bg-green-50 text-green-800",
                        });
                    });
                }

                setOnboardingData(newData);
            }
        } catch (error) {
            console.error('Failed to check progress:', error);
        }
    };

    // Don't render if onboarding is not needed or completed
    console.log('Onboarding component render check:', {
        hasData: !!onboardingData,
        shouldShow: onboardingData?.should_show,
        isCompleted: onboardingData?.is_completed,
        progress: onboardingData?.progress
    });

    if (!onboardingData || !onboardingData.should_show || onboardingData.is_completed) {
        console.log('Onboarding component not rendering - conditions not met');
        return null;
    }

    const { progress } = onboardingData;
    const { total_steps, completed_steps, progress_percentage, steps } = progress;

    return (
        <div className={`fixed bottom-4 left-64 z-50 max-w-sm ${className}`} style={{ marginLeft: '1rem' }}>
            {/* Celebration Animation */}
            {showCelebration && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 animate-pulse">
                    <div className="text-center">
                        <div className="flex justify-center mb-2">
                            <PartyPopper className="h-8 w-8 text-green-600 animate-bounce" />
                        </div>
                        <h3 className="text-lg font-bold text-green-800 mb-1">🎉 Congratulations!</h3>
                        <p className="text-sm text-green-600">You've completed the onboarding!</p>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-lg border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <Sparkles className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Getting Started
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                        {completed_steps}/{total_steps} completed
                                    </Badge>
                                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                                            style={{ width: `${progress_percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-6 w-6 p-0"
                        >
                            {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {isExpanded && (
                        <div className="pt-4 space-y-3">
                            {steps.map((step) => (
                                <div key={step.id} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {step.is_completed ? (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Circle className="h-4 w-4 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${
                                            step.is_completed ? 'text-green-700' : 'text-gray-700'
                                        }`}>
                                            {step.step_name}
                                        </p>
                                        {step.step_description && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {step.step_description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {progress_percentage === 100 && (
                                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                    <div className="flex items-center space-x-2">
                                        <Trophy className="h-5 w-5 text-green-600" />
                                        <span className="text-sm font-medium text-green-800">
                                            🎉 Onboarding Complete!
                                        </span>
                                    </div>
                                    <p className="text-xs text-green-600 mt-1">
                                        You're all set to explore the full potential of your dashboard!
                                    </p>
                                </div>
                            )}

                            <div className="mt-4 pt-3 border-t border-gray-200">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={checkProgress}
                                    disabled={isLoading}
                                    className="w-full text-xs"
                                >
                                    {isLoading ? 'Checking...' : 'Check Progress'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
