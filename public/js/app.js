var app = angular.module("App",["ui.bootstrap", "ngRoute", "service.backend"]);


app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider){
    $routeProvider
        .when('/inventory', {
            templateUrl: 'view/inventory.html',
            controller: function($scope) {$scope.classname="error"}
        })
        .when('/archive', {
            templateUrl: 'view/archive.html',
            controller: function($scope) {$scope.classname="error"}
        })
        .when('/people', {
            template: '<div class="box" ng-class="classname">people</div>',
            controller: function($scope) {$scope.classname="error"}
        }).
        otherwise({redirectTo: '/inventory/'});

    // $locationProvider.html5Mode(true);

}]);

app.controller("pageController",["$scope", "backend", "$location", function($scope, backend, $location){

    // do all the stuff you need to hav te page ready

    backend.init();
    
    $scope.pageReady = false;
    $scope.loadingProgress = 0;
    $scope.loadingMax = 100;

    $scope.pageRoute = "/";

    $scope.$on("backendLoading", function () {
        $scope.pageReady = false;
        $scope.loadingProgress = backend.loadingProgress;
    });
    $scope.$on("backendReady",function(){
        $scope.pageReady = true;
    });


    $scope.pageList = [
        {url:'/inventory/', name: 'Inventar'},
        {url:'/archive/', name: 'Archiv'},
        {url:'/people/', name: 'Personen'},
        {url:'/settings/', name: 'Einstellungen'}

    ];
    $scope.isActivePage = function(page){
        return page.url === $location.path();
    }
    $scope.location = $location;

}]);

app.controller("listController",["$scope","backend",function($scope,backend){
    $scope.itemList = backend.itemList;

    var updateItemList = function(){
        $scope.itemList = backend.itemList;
    };

    $scope.$on("updateInventory", updateItemList );
    $scope.$on("backendReady", updateItemList);

    $scope.selectItem = function(id){
        backend.selectItem(id);
    }
}]);

app.controller("itemController",["$scope","backend",function($scope, backend){
    var defaultItem = {id:"#ID", title:"Objekt"};
    $scope.item = defaultItem;
    $scope.itemReady = false;
    $scope.itemStatusText = "keine Daten ausgewählt";
    $scope.statusList = [];
    $scope.personList = [];

    $scope.$on("backendReady", function(){
        $scope.statusList = backend.statusList;
        $scope.personList = backend.personList;
        $scope.personList.unshift({id:null, name:"Niemand"});
    });

    $scope.$on("selectItem", function(){
        $scope.item = defaultItem;
        $scope.itemReady = false;
        $scope.itemStatusText = "Daten werden geladen...";
    });

    $scope.$on("updateItem", function(){
        $scope.item = backend.item;
        $scope.itemReady = true;
        $scope.itemStatusText = "Daten sind aktuell";
    });

    $scope.saveItem = function(data){
        backend.saveItem(data);
        $scope.itemStatusText = "Daten werden gespeichert...";
    };

    backend.checkReady();
}]);