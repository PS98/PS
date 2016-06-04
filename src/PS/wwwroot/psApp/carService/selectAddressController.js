angular.module("psApp").controller("selectAddressController", ["$scope", "$window", "$state", "$location", "$localStorage", "$sessionStorage", "psDataServices", "psOrderDetailsService", "psLoginService", "$timeout",
function ($scope, $window, $state, $location, $localStorage, $sessionStorage, psDataServices, psOrderDetailsService, psLoginService, $timeout) {
    $scope.payNow = true;
    $scope.oldNumber = $localStorage.userDetails ? $localStorage.userDetails.phoneNo : undefined;
    $scope.vaildatedNo = $localStorage.userDetails ? $localStorage.userDetails.phoneNo : undefined;
    
    $scope.checkMobileNumber = function () {
        if ($localStorage.userDetails.phoneNo == $scope.oldNumber) {
            $('.mobile_validation').hide();
        }
    }

    $scope.orderProcessingTC = function (url, name) {
        window.open(url, name);
    }

    $scope.orderProcess = function () {
        $("#ReviewOrder").modal("toggle");
        $timeout(function () {
            if ($scope.payNow) {
                psDataServices.setPaymentMode("Online");
                $localStorage.userSelectionData = psDataServices.getSelectedService();
                $scope.response = psOrderDetailsService.payment()
                    .then(function (result) {
                        //Success
                        if (result.status === 0) {
                            if (result.result != null) {
                                $window.location.href = result.result.payment_request.longurl;
                            }
                        } else if (result.status === 1 || result.status === 2) {
                            $scope.reqError = true;
                            $scope.errorMessage = result.message;
                        }
                    }, function (error) {
                        //Error
                    }).finally(function () {
                    });
            }
            else {
                psDataServices.setPaymentMode("COD");
                $scope.orderSubmit("", "", "");
            }
        }, 200);
    }

    $scope.orderSubmit = function (payment_id, payment_request_id, result) {
        psOrderDetailsService.submitOrder(payment_id, payment_request_id, result).
            then(function (data) {
                if (data.status === 0) {
                    $scope.receivedOrder = data.result;
                    psDataServices.resetAll();
                    $localStorage.userData = {};
                    $sessionStorage.orderId = data.result;

                   $state.go("orderSuccess");
                }
                else if (data.status === 1 || data.status === 2) {
                    $scope.orderErrorMessage = data.result;
                    $state.go("orderError");
                }
            }, function () {
                alert('Sorry we are unable to process your order. Please try after some time');
            });
    }
    var returnData = $location.search();
    if (returnData.payment_id != null && returnData.payment_request_id != null) {
        psOrderDetailsService.validateOrder(returnData.payment_id, returnData.payment_request_id).success(function (data) {
            if (data.status == 0 && data.result.success == true)
                $scope.orderSubmit(returnData.payment_id, returnData.payment_request_id, data.result);
        }).error(function () {
            alert("error");
        })
    }

    $scope.changeNo = function() {
        $scope.otp = undefined;
        $scope.addressOtp = "";
    }
    $scope.ReviewOrder = function () {
        if ($scope.userSelectedService.userDetails.phoneNo === $scope.oldNumber || $scope.userSelectedService.userDetails.phoneNo === $scope.vaildatedNo || $scope.otp === $scope.addressOtp) {
            $scope.vaildatedNo = $scope.userSelectedService.userDetails.phoneNo;
            $scope.reviewOrder = [];
            var order = psDataServices.getSelectedService();
            $scope.review = true;
            $scope.custRequest = false;
            $scope.reviewOrder.push(order);
            $.each(order.selectedServices, function (i, job) {
                if (job.addText) {
                    $scope.custRequest = true;
                    $scope.request = job.request;
                }
            });
            $("#ReviewOrder").modal();
        }
        else {
            $scope.otpError = true;
            $scope.otpSuccess = false;
            $scope.errorMessage = "You entered incorrect OTP.";
            $timeout(function () {
                $scope.otpReset();
            }, 3000);
        }
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
                    $timeout(function () {
                        $scope.otpReset();
                    }, 3000);
                } else if (result.status == 1 || result.status == 2) {
                    $scope.reqError = true;
                    $scope.reqSuccess = false;
                    $scope.errorMessage = result.message;
                    $timeout(function () {
                        $scope.otpReset();
                    }, 3000);
                }
            }, function (error) {
                //Error
                $scope.reqError = true;
                $scope.reqSuccess = false;
                $scope.errorMessage = error.message;
                $timeout(function () {
                    $scope.otpReset();
                }, 3000);
            });
    }

    $scope.otpReset = function () {
        $scope.otpSuccess = false;
        $scope.otpError = false;
        $scope.reqSuccess = false;
        $scope.reqError = false;
    }

}]);