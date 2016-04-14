"use strict";

angular.module("index").directive("ourBrands", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "ext-modules/index/ourBrandsTemplate.html",
       // controller: "indexController",
        link: function (scope, el, attrs) {
           // prviousBrandDetails();
        }
    };
});

//var prviousBrandDetails = function () {
    
//	if ( $(".brand-carousel").length ) {
//		/*** Brands Carousel ***/
//		var brandCaro = $(".brand-carousel");
//		brandCaro.owlCarousel({
//			autoPlay: false,
//			pagination: false,
//			items : 6,
//			itemsDesktop : [1000,5],
//			itemsDesktopSmall : [900,3],
//			itemsTablet: [600,2]
//		});

//		$(".caro-next-brand").on('click', this, function(){
//			brandCaro.trigger('owl.next');
//		});
//		$(".caro-prev-brand").on('click', this, function(){
//			brandCaro.trigger('owl.prev');
//		});
//	}
//}