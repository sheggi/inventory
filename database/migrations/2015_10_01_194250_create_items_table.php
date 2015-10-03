<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('items', function (Blueprint $table) {
            $table->string('id',3)->primary();
            $table->string('title');
            $table->text('description')->default("");
            $table->integer('status')->unsigned()->default(2);
            $table->foreign('status')->references('id')->on('states')->onUpdate('cascade');
            $table->string('user_id',3)->nullable();
            $table->foreign('user_id')->references('id')->on('persons')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('items');
    }
}
