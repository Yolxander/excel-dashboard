<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('dashboard_widgets', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id');
        });

        // Get the first user or create a default user for existing widgets
        $defaultUser = DB::table('users')->first();

        if ($defaultUser) {
            // Update existing widgets to belong to the first user
            DB::table('dashboard_widgets')->update(['user_id' => $defaultUser->id]);
        }

        // Now make the column not null and add foreign key constraint
        Schema::table('dashboard_widgets', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable(false)->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dashboard_widgets', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
