<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Items extends Model
{

    protected $fillable = ['status','title','description','user_id'];

    public $incrementing = false;

    public function scopeHasUser($query, $user)
    {
        return $query->where('user_id',$user);
    }
    public function scopeHasStatus($query, $status)
    {
        return $query->where('status',$status);
    }

    public static function newId(){
        $newId = "";
        for($i = 0; $i < 500; $i++){
            $newId = "X";
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
