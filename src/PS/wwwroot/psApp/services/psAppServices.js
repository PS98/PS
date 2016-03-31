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
    var _getCentreArea = function (city) {
        return $http.get("/api/ServiceCentre/" + city);
    }
    var _getCentreDetails = function (city, area) {
        return $http.get("/api/ServiceCentre", { params: { "city": city, "area": area } });
    }

    return {
        getAllCarColletion: _getAllCarCollection,
        getCarType: _getCarType,
        getCarVarient: _getCarVarient,
        getCentreArea: _getCentreArea,
        getCentreDetails: _getCentreDetails
}
          
    
}])