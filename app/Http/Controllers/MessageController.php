<?php

namespace App\Http\Controllers;

use Log;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
  public function index(User $user)
  {
    // Logik til at hente og vise alle beskeder
    $messages = Message::all();
    $user = auth()->user();

    return Inertia::render('Messages/MessagesInbox', [
      'user' => $user,
      'messages' => $messages,
      'userProfileImage' => $user->profile_image_url,
    ]);
  }


  public function show(User $user, $type = 'inbox')
  {
    // Hent brugerens ID og navn
    $userId = $user->id;
    $userName = $user->name;

    // Definer variablerne for profilbillede og afsenderens navn
    $profileImageUrl = null;
    $senderName = null;

    // Afhængig af $type, hent enten indgående eller udgående beskeder
    if ($type === 'inbox') {
      $messages = Message::where('receiver_id', $userId)->get();
      // Hent profilbillede og afsenderens navn baseret på den første besked i indbakken
      $firstMessage = $messages->first();
      if ($firstMessage) {
        $senderId = $firstMessage->sender_id;
        $sender = User::find($senderId);
        $profileImageUrl = $sender->profile_Image_Url;
        $senderName = $sender->name;
      }
    } elseif ($type === 'sent') {
      $messages = Message::where('sender_id', $userId)->get();
      // Hent modtagerens navn baseret på den første besked i sendte
      $firstMessage = $messages->first();
      if ($firstMessage) {
        $receiverId = $firstMessage->receiver_id;
        $receiver = User::find($receiverId);
        $profileImageUrl = $receiver->profile_Image_Url;
      }
    } else {
      // Håndter ugyldig type
      return response()->json(['error' => 'Invalid message type'], 400);
    }

    return response()->json([
      'messages' => $messages,
      'profileImageUrl' => $profileImageUrl,
      'senderName' => $senderName,
    ]);
  }



  public function viewConversations()
  {
    try {
      // Hent alle unikke samtaler for den autentificerede bruger
      $user = auth()->user();
      $conversations = Message::select('sender_id', 'receiver_id')
        ->where('sender_id', $user->id)
        ->orWhere('receiver_id', $user->id)
        ->groupBy('sender_id', 'receiver_id')
        ->get();

      // Hent seneste besked for hver unikke samtale
      $conversationData = [];
      foreach ($conversations as $conversation) {
        $otherUserId = $conversation->sender_id === $user->id ? $conversation->receiver_id : $conversation->sender_id;
        $otherUser = User::find($otherUserId);

        if ($otherUser) {
          $latestMessage = Message::where(function ($query) use ($user, $otherUserId) {
            $query->where('sender_id', $user->id)
              ->where('receiver_id', $otherUserId);
          })->orWhere(function ($query) use ($user, $otherUserId) {
            $query->where('sender_id', $otherUserId)
              ->where('receiver_id', $user->id);
          })->orderBy('created_at', 'desc')->first();

          if ($latestMessage) {
            $conversationData[] = [
              'otherUserName' => $otherUser->name,
              'otherUserProfileImageUrl' => $otherUser->profile_Image_Url,
              'lastMessageDate' => $latestMessage->created_at->toDateTimeString(),
              'lastMessageContent' => $latestMessage->content,
              'receiver_id' => $latestMessage->receiver_id,
            ];
          }
        }
      }

      return response()->json(['conversations' => $conversationData]);
    } catch (\Exception $e) {
      // Log fejlen
      \Log::error('Error in viewConversations: ' . $e->getMessage());

      // Returner en fejlrespons
      return response()->json(['error' => 'Internal Server Error'], 500);
    }
  }





  public function store(Request $request)
  {
    $request->validate([
      'content' => 'required|string',
    ]);

    $message = new Message();
    $message->content = $request->input('content');
    $message->sender_id = auth()->id();
    $message->receiver_id = $request->input('receiver_id'); // Du skal tilføje logik for at få den ønskede receiver_id

    $message->save();
    return Inertia::render('/messages', [
      'message' => 'Besked oprettet succesfuldt'
    ]);
  }


  public function update(Request $request, $id)
  {
    // Logik til at opdatere en eksisterende besked baseret på indholdet af $request og $id
  }
}
