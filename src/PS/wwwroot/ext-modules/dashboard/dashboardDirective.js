"use strict";

angular.module("index").directive("dashboard", function () {
    return {
        templateUrl: "ext-modules/dashboard/dashboardTemplate.html",
        controller: "dashboardController",
        link: function (scope, el, attrs) {
          
        }
    };
});

