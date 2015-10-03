<?php

namespace App\Http\Controllers;

use App\Items;
use App\Persons;
use App\States;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class StatesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->success(States::all());
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = new States($request->all());
        if($data->save()) {
            return $this->success($data);
        } else {
            return $this->error("Culdn't create new state");
        }
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if(States::isProtected($id)) {
            return $this->error("This item is protected");
        }
        $data = States::find($id);
        if($data && $request->input('state')){
            $data->state = $request->input('state');
            $data->save();
            return $this->success($data);
        } else {
            return $this->error("wrong id or no state set");
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(States::isProtected($id)) {
            return $this->error("This item is protected");
        }

        if(sizeof(States::all()) <= 2){
            return $this->error("Do you really want to delete all States? In which state are you?!");
        }

        if(Items::hasStatus($id) || Persons::hasStatus($id)){
            return $this->error("Do you really want to delete all States? In which state are you?!");
        }

        $data = States::find($id);
        if($data) {
            $data->delete();
            return $this->success($data);
        } else {
            return $this->error("Item doesn't exist");
        }
    }


}
