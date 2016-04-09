"use strict";

angular.module("index").controller("indexController",
    ["$localStorage", "$location", "$scope", "$http", "indexDataService",
        function indexController($localStorage, $location, $scope, $http, indexDataService) {
            if (indexDataService) {
                //      $scope.isBusy = true;
                indexDataService.getHighlights()
                 .then(function (result) {
                     //Success
                     $scope.highlightsList = result;
                 }, function () {
                     //Error
                     console.log("Could not load highlights data.");
                 }).finally(function () {
                     //  $scope.isBusy = true;
                 });

                indexDataService.getPrivacyPolicy()
                 .then(function (result) {
                     //Success
                     $scope.privacyPolicyList = result;
                 }, function () {
                     //Error
                     console.log("Could not load privacy policy data.");
                 }).finally(function () {
                     //  $scope.isBusy = true;
                 });

                indexDataService.getTerms()
                 .then(function (result) {
                     //Success
                     $scope.termsList = result;
                 }, function () {
                     //Error
                     console.log("Could not load terms data.");
                 }).finally(function () {
                     //  $scope.isBusy = true;
                 });

                indexDataService.getAboutUs()
                 .then(function (result) {
                     //Success
                     $scope.aboutUsList = result;
                 }, function () {
                     //Error
                     console.log("Could not load about us data.");
                 }).finally(function () {
                     //  $scope.isBusy = true;
                 });

                indexDataService.getMainFeatures()
                 .then(function (result) {
                     //Success
                     $scope.mainFeatureList = result;
                 }, function () {
                     //Error
                     console.log("Could not load main feature data.");
                 }).finally(function () {
                     //  $scope.isBusy = true;
                 });
            }
 }]);