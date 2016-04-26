"use strict";

angular.module("psApp").directive("orderSummary", function () {
    return {
        templateUrl: "psApp/carService/orderSummary/orderSummary.html",
        link: function (scope, element, attrs) {
            //   initializeGoogleMap("", 'mapholder', "", false, scope.MapCallback);
        },
        controller:["$scope","psDataServices", function ($scope,psDataServices) {
            $scope.orderDetails = psDataServices.getSelectedService();
        }]
    }
});
