<?php

namespace App\Services;

use App\Models\User;
use App\Models\OnboardingStep;
use Illuminate\Support\Facades\Log;

class OnboardingService
{
    /**
     * Initialize onboarding steps for a new user
     */
    public static function initializeOnboardingSteps(User $user)
    {
        // Check if user already has onboarding steps
        if ($user->onboardingSteps()->count() > 0) {
            Log::info("User {$user->id} already has onboarding steps, skipping initialization");
            return;
        }

        $steps = [
            [
                'step_key' => 'upload_first_file',
                'step_name' => 'Upload First File',
                'step_description' => 'Upload your first Excel or CSV file to get started',
            ],
            [
                'step_key' => 'connect_file_to_dashboard',
                'step_name' => 'Connect File to Dashboard',
                'step_description' => 'Connect your uploaded file to the dashboard to visualize data',
            ],
            [
                'step_key' => 'edit_file_widgets',
                'step_name' => 'Edit File Widgets',
                'step_description' => 'Customize and edit widgets to display your data effectively',
            ],
            [
                'step_key' => 'update_second_file',
                'step_name' => 'Upload Second File',
                'step_description' => 'Upload a second file to explore more data combinations',
            ],
            [
                'step_key' => 'combine_files',
                'step_name' => 'Combine Files',
                'step_description' => 'Combine multiple files to create comprehensive insights',
            ],
        ];

        foreach ($steps as $step) {
            OnboardingStep::create([
                'user_id' => $user->id,
                'step_key' => $step['step_key'],
                'step_name' => $step['step_name'],
                'step_description' => $step['step_description'],
                'is_completed' => false,
            ]);
        }

        Log::info("Onboarding steps initialized for user {$user->id}");
    }

    /**
     * Mark a specific step as completed
     */
    public static function markStepCompleted(User $user, string $stepKey)
    {
        $step = OnboardingStep::where('user_id', $user->id)
            ->where('step_key', $stepKey)
            ->first();

        if ($step && !$step->is_completed) {
            $step->markAsCompleted();
            Log::info("Onboarding step '{$stepKey}' completed for user {$user->id}");
            return true;
        }

        return false;
    }

    /**
     * Check if user should see onboarding
     */
    public static function shouldShowOnboarding(User $user)
    {
        // If user has no onboarding steps, initialize them
        if ($user->onboardingSteps()->count() === 0) {
            self::initializeOnboardingSteps($user);
        }

        // Double-check that steps were created successfully
        if ($user->onboardingSteps()->count() === 0) {
            Log::warning("Failed to initialize onboarding steps for user {$user->id}");
            return false;
        }

        return !$user->isOnboarded();
    }

    /**
     * Get onboarding data for the frontend
     */
    public static function getOnboardingData(User $user)
    {
        $progress = $user->getOnboardingProgress();

        return [
            'should_show' => self::shouldShowOnboarding($user),
            'progress' => $progress,
            'is_completed' => $user->isOnboarded(),
        ];
    }

    /**
     * Check and mark onboarding steps based on user actions
     */
    public static function checkAndMarkSteps(User $user)
    {
        // Check for upload_first_file
        if ($user->uploadedFiles()->count() > 0) {
            self::markStepCompleted($user, 'upload_first_file');
        }

        // Check for connect_file_to_dashboard
        if ($user->dashboardWidgets()->count() > 0) {
            self::markStepCompleted($user, 'connect_file_to_dashboard');
        }

        // Check for edit_file_widgets (if user has widgets and has accessed widget selection)
        if ($user->dashboardWidgets()->count() > 0) {
            self::markStepCompleted($user, 'edit_file_widgets');
        }

        // Check for update_second_file
        if ($user->uploadedFiles()->count() > 1) {
            self::markStepCompleted($user, 'update_second_file');
        }

        // Check for combine_files (this would need to be checked based on combine files functionality)
        // For now, we'll mark it as completed if user has multiple files
        if ($user->uploadedFiles()->count() > 1) {
            self::markStepCompleted($user, 'combine_files');
        }
    }
}
