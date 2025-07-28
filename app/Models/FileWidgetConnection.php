<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileWidgetConnection extends Model
{
    use HasFactory;

    protected $fillable = [
        'uploaded_file_id',
        'widget_name',
        'widget_type',
        'widget_config',
        'is_displayed',
        'display_order',
        'ai_insights',
    ];

    protected $casts = [
        'widget_config' => 'array',
        'ai_insights' => 'array',
        'is_displayed' => 'boolean',
    ];

    public function uploadedFile()
    {
        return $this->belongsTo(UploadedFile::class);
    }

    public function scopeDisplayed($query)
    {
        return $query->where('is_displayed', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('widget_type', $type);
    }
}
