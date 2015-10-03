<?php

namespace App\Http\Controllers;

use App\Items;
use App\Persons;
use App\States;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PersonsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->success(Persons::all());
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = new Persons($request->all());
        $data->id = Persons::newId();

        if(isset($data->status) && $status = States::find($data->status)){
            $data->status = $status->id;
        } else {
            $data->status = 2; //default value;
        }

        if($data->save()){
            return response()->json($data);
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
        $data = Persons::find($id);

        if($data){
            return response()->json($data);
        } else {
            return $this->error("No person with this id");
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
        $data = Persons::find($id);

        if($data){

            if($request->has('name')) {
                $data->name = $request->input('name');
            }
            if($request->has('status') && $status = States::find($request->input('status'))){
                $data->status = $status->id;
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
        $data = Persons::find($id);
        if($data) {
            if (Items::hasUser($data->id)->first()) {
                return $this->error("there is still an item allocated to his person");
            } else {
                $data->delete();
                return $this->success($data);
            }
        } else {
            return $this->error("No item with this id");
        }
    }
}
