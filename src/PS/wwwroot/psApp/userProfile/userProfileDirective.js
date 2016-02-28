"use strict";

angular.module("psApp").directive("psUserProfile", [function () {
    return {
        controller: "sho",
        templateUrl: "psApp/userProfile/userProfileTemplate.html",
        link: function (scope, el, ctrl, attr) {            
            
            scope.shobhit = function () {
                scope.isVisible = true;
            };
    }
    };
}]).controller("sho", ["$scope", function sho($scope) {
    $scope.isVisible = false;
}]);