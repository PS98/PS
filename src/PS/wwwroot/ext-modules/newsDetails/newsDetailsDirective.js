"use strict";

angular.module("newsDetails").directive("newsDetails", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "ext-modules/newsDetails/newsDetailsTemplate.html",
        link: function (scope, el, attrs) {
            $("a[rel^='prettyPhoto']").prettyPhoto({ animation_speed: 'normal', theme: 'light_square', slideshow: 3000 });
          Core.initialize();
        }
    };
});