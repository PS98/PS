var module = angular.module("carDetails").controller("carDetailsController", ["$scope", "$http", "carDetailsService", carDetailsController]);

function carDetailsController($scope, $http, carDetailsService) {
   
    if (carDetailsService) {
  //      $scope.isBusy = true;
        carDetailsService.getCarDetails()
         .then(function (result) {
             //Success
             $scope.carDetails = result;
             console.log(result);
         }, function () {
             //Error
             alert("Could not load grid data.");
         }).finally(function () {
           //  $scope.isBusy = true;
         });
    }
}