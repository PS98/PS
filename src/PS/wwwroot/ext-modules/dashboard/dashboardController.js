angular.module("psApp").controller("dashboardController", ["$scope", "$localStorage", "psDataServices", "psLoginService",
function ($scope, $localStorage, psDataServices, psLoginService) {
    $scope.userDetails = {};
    if (psDataServices.getuserDetails())
        $scope.userDetails = psDataServices.getuserDetails();
    $scope.oldNo = $localStorage.userDetails.phoneNo;
    //$scope.$watch('$scope.userDetails.phoneNo', function () {
    //    if ($localStorage.userDetails.phoneNo == $scope.userDetails.phoneNo) {
    //        $scope.otpHide = true;
    //    } else {
    //        $scope.otpHide = false;
    //    }
    //});
    $scope.updatePassword = function () {
        var data = { "oldPassword": $scope.oldPwd, "newPassword": $scope.newPwd, "email": $scope.userDetails.email }
        psLoginService.updatePassword(data)
 .then(function (result) {
     //Success
     $scope.result = result;
 }, function (error) {
 });
        //Error

    }
}]);