angular.module("psApp").controller("dashboardController", ["$scope", "$localStorage", "$timeout", "psDataServices", "psLoginService",
function ($scope, $localStorage, $timeout, psDataServices, psLoginService) {

    $scope.userDetails = {};

    if (psDataServices.getuserDetails())
        $scope.userDetails = psDataServices.getuserDetails();

    $scope.oldNo = $localStorage.userDetails.phoneNo;
    $scope.isEdit = false;



    $scope.updateProfile = function () {
        var data = { "firstName": $scope.userDetails.firstName, "lastName": $scope.userDetails.lastName, "mobile": $scope.userDetails.phoneNo, "email": $scope.userDetails.email }
        
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

}]);