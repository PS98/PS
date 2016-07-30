"use strict";

angular.module("psApp").controller("serviceCentreListController", [
    "$scope", "psDataServices", "$state", "psOrderDetailsService", "$timeout", function ($scope, psDataServices, $state, psOrderDetailsService, $timeout) {
        $scope.serviceCentreList = [
        {
            name: "Tilak Motors",
            address: { line1: "S. No. 73, Srushti Hotel Chowk", line2: " Opp. Arun Pawar Construction Office, Pimple Gurav" },
            owner: " Owner Name",area:" Pimple Gurav",
            phoneNo: "8446",
            email: "tilakmotors123@gmail.com"
            
        },
        {
            name: "Tilak Motors",
            address: { line1: "S. No. 73, Srushti Hotel Chowk", line2: " Opp. Arun Pawar Construction Office, Pimple Gurav" },
            owner: " Owner Name", area: " Pimple Gurav",
            phoneNo: "8446",
            email: "tilakmotors123@gmail.com"

        }];

        $scope.changeView = function (id) {
            psOrderDetailsService.getOrderList(id).then(function (data) {
                $scope.displayOrderList = true;
                $scope.orders = [
            {
                status: "Pending",
                invoiceNo:"MM478740522",
                userDetails: { firstName: "Jitin", lastName: "kumar", phoneNo: "898997999989" },
                selectedCar: { brand: "BMW", model: "1-series", year: "1990", varient: "Petrol" },
                selectedService: [{ name: "Lite Car care" }],
                paymentMode: "Cod",
                selectedCentre: { totalMMPrice: "1777" }
            },
             {
                 status: "Pending",
                 invoiceNo:"MM478740522",
                 userDetails: { firstName: "Jitin", lastName: "kumar", phoneNo: "898997999989" },
                 selectedCar: { brand: "BMW", model: "1-series", year: "1990", varient: "Petrol" },
                 selectedService: [{ name: "Lite Car care" }],
                 paymentMode: "Cod",
                 selectedCentre: { totalMMPrice: "1777" }
             }
                ];
            }, function() {

            });
        }
        $scope.toggleView = function() {
            $scope.displayOrderList = !$scope.displayOrderList;
        }

    }
]);