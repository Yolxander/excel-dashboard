<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnboardingStep extends Model
{
    use HasFactory;

    protected $table = 'user_onboarding_steps';

    protected $fillable = [
        'user_id',
        'step_key',
        'step_name',
        'step_description',
        'is_completed',
        'completed_at',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mark a step as completed
     */
    public function markAsCompleted()
    {
        $this->update([
            'is_completed' => true,
            'completed_at' => now(),
        ]);
    }

    /**
     * Check if all onboarding steps are completed for a user
     */
    public static function isUserOnboarded($userId)
    {
        $totalSteps = self::where('user_id', $userId)->count();
        $completedSteps = self::where('user_id', $userId)->where('is_completed', true)->count();

        return $totalSteps > 0 && $totalSteps === $completedSteps;
    }

    /**
     * Get onboarding progress for a user
     */
    public static function getOnboardingProgress($userId)
    {
        $steps = self::where('user_id', $userId)->get();
        $totalSteps = $steps->count();
        $completedSteps = $steps->where('is_completed', true)->count();

        return [
            'total_steps' => $totalSteps,
            'completed_steps' => $completedSteps,
            'progress_percentage' => $totalSteps > 0 ? round(($completedSteps / $totalSteps) * 100) : 0,
            'steps' => $steps,
        ];
    }
}
