"use strict";

angular.module("psApp").directive("selectCentre", function () {
    return {
        templateUrl: "psApp/carService/selectCentre.html",
        link: function (scope, element, attrs) {
            var placeSearch, autocomplete, autocomplete_textarea;

            var locations = [
                { name: "address one", lat: "18.600534069047335", lng: "73.80731105804443" },
                { name: "address two", lat: "18.610864870248303", lng: "73.80636692047119" },
                { name: "address three", lat: "18.6134678078517", lng: "73.82181644439697" },
                { name: "address four", lat: "18.604438697544907", lng: "73.82130146026611" },
                { name: "address five", lat: "18.610376815014273", lng: "73.79589557647705" },
                { name: "address six", lat: "18.601754275073823", lng: "73.82387638092041" },
                { name: "address seven", lat: "18.60313716466401", lng: "73.83203029632568" },
            ];
      
            initializeGoogleMap('autocomplete', 'mapholder', "", locations);



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