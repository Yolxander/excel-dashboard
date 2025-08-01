<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'auth' => \App\Http\Middleware\Authenticate::class,
            'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->renderable(function (\Throwable $e, $request) {
            // Only show custom error modal when APP_DEBUG is false
            if (!config('app.debug')) {
                $statusCode = 500;
                
                if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpException) {
                    $statusCode = $e->getStatusCode();
                }

                // For Inertia requests, return a custom error response
                if ($request->header('X-Inertia')) {
                    return \Inertia\Inertia::render('Error', [
                        'error' => [
                            'code' => $statusCode,
                            'message' => 'We are currently experiencing some technical issues. It should be fixed soon.',
                        ]
                    ])->toResponse($request)->setStatusCode($statusCode);
                }

                // For non-Inertia requests (API, etc.), return a JSON response
                if ($request->expectsJson()) {
                    return response()->json([
                        'error' => [
                            'code' => $statusCode,
                            'message' => 'We are currently experiencing some technical issues. It should be fixed soon.',
                        ]
                    ], $statusCode);
                }

                // For regular web requests, redirect to a custom error page
                return redirect()->route('error.show', ['code' => $statusCode]);
            }
        });
    })->create();
