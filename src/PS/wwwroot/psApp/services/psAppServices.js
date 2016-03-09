angular.module("psApp").factory("psDataServices", ["$http", function ($http) {
    var _getAllCarCollection = function () {
     return  $http.get("/api/car");
    };
    var _getCarType = function (collectionName) {
        return $http.get("/api/car/"+collectionName);
                 
        };
    var _getCarVarient = function (collectionName, carType) {
        return $http.get("/api/car/" + collectionName + "/" + carType);
    }


        return { 
            getAllCarColletion: _getAllCarCollection,
            getCarType:_getCarType,
            getCarVarient:_getCarVarient,
        }
          
    
}])