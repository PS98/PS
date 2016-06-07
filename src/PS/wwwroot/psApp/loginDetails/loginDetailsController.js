angular.module("psApp").controller("loginDetailsController", ["$scope", "$localStorage", "$location","$window", "$rootScope","$timeout","psLoginService","psDataServices", "$state", '$cookies','$cookieStore',
function ($scope, $localStorage, $location,$window, $rootScope, $timeout, psLoginService, psDataServices, $state, $cookies, $cookieStore) {
    $scope.isBusy = true;
  //  $scope.isLoggedIn = false;
    $scope.loginError = false;
    $scope.regError = false;
    $scope.regSuccess = false;
    $scope.again = false;
    

    $scope.TCRedirection = function (url, name) {
        $window.open(url, name);
    }

    $scope.loginSubmit = function () {     
        psLoginService.login($scope.Email, $scope.Password)
            .then(function (result) {
                //Success
                $scope.userDetails = {};
                if (result.status == 1 || result.status == 2) {
                    $scope.loginError = true;
                    $scope.message = result.message;
                    $scope.isLoggedIn = false;
                    psLoginService.setUserAuthenticated(false);
                }
                else if (result.status == 0) {
                    $scope.resetAfterSubmit();
                    $cookieStore.put("XSRF-TOKEN", result.access_Token);
                    $scope.userDetails.firstName = result.result[1];
                    $scope.userDetails.lastName = result.result[2];
                    $scope.userDetails.userName = $scope.userDetails.firstName + " " + $scope.userDetails.lastName;
                    $scope.userDetails.imageUrl = "/assets/img/icon-user-default.png";
                    $scope.userDetails.email = result.result[0];
                    $scope.userDetails.phoneNo = result.result[3];
                    $scope.userDetails.customerType = "M";
                    $scope.isLoggedIn = true;
                    $scope.loginError = false;
                    psDataServices.setuserDetails($scope.userDetails);
                    psLoginService.setUserAuthenticated(true);
                    $("#loginModal").modal('toggle');
                }
            }, function (error) {
                //Error
                $scope.isLoggedIn = false;
                $scope.loginError = true;
                $scope.message = error.message;
                psLoginService.setUserAuthenticated(false);
            }).finally(function () {
                $scope.isBusy = false;
                $scope.Password = null;
                $scope.loginForm.password.$dirty = false;
                $rootScope.$broadcast("ps-user-profile-show",
                       {
                           isLoggedIn: $scope.isLoggedIn,
                           userDetails: $scope.userDetails
                       });
                $timeout(function () {
                    $scope.logReset();
                }, 3000);
            });
    }

    $scope.logReset = function () {
        $scope.loginError = false;
    }



    $scope.registerSubmit = function () {
        if ($scope.regPassword == $scope.cnfPassword) {
            if ($scope.otp == $scope.regotp) {
                $scope.otp = "";
                psLoginService.register($scope.regFirstname, $scope.regLastname, $scope.regEmail, $scope.regMobile, $scope.regPassword)
                    .then(function (result) {
                        //Success
                        if (result.status == 0) {
                            $scope.userDetails = {};
                            $scope.resetAfterSubmit();
                            $scope.userDetails.firstName = result.result[2];
                            $scope.userDetails.lastName = result.result[3];
                            $scope.userDetails.userName = $scope.userDetails.firstName + " " + $scope.userDetails.lastName;
                            $scope.userDetails.imageUrl = "/assets/img/icon-user-default.png";
                            $scope.userDetails.email = result.result[1];
                            $scope.userDetails.phoneNo = result.result[4];
                            $scope.userDetails.customerType = "M";
                    $scope.isLoggedIn = true;
                    $scope.loginError = false;
                    psDataServices.setuserDetails($scope.userDetails);
                    psLoginService.setUserAuthenticated(true);
                    $rootScope.$broadcast("ps-user-profile-show",
                       {
                           isLoggedIn: $scope.isLoggedIn,
                           userDetails: $scope.userDetails
                       });
                    $("#loginModal").modal('toggle');


                           
                            $scope.regSuccess = true;
                            $scope.regError = false;
                            $scope.successMessage = result.message;
                        } else if(result.status == 1 || result.status == 2) {
                            $scope.regError = true;
                            $scope.regSuccess = false;
                            $scope.again = false;
                            $scope.errorMessage = result.message;
                            psLoginService.setUserAuthenticated(false);
                        }
                    }, function (error) {
                        //Error
                        $scope.regError = false;
                        $scope.errorMessage = error.message;
                        psLoginService.setUserAuthenticated(false);
                    }).finally(function () {
                        $scope.isBusy = false;
                        $scope.passAndOTPReset();
                        $timeout(function () {
                            $scope.regReset();
                        }, 3000);
                    });
            }
            else {
                $scope.reqError = true;
                $scope.reqSuccess = false;
                $scope.regError = false;
                $scope.regSuccess = false;
                $scope.errorMessage = "You entered incorrect OTP.";
                $scope.passAndOTPReset();
                $timeout(function () {
                    $scope.regReset();
                }, 3000);
            }
        } else {
            $scope.regError = true;
            $scope.regSuccess = false;
            $scope.reqError = false;
            $scope.reqSuccess = false;
            $scope.regForm.rpassword.$dirty = false;
            $scope.regForm.rcnfpassword.$dirty = false;
            $scope.regPassword = null;
            $scope.cnfPassword = null;
            $scope.errorMessage = "Password doesn't match.";
            $timeout(function () {
                $scope.regReset();
            }, 3000);
        }
    }

    $scope.passAndOTPReset = function () {
        $scope.regForm.rotp.$dirty = false;
        $scope.regForm.rpassword.$dirty = false;
        $scope.regForm.rcnfpassword.$dirty = false;
        $scope.regotp = null;
        $scope.regPassword = null;
        $scope.cnfPassword = null;
    }

    $scope.regReset = function () {
        $scope.regSuccess = false;
        $scope.regError = false;
        $scope.reqSuccess = false;
        $scope.reqError = false;
    }

    $scope.requestOtp = function (Mobile) {
        psLoginService.mobileVerification(Mobile)
            .then(function (result) {
                //Success
                if (result.status == 0) {
                    $scope.otp = result.result;
                    console.log($scope.otp);
                    $scope.again = true;
                    $scope.reqSuccess = true;
                    $scope.reqError = false;
                    $scope.successMessage = result.message;
                } else if (result.status == 1 || result.status == 2) {
                    $scope.reqError = true;
                    $scope.reqSuccess = false;
                    $scope.errorMessage = result.message;
                }
            }, function (error) {
                //Error
                $scope.reqError = true;
                $scope.reqSuccess = false;
                $scope.errorMessage = error.message;
            }).finally(function () {
                $scope.isBusy = false;
                $timeout(function () {
                    $scope.regReset();
                }, 3000);
            });
    }

    $scope.forgotSubmit = function () {
        psLoginService.forgotPassword($scope.fgtEmail)
                .then(function (result) {
                    //Success
                    if (result.status == 0) {
                        $scope.frgSuccess = true;
                        $scope.frgError = false;
                        $scope.successMessage = result.message;
                    } else if (result.status == 1 || result.status == 2) {
                        $scope.frgError = true;
                        $scope.frgSuccess = false;
                        $scope.errorMessage = result.message;
                    }
                }, function (error) {
                    //Error
                    $scope.frgError = true;
                    $scope.frgSuccess = false;
                    $scope.errorMessage = result.message;
                }).finally(function () {
                    $scope.isBusy = false;
                    $scope.resetAfterSubmit();
                    $timeout(function () {
                        $scope.frgReset();
                    }, 3000);
                });
    }

    $scope.frgReset = function () {
        $scope.frgSuccess = false;
        $scope.frgError = false;
    }

    $scope.resetAfterSubmit = function () {
        $scope.Email = null;
        $scope.Password = null;
        $scope.regFirstname = null;
        $scope.regLastname = null;
        $scope.regEmail = null;
        $scope.regMobile = null;
        $scope.regotp = null;
        $scope.regPassword = null;
        $scope.cnfPassword = null;
        $scope.fgtEmail = null;
        $scope.fgtForm.femail.$dirty = false;
        $scope.loginForm.email.$dirty = false;
        $scope.loginForm.password.$dirty = false;
        $scope.regForm.rfirstname.$dirty = false;
        $scope.regForm.rlastname.$dirty = false;
        $scope.regForm.remail.$dirty = false;
        $scope.regForm.rmobile.$dirty = false;
        $scope.regForm.rotp.$dirty = false;
        $scope.regForm.rpassword.$dirty = false;
        $scope.regForm.rcnfpassword.$dirty = false;
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
                       $("#loginModal").modal('toggle');
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
        var iLeft = ($window.screen.availWidth - 10 - iWidth) / 2;
        $window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=yes,resizeable=no,location=no,status=no');

        //window.onload = function () {
        //    var $preloader = $('#page-preloader'),
        //    $spinner = $preloader.find('.spinner-loader');
        //    $preloader.show();
        //    $spinner.fadeOut();
        //    $preloader.delay(100).fadeOut('slow');

        //}
    }

    var loc = $location.search();
    if (loc.code != null && loc.code != undefined) {
        psLoginService.socialCallback($location.search())
         .then(function (result) {
             // window.close();
             $scope.userDetails = {};
                $scope.userDetails.firstName = result.result.firstName;
                $scope.userDetails.lastName = result.result.lastName;
                $scope.userDetails.imageUrl = result.result.link;
                $scope.userDetails.email = result.result.email;
                $scope.userDetails.customerType = result.result.customerType;
                $scope.userDetails.carDetails = result.result.carDetails;
                $scope.userDetails.phoneNo = result.result.mobile;
                $scope.userDetails.userName = result.result.name;
                $rootScope.$broadcast("ps-user-profile-show",
                         {
                             isLoggedIn: $scope.isLoggedIn,
                             userDetails: $scope.userDetails
                         });
                psDataServices.setuserDetails($scope.userDetails);
                psLoginService.setUserAuthenticated(true);
                if (opener) {
                    opener.location.reload();
                } else if ($window || $window.opener) {
                    $window.opener.location.reload();
                }
                $window.close();

            }, function (error) {
                //Error
                psLoginService.setUserAuthenticated(false);
         }).finally(function () {
             $scope.isBusy = false;
         });
    }



    
    

   
}]);