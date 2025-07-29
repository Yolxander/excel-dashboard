<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Services\OnboardingService;

class InitializeOnboardingForExistingUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'onboarding:init-existing-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initialize onboarding steps for existing users who do not have onboarding steps yet';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting onboarding initialization for existing users...');

        $users = User::whereDoesntHave('onboardingSteps')->get();

        if ($users->isEmpty()) {
            $this->info('No users found without onboarding steps.');
            return;
        }

        $this->info("Found {$users->count()} users without onboarding steps.");

        $bar = $this->output->createProgressBar($users->count());
        $bar->start();

        foreach ($users as $user) {
            OnboardingService::initializeOnboardingSteps($user);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Onboarding steps initialized successfully for all existing users!');
    }
}
