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

    var _getServiceCentreCity = function (city) {
        return $http.get("/api/ServiceCentre/");
    }
    
    var _getServiceCentreArea = function (city) {
        return $http.get("/api/ServiceCentre/" + city);
    }
    var _getServiceCentreList = function (city, area) {
        return $http.get("/api/ServiceCentre/"+ city +"/"+ area );
    }
    var _getAllService = function (city, area) {
        return $http.get("/api/services/all");
    }
    return {
        getAllCarColletion: _getAllCarCollection,
        getCarType: _getCarType,
        getCarVarient: _getCarVarient,
        getServiceCentreCity:_getServiceCentreCity,
        getServiceCentreArea: _getServiceCentreArea,
        getServiceCentreList: _getServiceCentreList,
        getAllService: _getAllService,

}
          
    
}])