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
        Schema::table('dashboard_widgets', function (Blueprint $table) {
            $table->enum('data_type', ['raw', 'ai'])->default('ai')->after('widget_config');
            $table->index(['user_id', 'data_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dashboard_widgets', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'data_type']);
            $table->dropColumn('data_type');
        });
    }
};
