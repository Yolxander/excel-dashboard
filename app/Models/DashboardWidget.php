<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DashboardWidget extends Model
{
    use HasFactory;

    protected $fillable = [
        'widget_type',
        'widget_name',
        'widget_config',
        'uploaded_file_id',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'widget_config' => 'array',
        'is_active' => 'boolean',
    ];

    public function uploadedFile()
    {
        return $this->belongsTo(UploadedFile::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }
}
