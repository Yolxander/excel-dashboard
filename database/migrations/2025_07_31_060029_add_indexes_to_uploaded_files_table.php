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
        Schema::table('uploaded_files', function (Blueprint $table) {
            // Add composite index for user_id and created_at for efficient pagination
            $table->index(['user_id', 'created_at'], 'idx_uploaded_files_user_created');
            
            // Add index for status for filtering
            $table->index('status', 'idx_uploaded_files_status');
            
            // Add index for is_encrypted for filtering
            $table->index('is_encrypted', 'idx_uploaded_files_encrypted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('uploaded_files', function (Blueprint $table) {
            $table->dropIndex('idx_uploaded_files_user_created');
            $table->dropIndex('idx_uploaded_files_status');
            $table->dropIndex('idx_uploaded_files_encrypted');
        });
    }
};
