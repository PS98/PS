"use strict";
angular.module("psApp").directive("admin", function() {
    return {
        templateUrl: "psapp/admin/admin.html",
        link: function(scope, element, attrs) {
        },
        controller: "adminController"
    }
});

angular.module("psApp").controller("adminController", [
    "$scope", "$state", "psDataServices", "psOrderDetailsService", "psLoginService", "$rootScope",
    function ($scope, $state, psDataServices, psOrderDetailsService, psLoginService, $rootScope) {
        $scope.checkAccess = function () {
            psDataServices.checkAccess().
                success(function (data) {
                    if (data.status == 2) {
                        $("#loginModal").modal("toggle");
                        $scope.$parent.isLoggedIn = false;
                        psLoginService.setUserAuthenticated(false);
                        delete window.localStorage.userDetails;
                        //$state.reload();
                        delete window.localStorage.token;
                    } else if (data.status == 3) {
                        $state.go("home");
                    } else {
                        $scope.status = data.status;
                        $scope.linkDisplayName = data.status === 0 ? "Service Centre List" : "Centre Details";
                    }
                })
                .error(function () {
                });
        }
        $rootScope.$on("updateStatus", function (event, data) {
            $scope.status = parseInt(data.status);
            if ($scope.status < 2 && $state.current.name === "admin") {
                $state.go("admin.centreDetails");
            }
            $scope.linkDisplayName = data.status === 0 ? "Service Centre List" : "Centre Details";
        });
        $rootScope.$on("showOverlay", function(event, data) {
                $scope.showInformation = data.showInformation;
                $scope.overlayMessage = data.overlayMessage; 
                $("#modalOverlay").modal('toggle');
            if (data.callback) {
                $("#modalOverlay").on("hidden.bs.modal", function() {
                    data.callback();
                });
            }
        });
    }
]);

