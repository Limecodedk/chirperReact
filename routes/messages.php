<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;

Route::middleware('auth')->group(function () {

  Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');  // Route til at vise alle beskeder
  //Route::get('/messages/{id}', [MessageController::class, 'show'])->name('messages.show'); // Route til at vise en specifik besked
  Route::post('/messages/{id}', [MessageController::class, 'store'])->name('messages.store');  // Route til at oprette en ny besked
  Route::put('/messages/edit/{id}', [MessageController::class, 'update'])->name('messages.update'); // Route til at redigere en eksisterende besked
  Route::delete('/messages/delete/{id}', [MessageController::class, 'destroy'])->name('messages.destroy');  // Route til at slette en besked

  Route::get('/messages/{user}/{type}', [MessageController::class, 'show'])->name('messages.show');

  Route::get('/messages/viewconversations', [MessageController::class, 'viewConversations'])->name('viewconversations');
});
