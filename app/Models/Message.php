<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
  use HasFactory;

  protected $fillable = [
    'sender_id',
    'receiver_id',
    'content',
    'read_at',
    'created_at',
    'updated_at'
  ];

  public function sender()
  {
    return $this->belongsTo(User::class, 'sender_id', 'profile_image_url');
  }

  public function receiver()
  {
    return $this->belongsTo(User::class, 'receiver_id', 'profile_image_url');
  }
}
