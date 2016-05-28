"use strict";

angular.module("index").directive("dashboard", function () {
    return {
        templateUrl: "psApp/dashboard/dashboardTemplate.html",
        controller: "dashboardController",
        link: function (scope, el, attrs) {
            scope.getOrderOnStatus("All");
            var tab = scope.tab ? scope.tab : "booking";
                el.find("#" + tab).addClass("active").addClass("in");
                el.find('.nav a[href="#' + tab + '"]').attr("aria-expanded", "true");
                el.find('.nav a[href="#' + tab + '"]').parent().addClass("active");
                scope.loadTab = function(tab) {
                    var id = tab === "profile" ? "profile-tab" : "password-tab";
                    var hideTab = tab !== "profile" ? "profile-tab" : "password-tab";
                    $("#" + id).addClass("active");
                    $("#" + hideTab).removeClass("active");
                }
                scope.loadTab("profile");
                el.find("#liProfile").addClass("active");
        }
    };
});



