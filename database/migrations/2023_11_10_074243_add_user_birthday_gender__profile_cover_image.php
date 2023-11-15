<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up()
  {
    Schema::table('users', function (Blueprint $table) {
      $table->date('birthday')->nullable();
      $table->string('gender')->nullable();
      $table->string('profile_cover_image')->nullable();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down()
  {
    Schema::table('users', function (Blueprint $table) {
      $table->dropColumn(['birthday', 'gender', 'profile_cover_image']);
    });
  }
};
