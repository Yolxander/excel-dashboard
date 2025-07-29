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
        Schema::create('user_onboarding_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('step_key'); // e.g., 'upload_first_file', 'connect_file_to_dashboard'
            $table->string('step_name'); // e.g., 'Upload First File', 'Connect File to Dashboard'
            $table->text('step_description')->nullable(); // Description of what the user needs to do
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Ensure each user can only have one record per step
            $table->unique(['user_id', 'step_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_onboarding_steps');
    }
};
