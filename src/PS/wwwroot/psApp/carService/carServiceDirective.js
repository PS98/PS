
angular.module("psApp").directive("carService", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "psApp/carService/carServiceTemplate.html",
        // controller: "indexController",
        link: function (scope, el, attrs) {

            /////////////////////////////////////////////////////////////////
            // Filter accordion
            /////////////////////////////////////////////////////////////////


            $('body').delegate('.js-filter', 'click', function () {
                $(this).prev('.wrap-filter').slideToggle('slow')
            });

            $('body').delegate('.js-filter','click', function () {
                $(this).toggleClass('filter-up filter-down')
            });

            /////////////////////////////////////////////////////////////////
            // Сustomization select
            /////////////////////////////////////////////////////////////////

            $('.jelect').jelect();
        },
        controller: "carServiceController"
    };
});