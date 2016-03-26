"use strict";

angular.module("psApp").directive("loginDetails", function () {
    return {
        templateUrl: "ext-modules/loginDetails/loginDetailsTemplate.html",
        controller: "loginDetailsController",
        link: function (scope, element, attrs, ctrl) {
            
        }
    };
});
