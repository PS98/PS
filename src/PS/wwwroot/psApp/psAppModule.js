"use strict";

angular.module("psApp", ["index", "carDetails", "newsDetails", "newsGrid", "vehicleListings", "ngRoute", "auth0", "angular-storage", "angular-jwt", "ngStorage"]);


angular.module("psApp").directive('script', function () {
        return {
            restrict: 'E',
            scope: false,
            link: function (scope, elem, attr) {
                if (attr.type == 'text/javascript-lazy') {
                    var code = elem.text();
                    var f = new Function(code);
                    f();
                }
            }
        };
    });

