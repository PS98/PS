"use strict";

angular.module("psApp").directive("psPrivacyPolicy",
    [
        function () {
            return {
                scope: {

                },
                template: "<privacy-policy></privacy-policy>",
                link: function (scope) {

                }
            };
        }]);