<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
  public function edit(Request $request): Response
  {
    return Inertia::render('Profile/Edit', [
      'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
      'status' => session('status'),
    ]);
  }

  /**
   * Update the user's profile information.
   */
  public function update(ProfileUpdateRequest $request): RedirectResponse
  {
    $request->user()->fill($request->validated());

    if ($request->user()->isDirty('email')) {
      $request->user()->email_verified_at = null;
    }

    $request->user()->save();

    return Redirect::route('profile.edit');
  }


  /**
   * Upload profile image
   */
  public function profileImage(Request $request): RedirectResponse
  {
    /*  dd($request->all()); */
    if ($request->hasFile('profileImageUrl')) {
      $imagePath = $request->file('profileImageUrl')->store('profileImageUrl', 'public');
      $request->user()->profile_Image_Url = $imagePath;
      $request->user()->save();
    }

    return Redirect::route('profile.edit');
  }

  /**
   * Upload profile cover image
   */
  public function profilecoverimage(Request $request): RedirectResponse
  {
    if ($request->hasFile('profilecoverimage')) {
      $imagePath = $request->file('profilecoverimage')->store('profilecoverimage', 'public');
      $request->user()->profile_cover_image = $imagePath;
      $request->user()->save();
    }

    return Redirect::route('profile.profilecoverimage');
  }


  /**
   * Delete the user's account.
   */
  public function destroy(Request $request): RedirectResponse
  {
    $request->validate([
      'password' => ['required', 'current_password'],
    ]);

    $user = $request->user();

    Auth::logout();

    $user->delete();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return Redirect::to('/');
  }
}
