angular.module("psApp").controller("headerContentController", ["$scope", "$localStorage", "$location", "$rootScope", "psLoginService",
function ($scope, $localStorage, $location,$rootScope, psLoginService) {
   
    $scope.displayPopUp = false;

    $scope.openloginModal = function () {
        debugger;
        $scope.displayPopUp = true;
        $("#loginModal").modal('toggle');
    }



}]);