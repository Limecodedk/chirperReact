<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;

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
    if ($request->hasFile('profileImageUrl')) {
      // Slet det eksisterende billede
      if ($request->user()->profile_Image_Url) {
        Storage::disk('public')->delete($request->user()->profile_Image_Url);
      }

      // Gem det nye billede
      $imagePath = $request->file('profileImageUrl')->store('profileImageUrl', 'public');
      $request->user()->profile_Image_Url = $imagePath;
      $request->user()->save();
    }

    return redirect()->route('profile.edit');
  }

  /**
   * Upload profile cover image
   */
  public function profileCoverImage(Request $request): RedirectResponse
  {
    if ($request->hasFile('profilecoverimage')) {
      // Slet det eksisterende cover-billede
      if ($request->user()->profile_cover_image) {
        Storage::disk('public')->delete($request->user()->profile_cover_image);
      }

      // Gem det nye cover-billede
      $imagePath = $request->file('profilecoverimage')->store('profilecoverimage', 'public');
      $request->user()->profile_cover_image = $imagePath;
      $request->user()->save();
    }

    return redirect()->route('profile.edit');
  }



  /**
   * Delete the user's account.
   */
  public function destroy(Request $request): RedirectResponse
  {
    $request->validate([
      'password' => ['required', 'current_password'],
    ]);

    if ($request->user()->profile_Image_Url) {
      Storage::disk('public')->delete($request->user()->profile_Image_Url);
    }

    if ($request->user()->profile_cover_image) {
      Storage::disk('public')->delete($request->user()->profile_cover_image);
    }

    $user = $request->user();

    Auth::logout();

    $user->delete();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return Redirect::to('/');
  }
}
