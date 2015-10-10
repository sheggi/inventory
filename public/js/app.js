var app = angular.module("App",["ui.bootstrap"]);

app.factory("businessLogic", ["$http",function($http){

    var urlItemBase = "http://localhost:8000/api/v1/items";
    urlItemBase = "http://localhost/inventory/public/api/v1/items";

    var getInventory = function(){
        return $http.get(urlItemBase);

      //return ["asdfs","asdasfd","adsfsaddddd"];
    };

    var getItem = function (id) {
        return $http.get(urlItemBase+"/"+id);
    };

    var saveItem = function(item){
        return $http.put(urlItemBase+"/"+item.id, item);
    };


    return {
        getInventory: getInventory,
        getItem: getItem,
        saveItem: saveItem
    };

}]);


app.controller("listController",["$scope","businessLogic",function($scope,businessLogic){
    $scope.inventoryList = [];
    businessLogic.getInventory().then(function(response){
        console.log(response);
        $scope.inventoryList = response.data.data;
    });
}]);

app.controller("itemController",["$scope","businessLogic",function($scope, businessLogic){
    $scope.item = {};

    businessLogic.getItem('XM2').then(function(response){
        console.log(response);
        $scope.item = response.data.data;
    });

    $scope.saveItem = function(data){
        businessLogic.saveItem(data).then(function(response){
            console.log(response);
        });
        console.log();
    };
}]);