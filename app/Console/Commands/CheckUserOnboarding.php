<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\OnboardingStep;
use App\Services\OnboardingService;

class CheckUserOnboarding extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'onboarding:check-user {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check onboarding status for a specific user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email '{$email}' not found.");
            return 1;
        }

        $this->info("Checking onboarding for user: {$user->name} ({$user->email})");
        $this->info("User ID: {$user->id}");
        $this->line('');

        // Check uploaded files
        $uploadedFilesCount = $user->uploadedFiles()->count();
        $this->info("Uploaded files: {$uploadedFilesCount}");
        if ($uploadedFilesCount > 0) {
            $files = $user->uploadedFiles()->get(['filename', 'original_filename', 'created_at']);
            foreach ($files as $file) {
                $this->line("  - {$file->original_filename} (uploaded: {$file->created_at})");
            }
        }

        // Check dashboard widgets
        $dashboardWidgetsCount = $user->dashboardWidgets()->count();
        $this->info("Dashboard widgets: {$dashboardWidgetsCount}");
        if ($dashboardWidgetsCount > 0) {
            $widgets = $user->dashboardWidgets()->get(['widget_type', 'created_at']);
            foreach ($widgets as $widget) {
                $this->line("  - {$widget->widget_type} (created: {$widget->created_at})");
            }
        }

        $this->line('');

        // Check onboarding steps
        $onboardingSteps = OnboardingStep::where('user_id', $user->id)->get();
        $this->info("Onboarding steps: {$onboardingSteps->count()}");

        if ($onboardingSteps->count() === 0) {
            $this->warn("No onboarding steps found. Initializing...");
            OnboardingService::initializeOnboardingSteps($user);
            $onboardingSteps = OnboardingStep::where('user_id', $user->id)->get();
        }

        foreach ($onboardingSteps as $step) {
            $status = $step->is_completed ? '✅ COMPLETED' : '❌ PENDING';
            $completedAt = $step->completed_at ? " ({$step->completed_at})" : '';
            $this->line("  {$status} {$step->step_name}{$completedAt}");
        }

        $this->line('');

        // Check current progress
        $progress = $user->getOnboardingProgress();
        $this->info("Progress: {$progress['completed_steps']}/{$progress['total_steps']} ({$progress['progress_percentage']}%)");

        // Check if user is onboarded
        $isOnboarded = $user->isOnboarded();
        $this->info("User onboarded: " . ($isOnboarded ? 'YES' : 'NO'));

        // Check if onboarding should be shown
        $shouldShow = OnboardingService::shouldShowOnboarding($user);
        $this->info("Should show onboarding: " . ($shouldShow ? 'YES' : 'NO'));

        $this->line('');

        // Run check and mark steps
        $this->info("Running checkAndMarkSteps...");
        OnboardingService::checkAndMarkSteps($user);

        // Check progress again
        $progressAfter = $user->getOnboardingProgress();
        $this->info("Progress after check: {$progressAfter['completed_steps']}/{$progressAfter['total_steps']} ({$progressAfter['progress_percentage']}%)");

        return 0;
    }
}
