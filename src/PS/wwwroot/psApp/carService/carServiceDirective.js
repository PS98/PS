
angular.module("psApp").directive("carService", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "psApp/carService/carServiceTemplate.html",
        // controller: "indexController",
        link: function (scope, el, attrs) {

            function get_location() {
                if (geo_position_js.init()) {
                    geo_position_js.getCurrentPosition(show_map, handle_error);
                }
            }
            function show_map(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var latlon = new google.maps.LatLng(lat, lon)
                var mapholder = document.getElementById('mapholder')
                mapholder.style.height = '250px';
                mapholder.style.width = '500px';

                var myOptions = {
                    center: latlon, zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: false,
                    navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
                }

                var map = new google.maps.Map(document.getElementById("mapholder"), myOptions);
                var marker = new google.maps.Marker({ position: latlon, map: map, title: "You are here!" });
                var infowindow = new google.maps.InfoWindow({
                    content: "You are here!"
                });

                infowindow.open(map,marker);
            
            }
            function handle_error(err) {
                switch (err.code) {
                    case error.PERMISSION_DENIED:
                        x.innerHTML = "User denied the request for Geolocation."
                        break;
                    case error.POSITION_UNAVAILABLE:
                        x.innerHTML = "Location information is unavailable."
                        break;
                    case error.TIMEOUT:
                        x.innerHTML = "The request to get user location timed out."
                        break;
                    case error.UNKNOWN_ERROR:
                        x.innerHTML = "An unknown error occurred."
                        break;
                }
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(show_map, handle_error);
            } else {
                error('not supported');
            }

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