"use strict";

angular.module("psApp").directive("orderDetails", function () {
    return {
        templateUrl: "ext-modules/dashboard/orderDetailsTemplate.html",
        link: function (scope, element, attrs) {

        },
        replace: true,
        scope: {
            orders: '='
        }
    }
});
