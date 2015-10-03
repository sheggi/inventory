<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Persons extends Model
{
    protected $fillable = ['status','name'];

    public $incrementing = false;


    public function scopeHasStatus($query, $status)
    {
        return $query->where('status',$status);
    }

    public static function newId(){
        $newId = "";
        for($i = 0; $i < 500; $i++){
            $newId = "U";
            $characters ="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            $charactersLength = strlen($characters);
            for ($s = 0; $s < 2; $s++) {
                $newId .= $characters[rand(0, $charactersLength - 1)];
            }
            if(!Persons::find($newId)){
                return $newId;
            }
        }
    }
}
