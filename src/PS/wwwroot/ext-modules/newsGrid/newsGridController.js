"use strict";

var module = angular.module("newsGrid").controller("newsGridController", [newsGridController]);
function newsGridController($scope, $http, dataService) {
   // $scope.data = dataService;
    $scope.isBusy = true;

    if (dataService) {
        $scope.isBusy = true;
        dataService.getNewsGrid()
         .then(function (result) {
             //Success
             debugger;
         }, function () {
             //Error
             alert("Could not load grid data.");
         }).finally(function () {
             $scope.isBusy = true;
         });
    }
}