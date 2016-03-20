
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

            $('body').delegate('.js-filter', 'click', function () {
                $(this).toggleClass('filter-up filter-down')
            });

            /////////////////////////////////////////////////////////////////
            // Сustomization select
            /////////////////////////////////////////////////////////////////

            $('.jelect').jelect();
        },
        controller: "carServiceController",
        // controllerAs: "vm"
    };
});

angular.module("psApp").directive("carServiceCategory", function () {

       return {
           scope:true,
           //restrict: 'E',
           //scope:{
           //    serviceType: '='
           //},

           template: '<div class="row spacet-10">' +
                   '<div class="col-sm-12">' +
                    '  <div class="select-service-box">' +
                    ' <ul>' +
                    ' <li ng-click="addSelectedJob(job)" ng-repeat="job in commonServices">' +
                    '<div class="icon-service-plus pull-left"></div>' +
                    ' {{ job.type }}' +
                    '<div class="service-details pull-right" ng-click="showDetails(job); $event.stopPropagation();" ng-if="job.details">Details</div>' +
                                                      '  </li> </ul> </div> </div> </div>',
        //controller: controller
    };

});