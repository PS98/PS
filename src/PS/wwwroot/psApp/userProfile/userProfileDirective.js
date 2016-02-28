"use strict";

angular.module("psApp").directive("psUserProfile", ["$document", function ($document) {
    return {
        controller: "sho",
        templateUrl: "psApp/userProfile/userProfileTemplate.html",
        link: function (scope, el, ctrl, attr) {            
            
            scope.shobhit = function ($event) {                 
                
                if (!scope.showMenu) {
                   
                    scope.showMenu = true;
                } else {
                    scope.showMenu = false;
                }
            };
    }
    };
}]).controller("sho", ["$scope", function sho($scope) {
    $scope.isVisible = false;
}]);