<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'name',
    'email',
    'password',
    'profile_image_url',
    'birthday',
    'gender',
    'profile_cover_image',
    'profile_text',
    'slug'
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    'email_verified_at' => 'datetime',
    'password' => 'hashed',
  ];

  public function chirps(): HasMany
  {
    return $this->hasMany(Chirp::class);
  }

  public function friends(): BelongsToMany
  {
    /* return $this->belongsToMany(User::class, 'user_user', 'user_id', 'friend_id')->wherePivotNotNull('accepted_at'); */
    return $this->belongsToMany(User::class, 'user_user', 'user_id', 'friend_id');
  }

  public function friend_requests(): BelongsToMany
  {
    /*  return $this->belongsToMany(User::class, 'user_user', 'user_id', 'friend_id')->wherePivotNull('accepted_at'); */
    return $this->belongsToMany(User::class, 'user_user', 'friend_id', 'user_id')
      ->whereNull('accepted_at');
  }
}
