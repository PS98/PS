angular.module("psApp").controller("dashboardController", ["$scope", "$localStorage", "$timeout","$location", "psDataServices", "psLoginService", "psOrderDetailsService",
function ($scope, $localStorage, $timeout,$location, psDataServices, psLoginService, psOrderDetailsService) {

    $scope.userData = {}; $scope.changedDate = { pickUpDate: {}, dropOffDate: {} };
    $scope.hideCalendar = false;

    if (psDataServices.getuserDetails()) {
        $scope.userDetails = psDataServices.getuserDetails();
        angular.extend($scope.userData, $scope.userDetails);
    }

    $scope.oldNo = $scope.userData.phoneNo;
    $scope.oldFirstName = $scope.userData.firstName;
    $scope.oldLastName = $scope.userData.lastName;

    $scope.isEdit = false;
    $scope.tab = $location.$$hash;    


    $scope.updateProfile = function () {
        var data = { "firstName": $scope.userData.firstName, "lastName": $scope.userData.lastName, "mobile": $scope.userData.phoneNo, "email": $scope.userData.email }

        psLoginService.updateProfile(data)
         .then(function (result) {
             //Success
             if (result.status == 1) {
                 $scope.cngSuccess = true;
                 $scope.cngError = false;
                 $scope.successMessage = result.result;
             } else if (result.status == 2) {
                 $scope.cngError = true;
                 $scope.cngSuccess = false;
                 $scope.errorMessage = result.result;
                 $timeout(function () {
                     $scope.cngReset();
                 }, 3000);
             }
         }, function (error) {
             //Error
             $scope.cngError = true;
             $scope.cngSuccess = false;
             $scope.errorMessage = result.result;
         }).finally(function () {
             $scope.isEdit = false;
             $localStorage.userDetails = $scope.userData;
             $scope.oldNo = $scope.userData.phoneNo;
             $scope.oldFirstName = $scope.userData.firstName;
             $scope.oldLastName = $scope.userData.lastName;
             $scope.resetAfterSubmitProfile();
             $timeout(function () {
                 $scope.cngReset();
             }, 3000);
         });

    }



    $scope.updatePassword = function () {
        var data = { "oldPassword": $scope.oldPwd, "newPassword": $scope.newPwd, "email": $scope.userDetails.email }
        if ($scope.newPwd == $scope.reNewPwd) {
            psLoginService.updatePassword(data)
             .then(function (result) {
                 //Success
                 if (result.status == 1) {
                     $scope.cngSuccess = true;
                     $scope.cngError = false;
                     $scope.successMessage = result.result;
                 } else if (result.status == 2) {
                     $scope.cngError = true;
                     $scope.cngSuccess = false;
                     $scope.errorMessage = result.result;
                 }
             }, function (error) {
                 //Error
                 $scope.cngError = true;
                 $scope.cngSuccess = false;
                 $scope.errorMessage = result.result;
             }).finally(function () {
                 $scope.resetAfterSubmit();
                 $timeout(function () {
                     $scope.cngReset();
                 }, 3000);
             });
        }
        else {
            $scope.cngSuccess = false;
            $scope.cngError = true;
            $scope.resetAfterSubmit();
            $scope.errorMessage = "Password doesn't match.";
            $timeout(function () {
                $scope.cngReset();
            }, 3000);
        }
    }

    $scope.cngReset = function () {
        $scope.cngSuccess = false;
        $scope.cngError = false;
    }
    $scope.resetAfterSubmitProfile = function () {
        //$scope.userDetails.firstName = null;
        //$scope.userDetails.lastName = null;
        //$scope.userDetails.phoneNo = null;
        $scope.addressOtp = null;
        $scope.profileForm.firstName.$dirty = false;
        $scope.profileForm.lastName.$dirty = false;
        $scope.profileForm.mobile.$dirty = false;
    }


    $scope.resetAfterSubmit = function () {
        $scope.oldPwd = null;
        $scope.newPwd = null;
        $scope.reNewPwd = null;
        $scope.changePassword.oldPwd.$dirty = false;
        $scope.changePassword.newPwd.$dirty = false;
        $scope.changePassword.reNewPwd.$dirty = false;
    }
    function getOrderOnStatus(status) {
        psOrderDetailsService.getAllPendingOrder(status).then(function (data) {
            if (status == "Pending")
                $scope.pendingOrders = data;
            if (status == "Success")
                $scope.successOrders = data;
        }, function () {
            alert("error");
        })
    }
    $scope.modalShown = false;
    getOrderOnStatus("Pending");
    getOrderOnStatus("Success");
    $scope.showDailog = function (order) {
        $scope.modalShown = true;
        $scope.showInformation = false;
        $scope.overlayMessage = undefined;
        $("#modalOverlay").modal('toggle');
        $scope.cancelledOrder = order;
    }
    $scope.cancelOrder = function () {
        $scope.modalShown = false;
        ;
        psOrderDetailsService.cancelOrder($scope.cancelledOrder.invoiceNo, $scope.cancelledOrder.userDetails.email).then(function (data) {
            $scope.pendingOrders = data;
            getOrderOnStatus("Success");
        }, function () {
            alert("error");
        });
    }
    $scope.changeDateAndTime = function (editOrder) {


        psOrderDetailsService.editDateAndTime(editOrder.invoiceNo, $scope.changedDate).
            then(function (data) {
                if (data.status === 0) {
                    editOrder.selectedAppointment.dropOffDate = $scope.changedDate.dropOffDate;
                    editOrder.selectedAppointment.pickUpDate = $scope.changedDate.pickUpDate;
                }
                $scope.overlayMessage = data.result;
                $scope.showInformation = true;
                $timeout(function () {
                    $("#modalOverlay").modal('toggle');
                }, 200);
            }, function () {
                alert("error");
            }).finally(function() {
                $scope.centreWorkingHours = [];
                $scope.availableDropTime = [];
                $scope.changedDate = { "pickUpDate": {}, "dropOffDate": {} };
            });

    }




}]);