
"use strict";
angular.module("psApp").directive("orderList", function() {
    return {
        templateUrl: "psapp/admin/orderList/orderList.html",
        link: function(scope, element, attrs) {
        },
        controller:"orderListController"
    }
});