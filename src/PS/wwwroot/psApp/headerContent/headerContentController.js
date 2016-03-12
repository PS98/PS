angular.module("psApp").controller("headerContentController", ["$scope", "$localStorage", "$location", "$rootScope", "psLoginService",
function ($scope, $localStorage, $location,$rootScope, psLoginService) {

    $scope.isLoggedIn = false;
    $scope.loginSubmit = function () {
       
        psLoginService.login($scope.Email, $scope.Password)
            .then(function (result) {
                //Success
                $scope.userName = result;
                $scope.isLoggedIn = true;
                $localStorage.profile = result;
                $rootScope.$broadcast("ps-user-profile-show",
                   {
                       isLoggedIn: $scope.isLoggedIn,
                       userName: $scope.userName
                   });
               // $modalInstance.close();
            }, function (error) {
                //Error

                $scope.isLoggedIn = false;
                console.log("Error", error);
            }).finally(function () {
               // $scope.isBusy = false;
            });

        $scope.logout = function () {
          //  auth.signout();
            $scope.isLoggedIn = false;
            $localStorage.$reset();
           // $modalInstance.close();
        };
    }
}]);