"use strict";

angular.module("psApp").directive("footerContent", function () {
    return {
        templateUrl: "psApp/footerContent/footerContentTemplate.html",
        link: function () {
            var mapOptions = {
                center: new google.maps.LatLng("18.5204303", "73.85674369999992"),
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            }
            var map = new google.maps.Map(document.getElementById("footer-map"), mapOptions);
            $(function () {
                $('.scroll[href*=#]:not([href=#])').click(function () {
                  //  if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                        var target = $(this.hash);
                        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                        if (target.length) {
                            $('html,body').animate({
                                scrollTop: target.offset().top
                            }, 1000);
                            return false;
                        }
                   // }
                });
            });

            //////////////////////////////
            // Animated Entrances
            //////////////////////////////
            var windowWidth = $(window).width();
            if (windowWidth > 1200) {

                $(window).scroll(function () {
                    $('.animatedEntrance').each(function () {
                        var imagePos = $(this).offset().top;

                        var topOfWindow = $(window).scrollTop();
                        if (imagePos < topOfWindow + 400) {
                            $(this).addClass("slideUp"); // slideUp, slideDown, slideLeft, slideRight, slideExpandUp, expandUp, fadeIn, expandOpen, bigEntrance, hatch
                        }
                    });
                });

            }
        }

    };
});