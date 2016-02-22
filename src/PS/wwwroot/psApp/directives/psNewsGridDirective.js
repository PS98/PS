"use strict";

angular.module("psApp").directive("psNewsGrid",
    [
        function () {
            return {
                scope: {

                },
                template: "<news-grid></news-grid>",
                link: function (scope) {

                }
            };
        }]);