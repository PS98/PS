"use strict";

angular.module("psApp").directive("loginDetails", function () {
    return {
        templateUrl: "psApp/loginDetails/loginDetailsTemplate.html",
        controller: "loginDetailsController",
        link: function (scope, element, attrs, ctrl) {
            
        }
    };
});
