"use strict";

angular.module("psApp").directive("orderSummary", function () {
    return {
        templateUrl: "psApp/carService/orderSummary/orderSummary.html",
        link: function (scope, element, attrs) {
            //   initializeGoogleMap("", 'mapholder', "", false, scope.MapCallback);
        },
        controller: ["$scope", "$location", "psDataServices", function ($scope, $location, psDataServices) {
            $scope.orderDetails = psDataServices.getSelectedService();
            $scope.go = function (path) {
                $location.path(path);
            };
        }]
    }
});
