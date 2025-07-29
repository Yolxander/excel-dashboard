<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\OnboardingService;
use Symfony\Component\HttpFoundation\Response;

class CheckOnboardingProgress
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
        public function handle(Request $request, Closure $next): Response
    {
        // Only check onboarding for authenticated users
        if (Auth::check()) {
            $user = Auth::user();

            // Only check onboarding on GET requests to avoid performance issues
            // and to avoid interfering with POST/PUT/DELETE actions that have specific step completion
            if ($request->isMethod('GET')) {
                OnboardingService::checkAndMarkSteps($user);
            }
        }

        return $next($request);
    }
}
