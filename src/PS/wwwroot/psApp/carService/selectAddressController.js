angular.module("psApp").controller("selectAddressController", ["$scope", "$window", "$state", "$location", "$localStorage", "psDataServices",
function ($scope, $window, $state, $location, $localStorage, psDataServices) {
    $scope.payNow = true;
    $scope.oldNumber = $localStorage.userDetails ? $localStorage.userDetails.phoneNo : undefined;
    $scope.checkMobileNumber = function () {
        if ($localStorage.userDetails.phoneNo == $scope.oldNumber) {
            $('.mobile_validation').hide();
        }
    }

    $scope.orderProcess = function () {
        if ($scope.payNow) {
            psDataServices.setPaymentMode("Online");
            $scope.response = psDataServices.payment()
                .then(function (result) {
                    //Success
                    if (result.status == 0) {
                        if (result.result != null) {
                            $window.location.href = result.result.payment_request.longurl;
                        }
                    } else if (result.status == 1 || result.status == 2) {
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
    }

    $scope.orderSubmit = function (payment_id, payment_request_id, result) {
        psDataServices.submitOrder(payment_id, payment_request_id, result).success(function () {
            $state.go("orderSuccess");
        }).error(function () {
            alert('error');
        })
    }
    var returnData = $location.search();
    if (returnData.payment_id != null && returnData.payment_request_id !=null){
        psDataServices.validateOrder(returnData.payment_id, returnData.payment_request_id).success(function (data) {
            if(data.status == 0 && data.result.success == true)
                $scope.orderSubmit(returnData.payment_id, returnData.payment_request_id, data.result);
        }).error(function () {
            alert('error');
        })    
    }


}]);