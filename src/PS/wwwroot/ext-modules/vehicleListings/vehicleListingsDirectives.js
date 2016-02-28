"use strict";

angular.module("vehicleListings").directive("vehicleListings", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "ext-modules/vehicleListings/vehicleListingsTemplate.html",
        link: function (scope, el, attrs) {
            bindEvent();
           
        }
    };
});
function bindEvent() {
    /////////////////////////////////////////////////////////////////
    // Animated WOW
    /////////////////////////////////////////////////////////////////
    new WOW().init();


    /////////////////////////////////////////////////////////////////
    // Filter accordion
    /////////////////////////////////////////////////////////////////


    $('.js-filter').on('click', function () {
        $(this).prev('.wrap-filter').slideToggle('slow')
    });

    $('.js-filter').on('click', function () {
        $(this).toggleClass('filter-up filter-down')
    });

    /////////////////////////////////////////////////////////////////
    // Сustomization select
    /////////////////////////////////////////////////////////////////

    $('.jelect').jelect();



    /////////////////////////////////////////////////////////////////
    //PRICE RANGE
    /////////////////////////////////////////////////////////////////


    if ($('#slider-price').length > 0) {


        $("#slider-price").noUiSlider({
            start: [15000, 35000],
            step: 500,
            connect: true,
            range: {
                'min': 0,
                'max': 50000
            },

            // Full number format support.
            format: wNumb({
                decimals: 0,
                prefix: '$'
            })
        });
        // Reading/writing + validation from an input? One line.
     //   $('#slider-price').Link('lower.html').to($('#slider-price_min'));

        // Write to a span? One line.
       // $('#slider-price').Link('upper.html').to($('#slider-price_max'));

    }
}