angular.module("psApp").controller("headerContentController", ["$scope", "$window", "psLoginService", function ($scope, $window, psLoginService) {

    $scope.loginSubmit = function () {
        debugger;
        $scope.data = {
            Email: $scope.Email,
            Password: $scope.Password
        },
        psLoginService.login($scope.Email, $scope.Password)
            .then(function (result) {
                //Success
                $window.location = "/";
            }, function () {
                //Error
                alert("Could not load topics.");
            }).finally(function () {
                $scope.isBusy = false;
            });

    }
}]);