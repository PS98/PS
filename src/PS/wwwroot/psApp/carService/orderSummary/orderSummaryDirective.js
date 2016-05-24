"use strict";

angular.module("psApp").directive("orderSummary", function () {
    return {
        templateUrl: "psApp/carService/orderSummary/orderSummary.html",
        link: function (scope, element, attrs) {
            //   initializeGoogleMap("", 'mapholder', "", false, scope.MapCallback);
        },
        controller: ["$scope", "$location", "$sessionStorage", "psOrderDetailsService", function ($scope, $location, $sessionStorage,psOrderDetailsService) {
            $scope.invoiceNo = $sessionStorage.orderId;
            $scope.go = function (path) {
                $location.path(path);
            };
            if (!$scope.invoiceNo || $scope.invoiceNo === "") {
                $location.path("/");
            }
        }]
    }
});
