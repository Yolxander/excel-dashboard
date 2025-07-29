<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if the unique constraint exists before trying to drop it
        $hasIndex = \DB::select("SHOW INDEX FROM user_onboarding_steps WHERE Key_name = 'user_onboarding_steps_step_key_unique'");

        if (!empty($hasIndex)) {
            Schema::table('user_onboarding_steps', function (Blueprint $table) {
                $table->dropUnique(['step_key']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Check if the unique constraint doesn't exist before trying to add it
        $hasIndex = \DB::select("SHOW INDEX FROM user_onboarding_steps WHERE Key_name = 'user_onboarding_steps_step_key_unique'");

        if (empty($hasIndex)) {
            Schema::table('user_onboarding_steps', function (Blueprint $table) {
                $table->unique('step_key');
            });
        }
    }
};
