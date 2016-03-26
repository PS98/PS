"use strict";

angular.module("psApp").directive("psUserProfile", [
    "$rootScope", function($rootScope) {
        return {
            templateUrl: "psApp/userProfile/userProfileTemplate.html",
            replace: true,
            link: function(scope, el, ctrl, attr) {

            }
        };
    }
]);