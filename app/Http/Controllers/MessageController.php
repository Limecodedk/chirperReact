<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
  public function index()
  {
    // Logik til at hente og vise alle beskeder
    $messages = Message::all();
    $user = auth()->user();

    return Inertia::render('Messages/MessagesInbox', [
      'user' => $user,
      'messages' => $messages,
    ]);
  }


  public function show(User $user, $type = 'inbox')
  {
    // Hent brugerens ID
    $userId = $user->id;

    // Afhængig af $type, hent enten indgående eller udgående beskeder
    if ($type === 'inbox') {
      $messages = Message::where('receiver_id', $userId)->get();
    } elseif ($type === 'sent') {
      $messages = Message::where('sender_id', $userId)->get();
    } else {
      // Håndter ugyldig type, f.eks. kast en undtagelse eller returner en fejlmeddelelse
      return response()->json(['error' => 'Invalid message type'], 400);
    }

    return response()->json(['messages' => $messages]);
  }


  /*   public function show($sender_id)
  {
    // Logik til at vise en specifik besked baseret på $id
    $message = Message::where('sender_id', $sender_id)->first();
    
    if (!$message) {

      return response()->json(['message' => 'Besked blev ikke fundet'], 404);
    }

    return response()->json($message);
  } */


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

    return response()->json(['message' => 'Besked oprettet succesfuldt'], 201);
  }


  public function update(Request $request, $id)
  {
    // Logik til at opdatere en eksisterende besked baseret på indholdet af $request og $id
  }

  public function destroy($id)
  {
    // Logik til at slette en besked baseret på $id
  }
}
