"use strict";

angular.module("psApp").directive("psVehicleListings",
    [
        function () {
            return {
                scope: {

                },
                template: "<vehicle-listings></vehicle-listings>",
                link: function (scope) {

                }
            };
        }]);