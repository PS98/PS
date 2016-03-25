"use strict";

angular.module("loginDetails").directive("loginDetails", function () {
    return {
        templateUrl: "ext-modules/loginDetails/loginDetailsTemplate.html",
        controller: "loginDetailsController",
        link: function (scope, element, attrs, ctrl) {
            
        }
    };
});
