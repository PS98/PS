"use strict";

angular.module("index").directive("latestGallery", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "ext-modules/index/latestGalleryTemplate.html",
       // controller: "indexController",
        link: function (scope, el, attrs) {
            window.prettyPrint && prettyPrint();
            $("a[rel^='prettyPhoto']").prettyPhoto({ animation_speed: 'normal', theme: 'light_square', slideshow: 3000 });

            Core.initialize();
        }
    };
});

