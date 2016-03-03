"use strict";

var module = angular.module("newsDetails").controller("newsDetailsController", ["$scope", "$http", "dataService", newsDetailsController]);

function newsDetailsController($scope, $http, dataService) {
    // $scope.data = dataService;
    // $scope.isBusy = true;
    if (dataService) {
        //      $scope.isBusy = true;
        dataService.getNewsDetails()
         .then(function (result) {
             //Success
             $scope.detailsData = result;
             console.log(result);
         }, function () {
             //Error
             alert("Could not load details data.");
         }).finally(function () {
             //  $scope.isBusy = true;
         });
    }
}