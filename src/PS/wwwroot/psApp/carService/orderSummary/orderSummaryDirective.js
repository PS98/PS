"use strict";

angular.module("psApp").directive("orderSummary", function () {
    return {
        templateUrl: "psApp/carService/orderSummary/orderSummary.html",
        link: function (scope, element, attrs) {
            //   initializeGoogleMap("", 'mapholder', "", false, scope.MapCallback);
        },
        controller: ["$scope", "$location", "psOrderDetailsService", function ($scope, $location, psOrderDetailsService) {
            $scope.orderDetails = psOrderDetailsService.getsubmittedOrder();
            $scope.go = function (path) {
                $location.path(path);
            };
        }]
    }
});
