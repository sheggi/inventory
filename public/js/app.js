var app = angular.module("App",["ui.bootstrap"]);

app.factory("backendService", ["$http", "$rootScope",function($http, $rootScope){
    var backendService = {
        selectedItemId : null,  // FIXX do a function to protect property
        itemList : null,
        peopleList : null,
        statusList : null,
        item : null
    };
    
    backendService.loadingProgress = 0;
    var progress = {
        totalSteps: 0,
        steps: 0
    };

    // Preparing the Url parts for the backend
    var pathArray = window.location.pathname.split( '/' );
    var newPathname = "";
    var i;
    for (i = 0; i < pathArray.length - 1; i++) {
        if(i != 0) newPathname += "/";
        newPathname += pathArray[i];
    }
    var settings = {
        server : window.location.host,
        protocol: location.protocol + "//",
        api: {}
    };
    settings.api.url = settings.protocol + settings.server + newPathname + "/api/v1";
    settings.api.items = settings.api.url + "/items";
    settings.api.status = settings.api.url + "/states";
    settings.api.persons = settings.api.url + "/persons";
    console.log("Settings:",settings);

    //
    backendService.init = function () {
        progress.steps = 0;
        progress.totalSteps = 3;
        $http.get(settings.api.items).then(function(response){
            backendService.itemList = response.data.data;
            stepProgress();
        });
        $http.get(settings.api.status).then(function(response){
            backendService.statusList = response.data.data;
            stepProgress();
        });
        $http.get(settings.api.persons).then(function(response){
            backendService.personList = response.data.data;
            stepProgress();
        });
    };


    var stepProgress = function() {
        progress.steps++;
        backendService.loadingProgress = Math.round(progress.steps * 100  / progress.totalSteps);
        $rootScope.$broadcast("backendLoading"); console.log("backendLoading");

        if(backendService.loadingProgress == 100){

            $rootScope.$broadcast("backendReady"); console.log("backendReady", backendService);
        }
    };


    backendService.getItems = function(){
        $http.get(settings.api.items).then(function(response){
            backendService.itemList = response.data.data;
            $rootScope.$broadcast("updateInventory"); console.log("updateInventory");
        });
    };

    backendService.getItem = function (id) {
        $http.get(settings.api.items+"/"+id).then(function(response) {
            var item = response.data.data;

            // fulfill with linked data
            var matchingStatus = backendService.statusList.filter(function (val){
                return val.id === item.status;
            });
            if(matchingStatus.length == 1){
                item.status = matchingStatus[0];
            }


            var matchingPerson = backendService.personList.filter(function (val){
                return val.id === item.user_id;
            });
            if(matchingPerson.length == 1){
                item.user_id = matchingPerson[0];
            }

            backendService.item = item;
            $rootScope.$broadcast("updateItem"); console.log("updateItem")
        });
    };

    backendService.saveItem = function(item){

        // TODO clone item, so  local changes don't afect orginal

        // reduce linked data
        if(typeof(item.status) === "object"){
            item.status = item.status.id;
        }
        if(typeof(item.user_id) === "object"){
            item.user_id = item.user_id.id;
        }

        $http.put(settings.api.items+"/"+item.id, item).then(function(){
            backendService.getItems();
            backendService.getItem(item.id);
        });
    };


    backendService.selectItem = function (id) {
        backendService.selectedItemId = id;
        $rootScope.$broadcast("selectItem"); console.log("selectItem");
        backendService.getItem(backendService.selectedItemId);
    };

    return backendService;

}]);

app.controller("pageController",["$scope", "backendService", function($scope, backendService){

    // do all the stuff you need to hav te page ready

    backendService.init();
    
    $scope.pageReady = false;
    $scope.loadingProgress = 0;
    $scope.loadingMax = 100;

    $scope.pageRoute = "/";

    $scope.$on("backendLoading", function () {
        $scope.pageReady = false;
        $scope.loadingProgress = backendService.loadingProgress;
    });
    $scope.$on("backendReady",function(){
        $scope.pageReady = true;
    });



}]);

app.controller("listController",["$scope","backendService",function($scope,backendService){
    $scope.itemList = backendService.itemList;

    var updateItemList = function(){
        $scope.itemList = backendService.itemList;
    };

    $scope.$on("updateInventory", updateItemList );
    $scope.$on("backendReady", updateItemList);

    $scope.selectItem = function(id){
        backendService.selectItem(id);
    }
}]);

app.controller("itemController",["$scope","backendService",function($scope, backendService){
    var defaultItem = {id:"#ID", title:"Objekt"};
    $scope.item = defaultItem;
    $scope.itemReady = false;
    $scope.itemStatusText = "keine Daten ausgewählt";
    $scope.statusList = [];
    $scope.personList = [];

    $scope.$on("backendReady", function(){
        $scope.statusList = backendService.statusList;
        $scope.personList = backendService.personList;
        $scope.personList.unshift({id:null, name:"Niemand"});
    });

    $scope.$on("selectItem", function(){
        $scope.item = defaultItem;
        $scope.itemReady = false;
        $scope.itemStatusText = "Daten werden geladen...";
    });

    $scope.$on("updateItem", function(){
        $scope.item = backendService.item;
        $scope.itemReady = true;
        $scope.itemStatusText = "Daten sind aktuell";
    });

    $scope.saveItem = function(data){
        backendService.saveItem(data);
        $scope.itemStatusText = "Daten werden gespeichert...";
    };
}]);