angular.module("psApp").directive("reviewOrder", function () {
    return {
        templateUrl: "psApp/carService/reviewOrder/reviewOrder.html",
        replace: true,
        scope: {
            orders: '='
        }
    }
});