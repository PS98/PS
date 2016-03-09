angular.module("psApp").controller("carServiceController",["$scope","psDataServices", function ($scope,psDataServices) {
  
     psDataServices.getAllCarColletion().
        success(function (data) {
            $scope.carCollections = data;
        }).error(function(){
        });
}]);