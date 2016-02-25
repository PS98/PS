"use strict";

angular.module("index", ["auth0", "angular-storage", "angular-jwt"])
    .controller("indexController",
    ["$scope", "auth", "$location",
        function indexController($scope, auth, $location) {
    $scope.auth = auth;
    $scope.isLoggedIn = false;

    $scope.login = function () {
        auth.signin({}, function (profile, token) {
            $scope.isLoggedIn = true;
            $location.path("/");
        }, function (error) {
            $scope.isLoggedIn = false;
            console.log("Error", error);
        });
    };

    $scope.logout = function () {
        auth.signout();
        $scope.isLoggedIn = false;
        $location.path("/");
    };
}]);