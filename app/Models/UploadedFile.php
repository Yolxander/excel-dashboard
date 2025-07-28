<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UploadedFile extends Model
{
    protected $fillable = [
        'filename',
        'original_filename',
        'file_path',
        'file_type',
        'file_size',
        'status',
        'processed_data',
        'error_message',
        'ai_insights',
    ];

    protected $casts = [
        'processed_data' => 'array',
        'ai_insights' => 'array',
    ];

    public function getFormattedFileSizeAttribute()
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 1) . ' ' . $units[$i];
    }

    public function dashboardWidgets()
    {
        return $this->hasMany(DashboardWidget::class);
    }

    public function fileWidgetConnections()
    {
        return $this->hasMany(FileWidgetConnection::class);
    }
}
