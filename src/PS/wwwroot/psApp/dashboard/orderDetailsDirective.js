"use strict";

angular.module("psApp").directive("orderDetails", function () {
    return {
        templateUrl: "psApp/dashboard/orderDetailsTemplate.html",
        link: function (scope, element, attrs) {

        },
        replace: true,
        scope: {
            orders: '=',
            review:'='
        }
    }
});
