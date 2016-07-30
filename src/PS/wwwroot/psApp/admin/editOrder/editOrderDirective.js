
"use strict";
angular.module("psApp").directive("editOrderDetails", function() {
    return {
        templateUrl: "psapp/admin/editOrder/editOrderDetails.html",
        link: function(scope, element, attrs) {
        },
        scope: {
            activeOrder:"="
        },
        controller: "editOrderController"
    }
});