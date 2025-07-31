<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'onboarding_congratulations_shown',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'onboarding_congratulations_shown' => 'boolean',
        ];
    }

    public function uploadedFiles()
    {
        return $this->hasMany(UploadedFile::class);
    }

    public function dashboardWidgets()
    {
        return $this->hasMany(DashboardWidget::class);
    }

    public function fileWidgetConnections()
    {
        return $this->hasManyThrough(FileWidgetConnection::class, UploadedFile::class);
    }

    public function onboardingSteps()
    {
        return $this->hasMany(OnboardingStep::class, 'user_id');
    }

    /**
     * Check if user has completed onboarding
     */
    public function isOnboarded()
    {
        return OnboardingStep::isUserOnboarded($this->id);
    }

    /**
     * Get onboarding progress
     */
    public function getOnboardingProgress()
    {
        return OnboardingStep::getOnboardingProgress($this->id);
    }

    /**
     * Mark onboarding congratulations as shown
     */
    public function markOnboardingCongratulationsShown()
    {
        $this->update(['onboarding_congratulations_shown' => true]);
    }

    /**
     * Check if onboarding congratulations has been shown
     */
    public function hasShownOnboardingCongratulations()
    {
        return $this->onboarding_congratulations_shown;
    }
}
