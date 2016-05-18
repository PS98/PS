"use strict";

angular.module("psApp").directive("selectAddress", function () {
    return {
        templateUrl: "psApp/carService/selectAddress.html",
        controller: "selectAddressController",
        link: function (scope, element, attrs) {           
        }
    }
});