<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class States extends Model
{
    protected $fillable = ['state'];

    public $timestamps = false;

    /**
     * @param null $id
     * @return bool
     */
    public static function isProtected($id = null){
        if($id === null) {
            return null;
        } else {
            if($id == 1 || $id == 2){
                return true;
            }
        }
        return false;
    }
}
