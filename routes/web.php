<?php

use Inertia\Inertia;
use App\Models\Comment;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ChirpController;
use App\Http\Controllers\InboxController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FriendsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserProfilePageController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
  return Inertia::render('public/Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
  ]);
});

Route::get('/dashboard', function () {
  return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


//Profile page settings
Route::middleware('auth')->group(function () {
  Route::get('/profile/settings', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile/settings', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile/destroy', [ProfileController::class, 'destroy'])->name('profile.destroy');
  Route::get('/profile/inbox', [InboxController::class, 'index'])->name('profile.inbox');
  Route::post('/profile/settings/image', [ProfileController::class, 'profileImage'])->name('profile.profileimage');
  Route::post('/profile/settings', [ProfileController::class, 'profilecoverimage'])->name('profile.profilecoverimage');
});

//User Profile Page
Route::middleware('auth')->group(function () {
  Route::get('/profile/{userid}/', [UserProfilePageController::class, 'view'])->name('Profile.UserProfile');
});

//Chirps
Route::resource('chirps', ChirpController::class)
  ->only(['index', 'store', 'update', 'destroy'])
  ->middleware(['auth', 'verified']);

//Chirps Comments
Route::resource('comments', CommentController::class)
  ->only(['index', 'getComments', 'store', 'destroy'])
  ->middleware(['auth', 'verified']);

Route::middleware('auth')->group(function () {
  Route::get('/comments/{chirpid}/', [CommentController::class, 'getComments'])->name('comments.getComments');
});


//Like chirp
Route::middleware('auth')->group(function () {
  Route::post('/chirps/{chirp}', [ChirpController::class, 'likeChirp'])->name('chirps.like');
});

//Like comment 
Route::middleware('auth')->group(function () {
  Route::post('/comments/{commentsid}/', [CommentController::class, 'likeComment'])->name('comment.like');
});

//Friends
Route::middleware('auth')->group(function () {
  Route::get('/friends', [FriendsController::class, 'index'])->name('friends.index');
  Route::get('/user/{userId}/friends', [FriendsController::class, 'getUserFriends']);
  Route::post('/friends/add/', [FriendsController::class, 'store'])->name('friends.add');
});




require __DIR__ . '/auth.php';
