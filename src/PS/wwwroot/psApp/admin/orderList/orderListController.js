"use strict";

angular.module("psApp").controller("orderListController", [
    "$scope", "psDataServices", "$state", "psOrderDetailsService", "$timeout", function($scope, psDataServices, $state, psOrderDetailsService, $timeout) {

        $scope.orderList = [
            {
                status: "Pending",
                userDetails: { firstName: "Jitin", lastName: "kumar", phoneNo: "898997999989" },
                selectedCar: { brand: "BMW", model: "1-series", year: "1990", varient: "Petrol" },
                selectedService: [{ name: "Lite Car care" }],
                paymentMode: "Cod",
                selectedCentre: { totalMMPrice: "1777" }
            },
             {
                status: "Pending",
                userDetails: { firstName: "Jitin", lastName: "kumar", phoneNo: "898997999989" },
                selectedCar: { brand: "BMW", model: "1-series", year: "1990", varient: "Petrol" },
                selectedService: [{ name: "Lite Car care" }],
                paymentMode: "Cod",
                selectedCentre: { totalMMPrice: "1777" }
            }
        ];
    }
]);