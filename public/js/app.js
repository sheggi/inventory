var app = angular.module("App",["ui.bootstrap"]);

app.factory("businessLogic", ["$http",function($http){

    var getInventory = function(){
        return $http.get("http://localhost:8000/api/v1/items/");

      //return ["asdfs","asdasfd","adsfsaddddd"];
    };



    return {
        getInventory: getInventory
    };

}]);

app.controller("listController",["$scope","businessLogic",function($scope,businessLogic){
    $scope.inventoryList = [];
    businessLogic.getInventory().then(function(response){
        console.log(response);
        $scope.inventoryList = response.data.data;
    });
}]);