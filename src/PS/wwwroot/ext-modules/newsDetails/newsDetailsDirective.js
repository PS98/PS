"use strict";

angular.module("newsDetails").directive("newsDetails", function () {
    return {
        scope: {},
        controller: "newsDetailsController",
        templateUrl: "ext-modules/newsDetails/newsDetailsTemplate.html",
        link: function (scope, el, attrs) {
            $("a[rel^='prettyPhoto']").prettyPhoto({ animation_speed: 'normal', theme: 'light_square', slideshow: 3000 });
          Core.initialize();
        }
    };
});