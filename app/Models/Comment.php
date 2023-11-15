<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
  use HasFactory;

  protected $fillable = ['user_id', 'chirp_id', 'content', 'likes_count', 'created_at'];

  public function chirp()
  {
    return $this->belongsTo(Chirp::class);
  }

  public function comments()
  {
    return $this->hasMany(Comment::class, 'chirp_id');
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}
