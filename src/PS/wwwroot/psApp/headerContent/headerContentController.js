angular.module("psApp").controller("headerContentController", ["$scope", "$localStorage", "$location", "$rootScope", "$state","psLoginService",
function ($scope, $localStorage, $location, $rootScope, $state, psLoginService) {

    $scope.isLoggedIn = $localStorage.userDetails ? true : false ;
    $scope.userDetails = $localStorage.userDetails ? $localStorage.userDetails : "";

    $scope.windowOpen = function (url, name) {
        window.open(url, name);
    }

    $rootScope.$on("ps-user-profile-show", function (event,data) {
        $scope.isLoggedIn = data.isLoggedIn;
        $scope.userDetails = data.userDetails;
    });

    $scope.openloginModal = function () {
        $("#loginModal").modal('toggle');
        $('#signin-taba').tab('show');       
    }

    $scope.logout = function () {
        $scope.isLoggedIn = false;
        psLoginService.setUserAuthenticated(false);
        delete  $localStorage.userDetails;
        //$state.reload();
        delete window.localStorage.token;
        psLoginService.killSession().success(function (data) { $state.go("home"); }).error(function () { });
    }

    $rootScope.$on("authenticationError", function () {
        $scope.showInformation = true;
        $scope.authenticationError = "Your session is timed out. Please login again to proceed";
        $("#sessionError").modal('toggle');
        $("#sessionError").on("hidden.bs.modal", function() {
            $scope.logout();
        });
    })
}]);