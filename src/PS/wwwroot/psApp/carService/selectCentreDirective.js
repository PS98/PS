"use strict";

angular.module("psApp").directive("selectCentre", function () {
    return {
        templateUrl: "psApp/carService/selectCentre.html",
        link: function (scope, element) {
            var userMap, autocomplete, userLocation = { "lat": "", "lng": "" }, marker, userAddressComponent, userLatLng, radius;
            var mapOptions = {
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
            };
            var infowindow = google && google.maps ? new google.maps.InfoWindow() : "";
            var geocoder = google.maps ? new google.maps.Geocoder() : "";


            $(".jelect").jelect();
            var latLng;
            if (!scope.centreDetails.area) {
                getUserscurrentLocation();
            } else {
                latLng = new google.maps.LatLng(scope.centreDetails.userAddress.lat, scope.centreDetails.userAddress.lng);
                initialize(latLng);
                setTimeout(function() {
                    setMarkers(scope.centreDetails.map, scope.centreDetails.centreList, scope.markerClick);
                }, 20);

            }

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
                radius = position.coords.accuracy;
                scope.setUserLocation(lat, lng);
                userLocation.lat = lat;
                userLocation.lng = lng;
                scope.selectUserLocation();

            }
            function handleError(error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        break;
                    case error.POSITION_UNAVAILABLE:
                       alert("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                       alert("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        alert("An unknown error occurred.");
                        break;
                }
                var geoType = { 'address': "India" };
                callGeoCoderApi(geoType).then(function (data) {
                    var lat = data.result.geometry.location.lat();
                    var lng = data.result.geometry.location.lng();
                latLng = new google.maps.LatLng(lat,lng);
                var mapProp = {
                    center: latLng,
                    zoom: 4,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById("mapholder"), mapProp);
                scope.centreDetails.map = map;
                });
            }
            function initialzeUserAddressMap() {
                userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
                mapOptions.center = userLatLng;
                scope.setUserLocation(userLocation.lat, userLocation.lng);
                userMap = new google.maps.Map(document.getElementById("userAddressMap"), mapOptions);

                autocomplete = null;
                autocomplete = new google.maps.places.Autocomplete(document.getElementById("users_formatted_address"), { types: ["geocode"] });
                radius = radius ? radius : 30;
                var circle = new google.maps.Circle({
                    center: userLocation,
                    radius: radius
                });
                autocomplete.setBounds(circle.getBounds());

                google.maps.event.addListener(autocomplete, "place_changed", setAutocomplete);
                // autocomplete.bindTo('bounds', userMap);
                marker = new google.maps.Marker({ position: userLatLng, map: userMap, draggable: true , animation: google.maps.Animation.DROP});


                google.maps.event.addListener(marker, "dragend", function () {
                    scope.setUserLocation(marker.position.lat(), marker.position.lng());
                    userLocation.lat = marker.position.lat();
                    userLocation.lng = marker.position.lng();
                    userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
                    getFullAddress(userLatLng);

                });
            }
            function getFullAddress(latLngObj) {
                var geoType = { 'latLng': latLngObj };
                callGeoCoderApi(geoType).then(function (data) {
                    if (document.getElementById("users_formatted_address")) {
                        document.getElementById("users_formatted_address").value = data.result.formatted_address;
                    }
                    userAddressComponent = data.result;
                });
            }
            function setAutocomplete() {
                infowindow.close();
                marker.setVisible(false);
                var place = autocomplete.getPlace();

                // If the place has a geometry, then present it on a map.
                //if (place.geometry.viewport) {
                //    userMap.fitBounds(place.geometry.viewport);
                //} else {
                    userMap.setCenter(place.geometry.location);
                    userMap.setZoom(15);
               // }
                userLocation.lat = place.geometry.location.lat();
                userLocation.lng = place.geometry.location.lng();
                scope.setUserLocation(userLocation.lat, userLocation.lng);
                marker.setPosition(place.geometry.location);
                marker.setVisible(true);
                userAddressComponent = place;

            }
            function initialize(latLngobj) {
                var mapProp = {
                    center: latLngobj,
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById("mapholder"), mapProp);
                //  var marker = new google.maps.Marker({ position: latLng, map: map, title: "here" });
                scope.centreDetails.map = map;
            };
         
            scope.selectUserLocation = function () {
                var userCityArea;
                var latLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
               
                initialize(latLng);
                if (userAddressComponent && userAddressComponent.address_components.length>3) {
                    userCityArea = getCityAreaFromAddressComponent(userAddressComponent);
                    scope.centreDetails.userAddress = userCityArea;
                    scope.MapCallback(userCityArea.city, userCityArea.area);

                }
                else {
                    var geoType = { 'latLng': latLng };

                    callGeoCoderApi(geoType).then(function (data) {
                        userCityArea = getCityAreaFromAddressComponent(data.result);
                        scope.centreDetails.userAddress = userCityArea;
                        scope.MapCallback(userCityArea.city, userCityArea.area);

                    });
                }

            }
            $("#addressOverlay").on("shown.bs.modal", function() {
                if (userLocation.lat !== "") {
                    if (scope.area !== scope.userDetails.area) {
                        initialzeUserAddressMap();
                    }
                        getFullAddress(userLatLng);
                } else {
                    var address = { 'address': scope.area };
                    callGeoCoderApi(address).then(function(data) {
                        userLocation.lat = data.result.geometry.location.lat();
                        userLocation.lng = data.result.geometry.location.lng();
                        userAddressComponent = data.result;
                        initialzeUserAddressMap();
                        if (document.getElementById("users_formatted_address")) {
                            document.getElementById("users_formatted_address").value = data.result.formatted_address;
                        }
                    });
                }
            });

        },
        controller: "selectCentreController"
    }
});