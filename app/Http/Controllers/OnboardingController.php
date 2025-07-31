<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\OnboardingService;
use Illuminate\Support\Facades\Auth;

class OnboardingController extends Controller
{
    /**
     * Get onboarding data for the current user
     */
    public function getOnboardingData(): JsonResponse
    {
        $user = Auth::user();
        $onboardingData = OnboardingService::getOnboardingData($user);

        return response()->json($onboardingData);
    }

    /**
     * Mark a specific step as completed
     */
    public function markStepCompleted(Request $request): JsonResponse
    {
        $request->validate([
            'step_key' => 'required|string',
        ]);

        $user = Auth::user();
        $stepKey = $request->input('step_key');

        $wasCompleted = OnboardingService::markStepCompleted($user, $stepKey);

        if ($wasCompleted) {
            return response()->json([
                'success' => true,
                'message' => 'Step completed successfully!',
                'onboarding_data' => OnboardingService::getOnboardingData($user),
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Step already completed or not found',
        ], 400);
    }

    /**
     * Check and update onboarding progress based on current user state
     */
    public function checkProgress(): JsonResponse
    {
        $user = Auth::user();
        OnboardingService::checkAndMarkSteps($user);

        return response()->json([
            'success' => true,
            'onboarding_data' => OnboardingService::getOnboardingData($user),
        ]);
    }

    /**
     * Mark onboarding congratulations as shown
     */
    public function markCongratulationsShown(): JsonResponse
    {
        $user = Auth::user();
        $user->markOnboardingCongratulationsShown();

        return response()->json([
            'success' => true,
            'message' => 'Congratulations marked as shown',
        ]);
    }

    /**
     * Reset onboarding congratulations status (for testing)
     */
    public function resetCongratulationsStatus(): JsonResponse
    {
        $user = Auth::user();
        OnboardingService::resetCongratulationsStatus($user);

        return response()->json([
            'success' => true,
            'message' => 'Congratulations status reset',
        ]);
    }
}
