"use strict";

angular.module("carDetails").directive("carDetails", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "ext-modules/carDetails/carDetailsTemplate.html",
        link: function (scope, el, attrs) {
            setCraouselAndAnimations();
            
        }
    };
});
function setCraouselAndAnimations() {
    /////////////////////////////////////////////////////////////////
    // Animated WOW
    /////////////////////////////////////////////////////////////////
    new WOW().init();

    /////////////////////////////////////
        //  Zoom Images
    /////////////////////////////////////

    $(".slider-product a").prettyPhoto({ animation_speed: 'normal', theme: 'light_square', slideshow: 3000 });


    ////////////////////////////////////////////
    // CAROUSEL PRODUCTS
    ///////////////////////////////////////////



    if ($('#slider-product').length > 0) {

        // The slider being synced must be initialized first
        $('#carousel-product').flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: false,
            slideshow: false,
            itemWidth: 84,
            itemMargin: 8,
            asNavFor: '#slider-product'
        });

        $('#slider-product').flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: false,
            slideshow: false,
            sync: "#carousel-product"
        });
    }
    $("a[rel^='prettyPhoto']").prettyPhoto({ animation_speed: 'normal', theme: 'light_square', slideshow: 3000 });

    Core.initialize();
}