"use strict";

angular.module("index").directive("dashboard", function () {
    return {
        templateUrl: "psApp/dashboard/dashboardTemplate.html",
        controller: "dashboardController",
        link: function (scope, el, attrs) {

        }
    };
});



