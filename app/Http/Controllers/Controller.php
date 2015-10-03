<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Api Success Response with data
     * @param $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function success($data){
        return response()->json(["success"=>true,"data"=>$data]);
    }

    /**
     * Api Error Response with message
     * @param $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function error($message){
        return response()->json(["error"=>true,"message"=>$message]);
    }
}
