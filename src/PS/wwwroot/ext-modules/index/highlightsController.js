"use strict";

var module = angular.module("index").controller("highlightsController", ["$scope", "$http", "indexDataService", highlightsController]);

function highlightsController($scope, $http, indexDataService) {
    // $scope.data = dataService;
    // $scope.isBusy = true;
    if (indexDataService) {
        //      $scope.isBusy = true;
        indexDataService.getHighlights()
         .then(function (result) {
             //Success
             $scope.highlightsList = result;
             console.log(result);
         }, function () {
             //Error
             alert("Could not load grid data.");
         }).finally(function () {
             //  $scope.isBusy = true;
         });
    }
}