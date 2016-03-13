angular.module("psApp").controller("headerContentController", ["$scope", "$localStorage", "$location", "$rootScope", "psLoginService",
function ($scope, $localStorage, $location,$rootScope, psLoginService) {
    $scope.isBusy = true;
    $scope.isLoggedIn = false;
    $scope.loginError = false;
    $scope.regError = false;
    $scope.regSuccess = false;
    $scope.loginSubmit = function () {
       
        psLoginService.login($scope.Email, $scope.Password)
            .then(function (result) {
                //Success
                if (result.message) {
                    $scope.loginError = true;
                    $scope.message = result.message;
                }
                else if (result.result) {
                    $scope.userName = result.result;
                    $scope.isLoggedIn = true;
                    $scope.loginError = false;
                    $localStorage.userName = result;
                    $rootScope.$broadcast("ps-user-profile-show",
                       {
                           isLoggedIn: $scope.isLoggedIn,
                           userName: $scope.userName
                       });
                    // $modalInstance.close();
                }
            }, function (error) {
                //Error
                $scope.isLoggedIn = false;
                $scope.loginError = true;
                $scope.message = error.message;
            }).finally(function () {
                $scope.isBusy = false;
            });
    }

    $scope.registerSubmit = function () {
        if ($scope.regPassword == $scope.cnfPassword) {
            psLoginService.register($scope.regUsername, $scope.regEmail, $scope.regPassword)
                .then(function (result) {
                    //Success
                    if (result.status == 0) {
                        $scope.regSuccess = true;
                        $scope.regError = false;
                        $scope.successMessage = result.message;
                    } else {
                        $scope.regError = true;
                        $scope.regSuccess = false;
                        $scope.errorMessage = result.message;
                    }
                }, function (error) {
                    //Error
                    $scope.regError = false;
                    $scope.errorMessage = error.message;
                }).finally(function () {
                    $scope.isBusy = false;
                });
        } else {
            $scope.regError = true;
            $scope.errorMessage = "Password doesn't match.";
        }
    }

    $scope.logout = function () {
        //  auth.signout();
        $scope.isLoggedIn = false;
        $localStorage.$reset();
        // $modalInstance.close();
    };
}]);