<?php

namespace App\Http\Controllers;

use App\Models\Chirp;
use Inertia\Inertia;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CommentController extends Controller
{

  public function index()
  {
    $comment = Comment::with('user:id,content')->latest()->get();

    return Inertia::render('Comments/Index', [
      'comment' => $comment,
    ]);
  }


  public function getComments(Chirp $chirpid)
  {
    $comments = $chirpid->comments;

    if ($comments) {
      $commentsData = $comments->map(function ($comment) {
        return [
          'content' => $comment->content,
          'created_at' =>  $comment->created_at,
          'userName' => $comment->user->name,
          'commentLike' => $comment->likes_count,
        ];
      });
    } else {
      $commentsData = [];
    }

    return response()->json(['comments' => $commentsData]);
  }



  /**
   * Create comment.
   *
   * @param  Request  $request
   * @return \Illuminate\Http\JsonResponse
   */
  /* public function store(Request $request)
  {
    $validatedData = $request->validate([
      'user_id' => 'required',
      'chirp_id' => 'required',
      'content' => 'required',
    ]);

    $comment = Comment::create($validatedData);

    return response()->json(['message' => 'Kommentar oprettet', 'comment' => $comment]);
  } */


  /**
   * Create comment.
   *
   * @param  Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'user_id' => 'required',
      'chirp_id' => 'required',
      'content' => 'required',
    ]);

    $comment = Comment::create($validatedData);

    if ($request->inertia()) {
      return Inertia::render('CreateComment', [
        'message' => 'Kommentar oprettet',
        'comment' => $comment,
      ]);
    }
  }


  public function likeComment(Comment $comment)
  {
    $comment->increment('likes_count');
  }



  /**
   * Delete comment.
   *
   * @param  Comment  $comment
   * @return \Illuminate\Http\JsonResponse
   */
  public function destroy(Comment $comment)
  {
    $comment->delete();

    return response()->json(['message' => 'Kommentar slettet']);
  }
}
