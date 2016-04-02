"use strict";

angular.module("psApp").directive("selectCentre", function () {
    return {
        templateUrl: "psApp/carService/selectCentre.html",
        link: function (scope, element, attrs) {
          initializeGoogleMap('autocomplete', 'mapholder', "", "",false);
            $('body').delegate('.dropdown-menu li', 'click', function() {

                $('#txtArea').val($(this).text());
                scope.$parent.getCentreDetails($(this).text());

            });
        

            // function to get lat and lng on click of googlemap
            function placeMarker(location, map) {
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                });
                var infowindow = new google.maps.InfoWindow({
                    content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
                });
                console.log(location.lng());
                console.log(location.lat());
                infowindow.open(map, marker);
            }
           // initialize();

        }


    };
});