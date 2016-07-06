"use strict";

angular.module("psApp").controller("serviceCentrePriceDetailsController", ["$scope", "psOrderDetailsService", function ($scope, psOrderDetailsService) {

    $scope.getPriceList = function(id) {
        psOrderDetailsService.getPriceList(id).then(function (data) {
            alert("success");
            console.log(data.list);
        }, function() {
            alert("error");
        });
    }

    }
]);