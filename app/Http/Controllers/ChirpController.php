<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\StoreChirpRequest;
use App\Models\Chirp;
use App\Models\Like;

class ChirpController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(): Response
  {
    return Inertia::render('Chirps/Index', [
      'chirps' => Chirp::with(['user:id,name,profile_Image_Url'])->latest()->get(),
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    //
  }

  /**
   * Store a newly created resource in storage.
   */
  /*   public function store(Request $request): RedirectResponse
  {
    $validated = $request->validate([
      'message' => 'required|string|max:255',
      'image' => 'nullable',
    ]);

    $user = $request->user();


    if ($request->hasFile('image')) {
      $imagePath = $request->file('image')->store('chirp_images', 'public');
      $validated['image'] = $imagePath;
    }

    $user->chirps()->create($validated);

    return redirect(route('chirps.index'));
  } */


  public function store(StoreChirpRequest $request): RedirectResponse
  {

    $user = $request->user();
    $data = $request->validated();

    if ($request->hasFile('image')) {
      $imagePath = $request->file('image')->store('chirp_images', 'public');
      $data = array_merge($request->validated(), ['image' => $imagePath]);
    }

    $user->chirps()->create($data);

    return redirect(route('chirps.index'));
  }


  /**
   * Display the specified resource.
   */
  public function show(Chirp $chirp)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Chirp $chirp)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Chirp $chirp): RedirectResponse
  {
    $this->authorize('update', $chirp);

    $validated = $request->validate([
      'message' => 'required|string|max:255',
    ]);

    $chirp->update($validated);

    return redirect(route('chirps.index'));
  }

  /**
   * Like Chirps
   */

  public function likeChirp(Chirp $chirp)
  {
    $chirp->increment('likes_count');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Chirp $chirp): RedirectResponse
  {
    $this->authorize('delete', $chirp);

    $chirp->delete();

    return redirect(route('chirps.index'));
  }
}
