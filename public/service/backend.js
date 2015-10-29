var app = angular.module("service.backend",[]);

app.factory("backend", ["$http", "$rootScope",function($http, $rootScope){
    var backend = {
        selectedItemId : null,  // FIXX do a function to protect property
        itemList : null,
        peopleList : null,
        statusList : null,
        item : null
    };

    backend.loadingProgress = 0;
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
    backend.init = function () {
        progress.steps = 0;
        progress.totalSteps = 3;
        $http.get(settings.api.items).then(function(response){
            backend.itemList = response.data.data;
            stepProgress();
        });
        $http.get(settings.api.status).then(function(response){
            backend.statusList = response.data.data;
            stepProgress();
        });
        $http.get(settings.api.persons).then(function(response){
            backend.personList = response.data.data;
            stepProgress();
        });
    };


    var stepProgress = function() {
        progress.steps++;
        backend.loadingProgress = Math.round(progress.steps * 100  / progress.totalSteps);
        $rootScope.$broadcast("backendLoading"); console.log("backendLoading");

        if(backend.loadingProgress == 100){

            $rootScope.$broadcast("backendReady"); console.log("backendReady", backend);
        }
    };

    backend.checkReady = function () {

        if(backend.loadingProgress == 100){

            $rootScope.$broadcast("backendReady"); console.log("checkedReady", backend);
        }
    };


    backend.getItems = function(){
        $http.get(settings.api.items).then(function(response){
            backend.itemList = response.data.data;
            $rootScope.$broadcast("updateInventory"); console.log("updateInventory");
        });
    };

    backend.getItem = function (id) {
        $http.get(settings.api.items+"/"+id).then(function(response) {
            var item = response.data.data;

            // fulfill with linked data
            var matchingStatus = backend.statusList.filter(function (val){
                return val.id === item.status;
            });
            if(matchingStatus.length == 1){
                item.status = matchingStatus[0];
            }


            var matchingPerson = backend.personList.filter(function (val){
                return val.id === item.user_id;
            });
            if(matchingPerson.length == 1){
                item.user_id = matchingPerson[0];
            }

            backend.item = item;
            $rootScope.$broadcast("updateItem"); console.log("updateItem")
        });
    };

    backend.saveItem = function(item){

        // TODO clone item, so  local changes don't afect orginal

        // reduce linked data
        if(typeof(item.status) === "object"){
            item.status = item.status.id;
        }
        if(typeof(item.user_id) === "object"){
            item.user_id = item.user_id.id;
        }

        $http.put(settings.api.items+"/"+item.id, item).then(function(){
            backend.getItems();
            backend.getItem(item.id);
        });
    };


    backend.selectItem = function (id) {
        backend.selectedItemId = id;
        $rootScope.$broadcast("selectItem"); console.log("selectItem");
        backend.getItem(backend.selectedItemId);
    };

    return backend;

}]);