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

  public function getUserFriends($userId)
  {
    $user = User::find($userId);
    $friends = $user->friends;
    $friendRequests = $user->friendRequests;

    return response()->json([
      'friends' => $friends,
      'friend_requests' => $friendRequests,
    ]);
  }

  public function store(Request $request)
  {
    /*     dd($request->all()); */
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

  public function update()
  {
    // accepter venskab / update pivot
  }

  public function destroy()
  {
    // slet venskab / detach
  }
}
