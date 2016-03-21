"use strict";

angular.module("psApp").directive("psUserProfile", ["$rootScope", function ($rootScope) {
    return {
        controller: "sho",
        templateUrl: "psApp/userProfile/userProfileTemplate.html",
        replace:true,
        link: function (scope, el, ctrl, attr) {            
           
    }
    };
}]).controller("sho", ["$scope", "$timeout", "$location", "psLoginService", function sho($scope, $timeout, $location, psLoginService) {
    $scope.isVisible = false;
    var loc = $location.search();
    if (loc.code != null && loc.code != undefined) {
        psLoginService.socialCallback($location.search())
         .then(function (result) {
            //Success
             alert(result);
        }, function (error) {
            //Error
        }).finally(function () {
             $scope.isBusy = false;
        });
    }

}]);