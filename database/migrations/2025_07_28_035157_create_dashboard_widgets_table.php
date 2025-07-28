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
        Schema::create('dashboard_widgets', function (Blueprint $table) {
            $table->id();
            $table->string('widget_type'); // 'kpi', 'bar_chart', 'pie_chart', 'table'
            $table->string('widget_name');
            $table->json('widget_config')->nullable(); // Store widget-specific configuration
            $table->foreignId('uploaded_file_id')->nullable()->constrained('uploaded_files')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dashboard_widgets');
    }
};
