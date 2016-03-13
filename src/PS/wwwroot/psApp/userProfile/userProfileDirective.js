"use strict";

angular.module("psApp").directive("psUserProfile", ["$rootScope", function ($rootScope) {
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
}]).controller("sho", ["$scope", "$timeout", function sho($scope, $timeout) {
    $scope.isVisible = false;
    
                $timeout(function () {
                    $scope.$on("ps-user-profile-show", function (evt, data) {
                        $scope.isLoggedIn = data.isLoggedIn;
                        $scope.userName = data.userName;
                    });
                    $scope.$apply();
                
     });
}]);