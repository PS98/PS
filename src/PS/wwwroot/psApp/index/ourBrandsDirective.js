"use strict";

angular.module("index").directive("ourBrands", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "psApp/index/ourBrandsTemplate.html",
       // controller: "indexController",
        link: function (scope, el, attrs) {
            previousNextBrandDetails();
        }
    };
});

var previousNextBrandDetails = function () {
    
	if ( $(".brand-carousel").length ) {
		/*** Brands Carousel ***/
	    var brandCaro = $(".brand-carousel.owl-carousel");
		brandCaro.owlCarousel({
			autoPlay: true,
			pagination: false,
			items : 6,
			itemsDesktop : [1000,6],
			itemsDesktopSmall : [900,3],
			itemsTablet: [600,2],
			pagination: true,
	        autoplayHoverPause: true
		});
		$('body').delegate(".brandcaro.caro-next-brand", 'click', this, function () {
			brandCaro.trigger('owl.next');
		});
		$('body').delegate(".brandcaro.caro-prev-brand", 'click', this, function () {
			brandCaro.trigger('owl.prev');
		});
	}
}