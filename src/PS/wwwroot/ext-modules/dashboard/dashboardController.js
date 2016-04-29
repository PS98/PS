angular.module("psApp").controller("dashboardController", ["$scope", "$localStorage", "psDataServices",
function ($scope, $localStorage, psDataServices) {
    if (psDataServices.getuserDetails())
        $scope.userDetails = psDataServices.getuserDetails();
    //$scope.$watch('$scope.userDetails.phoneNo', function () {
    //    if ($localStorage.userDetails.phoneNo == $scope.userDetails.phoneNo) {
    //        $scope.otpHide = true;
    //    } else {
    //        $scope.otpHide = false;
    //    }
    //});
}]);