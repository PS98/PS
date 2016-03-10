"use strict";

angular.module("psApp").directive("headerContent", function () {
    return {
        templateUrl: "psApp/headerContent/headerContentTemplate.html",
        link: function (scope, element, attrs) {

            makeSyickyHeader();
        }
    };
});
function makeSyickyHeader() {
    $(document).ready(function () {

        var windowHeight = $(window).height();
        var windowWidth = $(window).width();


        var tabletWidth = 767;
        var mobileWidth = 640;


        /////////////////////////////////////
        //  LOADER
        /////////////////////////////////////

        var $preloader = $('#page-preloader'),
        $spinner = $preloader.find('.spinner-loader');
        $spinner.fadeOut();
        $preloader.delay(50).fadeOut('slow');


        /////////////////////////////////////
        //  Sticky Header
        /////////////////////////////////////


        if (windowWidth > tabletWidth) {

            var headerSticky = $(".layout-theme").data("header");
            var headerTop = $(".layout-theme").data("header-top");

            if (headerSticky && headerSticky.length) {
                $(window).on('scroll', function () {
                    var winH = $(window).scrollTop();
                    var $pageHeader = $('.header');
                    if (winH > headerTop) {

                        $('.header').addClass("animated");
                        $('header').addClass("animation-done");
                        $('.header').addClass("bounce");
                        $pageHeader.addClass('sticky');

                    } else {

                        $('.header').removeClass("bounce");
                        $('.header').removeClass("animated");
                        $('.header').removeClass("animation-done");
                        $pageHeader.removeClass('sticky');
                    }
                });
            }
        }


        /////////////////////////////////////
        //  Disable Mobile Animated
        /////////////////////////////////////

        if (windowWidth < mobileWidth) {

            $("body").removeClass("animated-css");

        }


        $('.animated-css .animated:not(.animation-done)').waypoint(function () {

            var animation = $(this).data('animation');

            $(this).addClass('animation-done').addClass(animation);

        }, {
            triggerOnce: true,
            offset: '90%'
        });





        /////////////////////////////////////
        //  Zoom Images
        /////////////////////////////////////





        $(".slider-product a").prettyPhoto({ animation_speed: 'normal', theme: 'light_square', slideshow: 3000 });


        $("a[rel^='prettyPhoto']").prettyPhoto({ animation_speed: 'normal', theme: 'light_square', slideshow: 3000 });



        $(".dropdown").hover(
        function () {
            $('.dropdown-menu', this).stop(true, true).slideDown("fast");
            $(this).toggleClass('open');
        },
        function () {
            $('.dropdown-menu', this).stop(true, true).slideUp("fast");
            $(this).toggleClass('open');
        }
    );


             $(".yamm .navbar-nav>li").hover(
            function () {
                $('.dropdown-menu', this).fadeIn("fast");
            },
            function () {
                $('.dropdown-menu', this).fadeOut("fast");
            });


        window.prettyPrint && prettyPrint();
        $(document).on('click', '.yamm .dropdown-menu', function (e) {
            e.stopPropagation();
        });

        $(document).on('click','.signup-tab',function(e){
            e.preventDefault();
            $('#signup-taba').tab('show');
        });	
	
        $(document).on('click','.signin-tab',function(e){
            e.preventDefault();
            $('#signin-taba').tab('show');
        });
	    	
        $(document).on('click','.forgetpass-tab',function(e){
            e.preventDefault();
            $('#forgetpass-taba').tab('show');
        });

    });
}
