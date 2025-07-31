import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Brain,
    Lightbulb,
    TrendingUp,
    AlertTriangle,
    Info,
    CheckCircle,
    FileText,
    Settings,
    RefreshCw,
    Sparkles
} from 'lucide-react';

interface AIInsightsProps {
    insights: {
        suggested_filename?: string;
        combination_strategy?: string;
        expected_insights?: string[];
        potential_challenges?: string[];
        recommendations?: string[];
        business_value?: string;
    };
    onRegenerate?: () => void;
    isRegenerating?: boolean;
    showRegenerateButton?: boolean;
}

export function AIInsights({ insights, onRegenerate, isRegenerating = false, showRegenerateButton = true }: AIInsightsProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-purple-600" />
                    AI Analysis
                </h4>
                {showRegenerateButton && onRegenerate && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRegenerate}
                        disabled={isRegenerating}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                        Regenerate
                    </Button>
                )}
            </div>

            {/* Suggested Filename */}
            {insights.suggested_filename && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center mb-2">
                        <FileText className="h-4 w-4 text-yellow-600 mr-2" />
                        <span className="font-medium text-yellow-900">Suggested Filename</span>
                    </div>
                    <p className="text-lg font-semibold text-yellow-800">{insights.suggested_filename}</p>
                </div>
            )}

            {/* Combination Strategy */}
            {insights.combination_strategy && (
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                        <Settings className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-900">Combination Strategy</span>
                    </div>
                    <p className="text-sm text-blue-800">{insights.combination_strategy}</p>
                </div>
            )}

            {/* Expected Insights */}
            {insights.expected_insights && insights.expected_insights.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                        <Lightbulb className="h-4 w-4 text-green-600 mr-2" />
                        <span className="font-medium text-green-900">Expected Insights</span>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                        {insights.expected_insights.map((insight, index) => (
                            <li key={index} className="flex items-start">
                                <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-600" />
                                {insight}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Potential Challenges */}
            {insights.potential_challenges && insights.potential_challenges.length > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                        <span className="font-medium text-orange-900">Potential Challenges</span>
                    </div>
                    <ul className="text-sm text-orange-800 space-y-1">
                        {insights.potential_challenges.map((challenge, index) => (
                            <li key={index} className="flex items-start">
                                <AlertTriangle className="h-3 w-3 mr-2 mt-0.5 text-orange-600" />
                                {challenge}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Recommendations */}
            {insights.recommendations && insights.recommendations.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                        <Info className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="font-medium text-purple-900">Recommendations</span>
                    </div>
                    <ul className="text-sm text-purple-800 space-y-1">
                        {insights.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start">
                                <Info className="h-3 w-3 mr-2 mt-0.5 text-purple-600" />
                                {recommendation}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Business Value */}
            {insights.business_value && (
                <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                        <TrendingUp className="h-4 w-4 text-indigo-600 mr-2" />
                        <span className="font-medium text-indigo-900">Business Value</span>
                    </div>
                    <p className="text-sm text-indigo-800">{insights.business_value}</p>
                </div>
            )}
        </div>
    );
}

export function AIInsightsCard({ insights, onRegenerate, isRegenerating = false, showRegenerateButton = true }: AIInsightsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                        AI Analysis
                    </div>
                    {showRegenerateButton && onRegenerate && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRegenerate}
                            disabled={isRegenerating}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                            Regenerate
                        </Button>
                    )}
                </CardTitle>
                <CardDescription>
                    AI-generated insights and recommendations
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AIInsights
                    insights={insights}
                    onRegenerate={onRegenerate}
                    isRegenerating={isRegenerating}
                    showRegenerateButton={false}
                />
            </CardContent>
        </Card>
    );
}
