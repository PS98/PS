"use strict";

angular.module("index").directive("realFacts", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "psApp/index/realfactsTemplate.html",
        link: function (scope, el, attrs) {
           /////////////////////////////////////
    //  Chars Start
    /////////////////////////////////////

    if ($('body').length) {
        $(window).on('scroll', function () {
            var winH = $(window).scrollTop();

            $('.list-progress').waypoint(function () {
                $('.chart').each(function () {
                    CharsStart();
                });
            }, {
                offset: '80%'
            });
        });
    }


    function CharsStart() {
        $('.chart').easyPieChart({
            barColor: false,
            trackColor: false,
            scaleColor: false,
            scaleLength: false,
            lineCap: false,
            lineWidth: false,
            size: false,
            animate: 7000,

            onStep: function (from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            }
        });

    }
        }
    };
});

