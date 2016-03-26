"use strict";

angular.module("psApp").directive("selectCar", function () {
    return {
        templateUrl: "psApp/carService/selectCar.html",
        link: function (scope, element, attrs) {

        }

    };
});


angular.module("psApp").directive("centreDetails", function () {
    return {
        templateUrl: "psApp/carService/centerDetails.html",
        link: function (scope, element, attrs) {
            scope.center.Name = "Kwik Fit - Broxburn";
            scope.center.addressline1 = "East Main Street";
            scope.center.addressline2 = "Broxburn, EH52 5AS";
            scope.center.phoneNo = "01506 856586";
            scope.activeCenter = false;
        }

    };
});