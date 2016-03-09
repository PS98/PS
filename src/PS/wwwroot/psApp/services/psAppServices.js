angular.module("psApp").factory("psDataServices", ["$http", function ($http) {
    var _getAllCarColletion = function () {
     return  $http.get("/api/car");
    };

        return { 
            getAllCarColletion: _getAllCarColletion,
        }
          
    
}])