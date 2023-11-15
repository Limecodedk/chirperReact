<?php

namespace App\Http\Controllers;

use App\Models\Chirp;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InboxController extends Controller
{
  /**
   * Handle the incoming request.
   */
  public function index(Request $request)
  {
    $chrips = Chirp::query()->where('reciever_id', auth()->id())->get();

    return Inertia::render('Inbox/Inbox', [
      'chirps' => $chrips
    ]);
  }
}
