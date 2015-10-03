<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return Redirect::to('index.html'); // this part belongs to AngularJS
});

// Route group for API versioning
Route::group(array('prefix' => 'api/v1'), function () {
    Route::resource('states', 'StatesController', ['only' => ['index', 'store', 'update', 'destroy']]);
    Route::resource('persons', 'PersonsController', ['only' => ['index', 'store', 'show', 'update', 'destroy']]);
    Route::resource('items', 'ItemsController', ['only' => ['index', 'store', 'show', 'update', 'destroy']]);
});
