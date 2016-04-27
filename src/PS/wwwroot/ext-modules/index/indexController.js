"use strict";

angular.module("index").controller("indexController",
    ["$localStorage", "$location", "$scope", "$http", "indexDataService", "psLoginService", "$timeout",
        function indexController($localStorage, $location, $scope, $http, indexDataService, psLoginService, $timeout) {
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

            $scope.fSuccess = false;
            $scope.fError = false;
            $scope.contactUs = function () {
                indexDataService.feedback($scope.firstName, $scope.lastName, $scope.phone, $scope.subject, $scope.message)
                    .then(function (result) {
                        //Success
                        if (result.status == 0) {
                            $scope.fSuccess = true;
                            $scope.fError = false;
                            $scope.successMessage = result.message;
                        } else if (result.status == 1) {
                            $scope.fError = true;
                            $scope.fSuccess = false;
                            $scope.errorMessage = result.message;
                        }
                    }, function (error) {
                        //Error
                        $scope.fError = true;
                        $scope.fSuccess = false;
                        $scope.errorMessage = error.message;
                    }).finally(function () {
                        $scope.isBusy = false;
                        $scope.feedbackForm.firstName.$dirty = false;
                        $scope.feedbackForm.lastName.$dirty = false;
                        $scope.feedbackForm.mobile.$dirty = false;
                        $scope.feedbackForm.subject.$dirty = false;
                        $scope.feedbackForm.message.$dirty = false;
                        $scope.firstName = null;
                        $scope.lastName = null;
                        $scope.mobile = null;
                        $scope.subject = null;
                        $scope.message = null;
                        $timeout(function () {
                            $scope.fReset();
                        }, 3000);
                    });
            }

            $scope.fReset = function () {
                $scope.fSuccess = false;
                $scope.fError = false;
            }



             $scope.resetSubscriberAfterSubmit = function () {
                 $scope.remail = null;       
                 $scope.rname = null;
        
       
                 $scope.subForm.remail.$dirty = false;
       
                 $scope.subForm.rname.$dirty = false;
      
             }

             $scope.subReset = function () {
                 $scope.regSuccess = false;
                 $scope.regError = false;
                 $scope.reqSuccess = false;
                 $scope.reqError = false;
             }

            //subscribe function

             $scope.subscribe = function () {
                 $("#subscribeModal").modal('toggle');
                 psLoginService.subscribe($scope.subName, $scope.subEmail)
                     .then(function (result) {
                         //Success
                         
                         if (result.status == 0) {
                             $scope.resetSubscriberAfterSubmit();
                             $scope.regSuccess = true;
                             $scope.regError = false;
                             $scope.successMessage = result.message;
                             debugger;
                             $(".subscriptionMessage").text($scope.successMessage);
                         } else if (result.status == 1 || result.status == 2) {
                             $scope.regError = true;
                             $scope.regSuccess = false;
                             $scope.again = false;
                             $scope.errorMessage = result.message;
                         }
                     }, function (error) {
                         //Error
                         $scope.regError = false;
                         $scope.errorMessage = error.message;
                         debugger;
                         $(".subscriptionMessage").text($scope.errorMessage);
                     }).finally(function () {
                         $scope.isBusy = false;
                         $timeout(function () {
                             $scope.subReset();
                         }, 3000);
                     });




             }
           
 }]);