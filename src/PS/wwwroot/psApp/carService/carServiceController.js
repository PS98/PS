angular.module("psApp").controller("carServiceController",["$scope","psDataServices", function ($scope,psDataServices) {
  
     psDataServices.getAllCarColletion().
        success(function (data) {
            $scope.carCollections = data;
        }).error(function(){
        });

    psDataServices.getCarType("Mahindra").
         success(function (data) {
             $scope.carTypes = data;
         }).error(function () {
         });
    psDataServices.getCarVarient("Mahindra","Verito").
          success(function (data) {
              $scope.carVarient = data;
          }).error(function () {
          });
     
}]);