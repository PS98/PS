"use strict";

var module = angular.module("newsDetails").controller("newsDetailsController", ["$scope", "$http", "newsDetailsService", newsDetailsController]);

function newsDetailsController($scope, $http, newsDetailsService) {
    // $scope.data = dataService;
    // $scope.isBusy = true;
    if (newsDetailsService) {
        //      $scope.isBusy = true;
        newsDetailsService.getNewsDetails()
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