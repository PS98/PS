"use strict";

angular.module("index").directive("customerFeedback", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "psApp/index/customerFeedbackTemplate.html",
       // controller: "indexController",
        link: function (scope, el, attrs) {
            Core.initialize();
            PrevNextFeedbackDetails();
        }
    };
});



var PrevNextFeedbackDetails = function () {
    
    if ($(".column-carousel").length) {
		/*** feedback Carousel ***/
	    var feedbackCaro = $(".column-carousel.owl-carousel");
		feedbackCaro.owlCarousel({
		    autoPlay: true,
		    autoplayTimeout: 1000,
			items : 3,
			itemsDesktop : [1000,5],
			itemsDesktopSmall : [900,3],
			itemsTablet: [600, 2],
			dots: true,
			autoplayHoverPause: true,
			loop: true,
            pagination : true
		});
		$('body').delegate(".feedbackcaro.caro-next-brand", 'click', this, function () {
		    feedbackCaro.trigger('owl.next');
		});
		$('body').delegate(".feedbackcaro.caro-prev-brand", 'click', this, function () {
		    feedbackCaro.trigger('owl.prev');
		});
	}
}

