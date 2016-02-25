"use strict";

angular.module("index", ["auth0", "ngStorage"])
    .controller("indexController",
    ["$localStorage", "$location", "$scope", "auth",
        function indexController($localStorage, $location, $scope, auth) {
    $scope.auth = auth;
    $scope.isLoggedIn = false;

    $scope.login = function () {
        auth.signin({}, function (profile, token) {
            $scope.isLoggedIn = true;
            $localStorage.profile = profile;
            $localStorage.token = token;
            $location.path("/");
        }, function (error) {
            $scope.isLoggedIn = false;
            console.log("Error", error);
        });
    };

    $scope.logout = function () {
        auth.signout();
        $scope.isLoggedIn = false;
        $localStorage.$reset();
        $location.path("/");
    };
}]);