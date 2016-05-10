"use strict";

angular.module("psApp").directive("psOrderProcessing",
    [
        function () {
            return {
                scope: {

                },
                template: "<order-processing-terms></order-processing-terms>",
                link: function (scope) {

                }
            };
        }]);