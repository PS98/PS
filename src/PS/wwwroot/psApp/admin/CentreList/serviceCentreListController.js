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

    }
]);