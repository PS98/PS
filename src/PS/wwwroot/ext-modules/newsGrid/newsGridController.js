"use strict";

var module = angular.module("newsGrid").controller("newsGridController", ["$scope", "$http", "dataService", newsGridController]);

function newsGridController($scope, $http, dataService) {
   // $scope.data = dataService;
   // $scope.isBusy = true;
    if (dataService) {
  //      $scope.isBusy = true;
        dataService.getNewsGrid()
         .then(function (result) {
             //Success
             console.log(result);
         }, function () {
             //Error
             alert("Could not load grid data.");
         }).finally(function () {
           //  $scope.isBusy = true;
         });
    }
}