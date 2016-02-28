"use strict";

angular.module("index").directive("latestOffers", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "ext-modules/index/latestOffersTemplate.html",
        //controller: "indexController",
        link: function (scope, el, attrs) {
            new WOW().init();
            Core.initialize();
            $(".slider-product a").prettyPhoto({ animation_speed: 'normal', theme: 'light_square', slideshow: 3000 });


            $("a[rel^='prettyPhoto']").prettyPhoto({ animation_speed: 'normal', theme: 'light_square', slideshow: 3000 });
        }
    };
});

