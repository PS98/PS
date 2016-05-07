"use strict";

angular.module("index").directive("dashboard", function () {
    return {
        templateUrl: "ext-modules/dashboard/dashboardTemplate.html",
        controller: "dashboardController",
        link: function (scope, el, attrs) {
          
        }
    };
});

angular.module("index").directive("editOrder", function () {
    return {
        templateUrl: "ext-modules/dashboard/editOrder.html",
        controller: "dashboardController",
        replace:true,
        link: function (scope, el, attrs) {
           jQuery('#datetimepicker12').datetimepicker({
               inline: true,
               sideBySide: true
           });
            
        }
    };
});

