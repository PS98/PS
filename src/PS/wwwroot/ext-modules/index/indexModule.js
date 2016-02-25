"use strict";

angular.module("index", ["auth0", "angular-storage", "angular-jwt", "ngStorage"])
    .controller("indexController",
    ["$scope", "auth", "$location",
        function indexController($scope, auth, $location, $localStorage) {
    $scope.auth = auth;
    $scope.isLoggedIn = false;

    $scope.login = function () {
        auth.signin({}, function (profile, token) {
            $localStorage.$default({ x: 43 });
            $localStorage.set("profile", profile);
            $localStorage.set("token", token);
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