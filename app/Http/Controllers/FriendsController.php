<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;

class FriendsController extends Controller
{
  public function index()
  {
    $user = auth()->user();
    $friends = $user->friends;
    $friendRequests = $user->friendRequests;

    return response()->json([
      'friends' => $friends,
      'friend_requests' => $friendRequests,
    ]);
  }

  //Show friends
  public function showmyfriends()
  {
    $user = auth()->user();
    $friendRequests = $user->friendRequests;

    return Inertia::render('Profile/Friends/AllFriends', [
      'user' => $user,
      'friend_requests' => $friendRequests,
    ]);
  }

  //Show Users friends
  public function getUserFriends(User $user)
  {
    $friends = $user->friends;
    $friendRequests = $user->friendRequests;

    return response()->json([
      'friends' => $friends,
      'friend_requests' => $friendRequests,
    ]);
  }

  //Friends
  public function store(Request $request)
  {
    // gem nyt venskab
    $user1 = auth()->user();
    $user2 = User::find($request->input('friendsId'));


    $existingFriendship = $user1->friends()->where('friend_id', $user2->id)->first();

    if (!$existingFriendship) {
      // Friendship does not exist, create it
      $user1->friends()->attach($user2->id, ['created_at' => now()]);
      $user2->friends()->attach($user1->id, ['created_at' => now()]);
    }
  }

  // accepter venskab / update pivot
  public function update(User $user)
  {
    $user = auth()->user();

    $user->friends()->updateExistingPivot($user->id, ['accepted_at' => now()]);

    return response()->json([
      'message' => 'Friend request accepted successfully',
    ]);
  }

  public function delete(User $user)
  {
    $authUser = auth()->user();
    $authUser->friends()->detach($user->id);
    $user->friends()->detach($authUser->id);
  }
}
