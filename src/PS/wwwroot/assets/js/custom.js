/*
| ----------------------------------------------------------------------------------
| TABLE OF CONTENT
| ----------------------------------------------------------------------------------
-SETTING
-Sticky Header
-Dropdown Menu Fade
-Animated Entrances
-Accordion
-Filter accordion
-Chars Start
-Сustomization select
-Zoom Images
-HOME SLIDER
-CAROUSEL PRODUCTS
-PRICE RANGE
-SLIDERS
-Animated WOW
*/

"use strict";

        /////////////////////////////////////////////////////////////////
        // Sliders
        /////////////////////////////////////////////////////////////////

        var Core = {

            initialized: false,

            initialize: function () {

               this.build();

            },

            build: function () {

                // Owl Carousel

                this.initOwlCarousel();
            },
            initOwlCarousel: function (options) {

                $(".enable-owl-carousel").each(function (i) {
                    var $owl = $(this);

                    var itemsData = $owl.data('items');
                    var navigationData = $owl.data('navigation');
                    var paginationData = $owl.data('pagination');
                    var singleItemData = $owl.data('single-item');
                    var autoPlayData = $owl.data('auto-play');
                    var transitionStyleData = $owl.data('transition-style');
                    var mainSliderData = $owl.data('main-text-animation');
                    var afterInitDelay = $owl.data('after-init-delay');
                    var stopOnHoverData = $owl.data('stop-on-hover');
                    var min480 = $owl.data('min480');
                    var min768 = $owl.data('min768');
                    var min992 = $owl.data('min992');
                    var min1200 = $owl.data('min1200');

                    $owl.owlCarousel({
                        navigation: navigationData,
                        pagination: paginationData,
                        singleItem: singleItemData,
                        autoPlay: autoPlayData,
                        transitionStyle: transitionStyleData,
                        stopOnHover: stopOnHoverData,
                        navigationText: ["<i></i>", "<i></i>"],
                        items: itemsData,
                        itemsCustom: [
                                        [0, 1],
                                        [465, min480],
                                        [750, min768],
                                        [975, min992],
                                        [1185, min1200]
                        ],
                        afterInit: function (elem) {
                            if (mainSliderData) {
                                setTimeout(function () {
                                    $('.main-slider_zoomIn').css('visibility', 'visible').removeClass('zoomIn').addClass('zoomIn');
                                    $('.main-slider_fadeInLeft').css('visibility', 'visible').removeClass('fadeInLeft').addClass('fadeInLeft');
                                    $('.main-slider_fadeInLeftBig').css('visibility', 'visible').removeClass('fadeInLeftBig').addClass('fadeInLeftBig');
                                    $('.main-slider_fadeInRightBig').css('visibility', 'visible').removeClass('fadeInRightBig').addClass('fadeInRightBig');
                                }, afterInitDelay);
                            }
                        },
                        beforeMove: function (elem) {
                            if (mainSliderData) {
                                $('.main-slider_zoomIn').css('visibility', 'hidden').removeClass('zoomIn');
                                $('.main-slider_slideInUp').css('visibility', 'hidden').removeClass('slideInUp');
                                $('.main-slider_fadeInLeft').css('visibility', 'hidden').removeClass('fadeInLeft');
                                $('.main-slider_fadeInRight').css('visibility', 'hidden').removeClass('fadeInRight');
                                $('.main-slider_fadeInLeftBig').css('visibility', 'hidden').removeClass('fadeInLeftBig');
                                $('.main-slider_fadeInRightBig').css('visibility', 'hidden').removeClass('fadeInRightBig');
                            }
                        },
                        afterMove: sliderContentAnimate,
                        afterUpdate: sliderContentAnimate,
                    });
                });
                function sliderContentAnimate(elem) {
                    var $elem = elem;
                    var afterMoveDelay = $elem.data('after-move-delay');
                    var mainSliderData = $elem.data('main-text-animation');
                    if (mainSliderData) {
                        setTimeout(function () {
                            $('.main-slider_zoomIn').css('visibility', 'visible').addClass('zoomIn');
                            $('.main-slider_slideInUp').css('visibility', 'visible').addClass('slideInUp');
                            $('.main-slider_fadeInLeft').css('visibility', 'visible').addClass('fadeInLeft');
                            $('.main-slider_fadeInRight').css('visibility', 'visible').addClass('fadeInRight');
                            $('.main-slider_fadeInLeftBig').css('visibility', 'visible').addClass('fadeInLeftBig');
                            $('.main-slider_fadeInRightBig').css('visibility', 'visible').addClass('fadeInRightBig');
                        }, afterMoveDelay);
                    }
                }
            },

        };

        // Core.initialize();

    //});






