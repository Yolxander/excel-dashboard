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
            $table->string('encrypted_filename')->nullable()->after('filename');
            $table->string('encrypted_file_path')->nullable()->after('file_path');
            $table->boolean('is_encrypted')->default(false)->after('status');
            $table->string('encryption_key_id')->nullable()->after('is_encrypted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('uploaded_files', function (Blueprint $table) {
            $table->dropColumn(['encrypted_filename', 'encrypted_file_path', 'is_encrypted', 'encryption_key_id']);
        });
    }
};
