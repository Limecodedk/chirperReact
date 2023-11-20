<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Models\User;

class UserProfilePageController extends Controller
{
  public function view(Request $request, User $user): \Inertia\Response
  {

    if (!$user) {
      return Redirect::to('/');
    }

    return Inertia::render('Profile/UserProfile', ['user' => $user]);
  }
}
