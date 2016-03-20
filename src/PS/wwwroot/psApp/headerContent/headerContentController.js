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

    $scope.forgotSubmit = function () {
        psLoginService.forgotPassword($scope.fgtEmail)
                .then(function (result) {
                    //Success
                    alert(result.message);
                }, function (error) {
                    //Error
                }).finally(function () {
                    $scope.isBusy = false;
                });
    }

    $scope.socialSubmit = function (name) {
        var fbHeight = /facebook/ig.test(name) ? 340 : 520;
        fbHeight = /paypal/ig.test(name) ? 550 : fbHeight;
        var w = /paypal/ig.test(name) ? 400 : 680;
        if (name) {
            psLoginService.socialLogin(name)
               .then(function (result) {
                   //Success
                   if (result && result.url) {
                       $scope.openwindow(result.url, "", w, fbHeight);
                   }
               }, function (error) {
                   //Error
               }).finally(function () {
                   $scope.isBusy = false;
               });
        } 
    }
    $scope.openwindow = function(url, name, iWidth, iHeight) {
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
        window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=yes,resizeable=no,location=no,status=no');
    }

    $scope.logout = function () {
        //  auth.signout();
        $scope.isLoggedIn = false;
        $localStorage.$reset();
        // $modalInstance.close();
    }
}]);