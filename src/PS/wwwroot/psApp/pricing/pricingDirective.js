"use strict";

angular.module("index").directive("pricing", function () {
    return {
        templateUrl: "psApp/pricing/pricingTemplate.html",
        controller: "indexController",
        link: function (scope, el, attrs) {

        }
    };
});

