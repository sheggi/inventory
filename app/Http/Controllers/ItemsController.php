<?php

namespace App\Http\Controllers;

use App\Items;
use App\Persons;
use App\States;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->success(Items::all());
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = new Items($request->all());
        $data->id = Items::newId();

        if(!Persons::find($data->user_id)){
            return $this->error("Wrong Person#id");
        }

        if($data->save()){
            return $this->success($data);
        } else {
            return $this->error("Couldn't create new Person");
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = Items::find($id);

        if($data){
            return $this->success($data);
        } else {
            return $this->error("No item with this id");
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
        $data = Items::find($id);

        if($data){
            if($request->has('name')) {
                $data->name = $request->input('name');
            }
            if($request->has('status') && $status = States::find($request->input('status'))){
                $data->status = $status->id;
            }
            if($request->has('user_id') && $person = Persons::find($request->input('user_id'))){
                $data->user_id = $person->user_id;
            }
            if($request->has('description')){
                $data->description = $request->input('description');
            }


            if($data->save()) {
                return $this->success($data);
            } else {
                return $this->error("failed to save");
            }
        } else {
            return $this->error("No person with this id");
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
        $data = Items::find($id);

        if($data){
            $data->delete();
            return response()->json($data);
        } else {
            return $this->error("No item with this id");
        }

    }
}
