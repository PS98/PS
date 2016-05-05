"use strict";

angular.module("psApp").directive("orderDetails", function () {
    return {
        templateUrl: "ext-modules/dashboard/orderDetailsTemplate.html",
        link: function (scope, element, attrs) {
            debugger;

        },
        replace: true,
        scope: {
            orders: '='
        }
    }
});
