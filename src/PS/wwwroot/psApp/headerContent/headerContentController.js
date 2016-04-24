angular.module("psApp").controller("headerContentController", ["$scope", "$localStorage", "$location", "$rootScope", "$state","psLoginService",
function ($scope, $localStorage, $location, $rootScope, $state, psLoginService) {

    $scope.isLoggedIn = $localStorage.userDetails ? true : false ;
    $scope.userDetails = $localStorage.userDetails ? $localStorage.userDetails : "";

    $rootScope.$on("ps-user-profile-show", function (event,data) {
        $scope.isLoggedIn = data.isLoggedIn;
        $scope.userDetails = data.userDetails;
    });

    $scope.openloginModal = function () {
        $("#loginModal").modal('toggle');
    }

    $scope.logout = function () {
        $scope.isLoggedIn = false;
        $localStorage.$reset();
        $state.reload();
    }

}]);