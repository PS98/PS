"use strict";

angular.module("psApp").directive("selectCentre", function () {
    return {
        templateUrl: "psApp/carService/selectCentre.html",
        link: function (scope, element, attrs) {

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

                infowindow.open(map, marker);

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
        }

    };
});