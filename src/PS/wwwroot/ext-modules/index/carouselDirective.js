"use strict";

angular.module("index").directive("carousel", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "ext-modules/index/carouselTemplate.html",
        controller: "indexController",
        link: function (scope, el, attrs) {
            loadCraousel();
        }
    };
});

var loadCraousel = function () {

    /////////////////////////////////////
    //  HOME PAGE SLIDER
    /////////////////////////////////////

    var sliderpro1 = $('#sliderpro1');


    if (sliderpro1.length > 0) {

        sliderpro1.sliderPro({
            width: 2000,
            height: 900,
            fade: true,
            arrows: true,
            buttons: false,
            waitForLayers: false,
            thumbnailPointer: false,
            touchSwipe: false,
            autoplay: true,
            autoScaleLayers: true

        });

    }
}