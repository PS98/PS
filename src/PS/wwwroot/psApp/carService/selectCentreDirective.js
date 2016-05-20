"use strict";

angular.module("psApp").directive("selectCentre", function () {
    return {
        templateUrl: "psApp/carService/selectCentre.html",
        link: function (scope, element, attrs) {
            //initializeGoogleMap("", 'mapholder', "", false, scope.MapCallback);
            var userMap; var mapOptions = {
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
            };
            var infowindow = google && google.maps ? new google.maps.InfoWindow() : "";
            var geocoder = google.maps ? new google.maps.Geocoder() : "";
            var autocomplete, userLocation = { "lat": "", "lng": "" }, marker, user_address_component;
            $(".jelect").jelect();
            //   $("#addressOverlay").modal('toggle');
            //  $("#addressOverlay").modal('toggle');
            getUserscurrentLocation();
            function getUserscurrentLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(successCall, handleError);
                } else {
                    error("Google Map is not supported");
                }

            }
            function successCall(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                scope.setUserLocation(lat, lng);
                userLocation.lat = lat;
                userLocation.lng = lng;
                scope.selectUserLocation();

            }
            function initialzeUserAddressMap() {
                var userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);

                getFullAddress(userLatLng);
                mapOptions.center = userLatLng;
                scope.setUserLocation(userLocation.lat, userLocation.lng);
                userMap = new google.maps.Map(document.getElementById("userAddressMap"), mapOptions);

                autocomplete = null;
                autocomplete = new google.maps.places.Autocomplete(document.getElementById("users_formatted_address"), { types: ["geocode"] });
                google.maps.event.addListener(autocomplete, "place_changed", setAutocomplete);
                // autocomplete.bindTo('bounds', userMap);
                marker = new google.maps.Marker({ position: userLatLng, map: userMap, draggable: true });


                google.maps.event.addListener(marker, "drag", function () {

                    scope.setUserLocation(marker.position.lat(), marker.position.lng());
                    userLocation.lat = marker.position.lat();
                    userLocation.lng = marker.position.lng();
                    getFullAddress(userLatLng);

                });
            }
            function getFullAddress(latLng) {
                var geoType = { 'latLng': latLng };
                callGeoCoderApi(geoType).then(function (data) {
                    if (document.getElementById("users_formatted_address")) {
                        document.getElementById("users_formatted_address").value = data.result.formatted_address;
                    }

                });
            }
            function setAutocomplete(auto) {
                infowindow.close();
                marker.setVisible(false);
                var place = autocomplete.getPlace();

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    userMap.fitBounds(place.geometry.viewport);
                } else {
                    userMap.setCenter(place.geometry.location);
                    userMap.setZoom(15);
                }
                userLocation.lat = place.geometry.location.lat();
                userLocation.lng = place.geometry.location.lng();
                scope.setUserLocation(userLocation.lat, userLocation.lng);
                marker.setPosition(place.geometry.location);
                marker.setVisible(true);
                user_address_component = place;

            }
            element.delegate("#users_formatted_address", "focus", function geolocates() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var geolocation = new google.maps.LatLng(
                            position.coords.latitude, position.coords.longitude);
                        var circle = new google.maps.Circle({
                            center: geolocation,
                            radius: 50000
                        });
                        autocomplete.setBounds(circle.getBounds());
                    });
                }
            });
            scope.selectUserLocation = function () {
                var userCityArea;
                var latLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
                function initialize() {
                    var mapProp = {
                        center: latLng,
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("mapholder"), mapProp);
                    //   var marker = new google.maps.Marker({ position: latLng, map: map, title: "here" });
                    scope.map = map;
                }
                initialize();
                if (user_address_component) {
                    userCityArea = getCityAreaFromAddressComponent(user_address_component);
                    scope.userAddress = userCityArea;
                    scope.MapCallback(userCityArea.city, userCityArea.area);

                }
                else {
                    var geoType = { 'latLng': latLng };

                    callGeoCoderApi(geoType).then(function (data) {
                        userCityArea = getCityAreaFromAddressComponent(data.result);
                        scope.userAddress = userCityArea;
                        scope.MapCallback(userCityArea.city, userCityArea.area);

                    });
                }

            }
            $("#addressOverlay").on("shown.bs.modal", function() {
                if (userLocation.lat !== "") {
                    if (!userMap)
                        initialzeUserAddressMap();
                } else {
                    var address = { 'address': scope.area };
                    callGeoCoderApi(address).then(function(data) {
                        userLocation.lat = data.result.geometry.location.lat();
                        userLocation.lng = data.result.geometry.location.lng();
                        initialzeUserAddressMap();
                    });
                }
            });

        },
        controller: "selectCentreController"
    }
});