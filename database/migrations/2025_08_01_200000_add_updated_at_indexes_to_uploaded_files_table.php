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
            // Add index for updated_at for efficient sorting
            $table->index('updated_at', 'idx_uploaded_files_updated_at');
            
            // Add composite index for user_id, status, and updated_at for the most common query pattern
            $table->index(['user_id', 'status', 'updated_at'], 'idx_uploaded_files_user_status_updated');
            
            // Add composite index for user_id and updated_at for general user-based queries
            $table->index(['user_id', 'updated_at'], 'idx_uploaded_files_user_updated');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('uploaded_files', function (Blueprint $table) {
            $table->dropIndex('idx_uploaded_files_updated_at');
            $table->dropIndex('idx_uploaded_files_user_status_updated');
            $table->dropIndex('idx_uploaded_files_user_updated');
        });
    }
}; 