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
        Schema::create('file_widget_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('uploaded_file_id')->constrained('uploaded_files')->onDelete('cascade');
            $table->string('widget_name');
            $table->string('widget_type'); // 'kpi', 'bar_chart', 'pie_chart', 'table'
            $table->json('widget_config')->nullable(); // Store widget-specific configuration
            $table->boolean('is_displayed')->default(false); // Whether this widget is shown on dashboard
            $table->integer('display_order')->default(0); // Order in which widgets appear
            $table->json('ai_insights')->nullable(); // Store AI insights for this widget
            $table->timestamps();

            // Ensure unique widget per file
            $table->unique(['uploaded_file_id', 'widget_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_widget_connections');
    }
};
