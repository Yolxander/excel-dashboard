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
        Schema::table('user_onboarding_steps', function (Blueprint $table) {
            // Drop the global unique constraint on step_key
            $table->dropUnique(['step_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_onboarding_steps', function (Blueprint $table) {
            // Re-add the global unique constraint on step_key
            $table->unique('step_key');
        });
    }
};
