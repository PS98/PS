"use strict";

angular.module("psApp").directive("selectCentre", function () {
    return {
        templateUrl: "psApp/carService/selectCentre.html",
        link: function (scope, element) {
            var userMap, autocomplete, tempLocation = {}, userCurrentAddress = {}, marker, userAddressComponent, userLatLng, radius, latLng, isSelectClick;
            var mapOptions = {
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
            };
            $(".jelect").jelect();
            var infowindow = google && google.maps ? new google.maps.InfoWindow() : "";

            if (!scope.centreDetails.area) {
                getUserscurrentLocation();
            } else {
                latLng = new google.maps.LatLng(scope.centreDetails.userAddress.lat, scope.centreDetails.userAddress.lng);
                initialize(latLng);
                setTimeout(function () {
                    setMarkers(scope.centreDetails.map, scope.centreDetails.centreList, scope.markerClick);
                    if (scope.centreDetails.cityList.includes(scope.centreDetails.city)) {
                        scope.city = scope.centreDetails.city;
                        $('#cityDropDown').setJelect(scope.centreDetails.city);
                    }
                    if (scope.centreDetails.areaList.includes(scope.centreDetails.area)) {
                        scope.area = scope.centreDetails.area;
                        $('#areaDropDown').setJelect(scope.centreDetails.area);
                    }
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
                //  scope.setUserLocation(lat, lng);
                userCurrentAddress.lat = lat;
                userCurrentAddress.lng = lng;
                scope.selectUserLocation(true);

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
                loadMapForArea("India",4);
            }

            function loadMapForArea(place,zoom) {
                var geoType = { 'address': place };
                callGeoCoderApi(geoType).then(function (data) {
                    var lat = data.result.geometry.location.lat();
                    var lng = data.result.geometry.location.lng();
                    latLng = new google.maps.LatLng(lat, lng);
                    var mapProp = {
                        center: latLng,
                        zoom: 12,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    if (zoom) {
                        mapProp.zoom = zoom;
                    }
                    scope.centreDetails.map = new google.maps.Map(document.getElementById("mapholder"), mapProp);
                  //  var map =
                   // scope.centreDetails.map = map;
                });
            }
            scope.selectUserLocation = function (isUserLocated) {
                isSelectClick = true;
                var userCityArea;
                if (isUserLocated) {
                    latLng = new google.maps.LatLng(userCurrentAddress.lat, userCurrentAddress.lng);
                    scope.setUserLocation(userCurrentAddress.lat, userCurrentAddress.lng);
                } else {
                    latLng = new google.maps.LatLng(tempLocation.lat, tempLocation.lng);
                    scope.setUserLocation(tempLocation.lat, tempLocation.lng);
                }

                initialize(latLng);
                if (userAddressComponent && userAddressComponent.address_components.length > 3) {
                    userCityArea = getCityAreaFromAddressComponent(userAddressComponent);
                    scope.centreDetails.userAddress = userCityArea;
                    scope.centreDetails.userAddress.lat = tempLocation.lat;
                    scope.centreDetails.userAddress.lng = tempLocation.lng;
                    scope.MapCallback(userCityArea.city, userCityArea.area);

                }
                else {
                    var geoType = { 'latLng': latLng };

                    callGeoCoderApi(geoType).then(function (data) {
                        userCityArea = getCityAreaFromAddressComponent(data.result);
                        scope.centreDetails.userAddress = userCityArea;
                        scope.centreDetails.userAddress.lat = tempLocation.lat;
                        scope.centreDetails.userAddress.lng = tempLocation.lng;
                        scope.MapCallback(userCityArea.city, userCityArea.area);
                        if (isUserLocated)
                            userCurrentAddress.area = userCityArea.area;
                    });
                }

            }
            function initialzeUserAddressMap(lat, lng) {
                userLatLng = new google.maps.LatLng(lat, lng);
                mapOptions.center = userLatLng;
                tempLocation.lat = lat;
                tempLocation.lng = lng;
                // scope.setUserLocation(userLocation.lat, userLocation.lng);
                userMap = new google.maps.Map(document.getElementById("userAddressMap"), mapOptions);

                autocomplete = null;
                autocomplete = new google.maps.places.Autocomplete(document.getElementById("users_formatted_address"), { types: ["geocode"] });
                radius = radius ? radius : 30;
                var circle = new google.maps.Circle({
                    center: tempLocation,
                    radius: radius
                });
                autocomplete.setBounds(circle.getBounds());

                google.maps.event.addListener(autocomplete, "place_changed", setAutocomplete);
                // autocomplete.bindTo('bounds', userMap);
                marker = new google.maps.Marker({ position: userLatLng, map: userMap, draggable: true, animation: google.maps.Animation.DROP });


                google.maps.event.addListener(marker, "dragend", function () {
                  //  scope.setUserLocation(marker.position.lat(), marker.position.lng());
                    tempLocation.lat = marker.position.lat();
                    tempLocation.lng = marker.position.lng();
                    userLatLng = new google.maps.LatLng(tempLocation.lat, tempLocation.lng);
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
                tempLocation.lat = place.geometry.location.lat();
                tempLocation.lng = place.geometry.location.lng();
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
                scope.centreDetails.map= new google.maps.Map(document.getElementById("mapholder"), mapProp);
                //  var marker = new google.maps.Marker({ position: latLng, map: map, title: "here" });
            };
            scope.loadUserMap = function () {
                    if (scope.area !== userCurrentAddress.area) {
                        var address = { 'address': scope.area + " " + scope.city };
                        callGeoCoderApi(address).then(function (data) {
                            // userLocation.lat = data.result.geometry.location.lat();
                            // userLocation.lng = data.result.geometry.location.lng();
                            userAddressComponent = data.result;
                            initialzeUserAddressMap(data.result.geometry.location.lat(), data.result.geometry.location.lng());
                            if (document.getElementById("users_formatted_address")) {
                                document.getElementById("users_formatted_address").value = data.result.formatted_address;
                            }
                        });
                }
            }

            $("#addressOverlay").on("shown.bs.modal", function () {
                isSelectClick = false;
                scope.loadUserMap();
                if (scope.area === userCurrentAddress.area) {
                    initialzeUserAddressMap(userCurrentAddress.lat, userCurrentAddress.lng);
                    getFullAddress(userLatLng);
                }
            });
            $("#addressOverlay").on("hidden.bs.modal", function () {
                if (!isSelectClick) {
                    var oldVal = $("#areaDropDown").siblings(".jelect-input").attr("data-old");
                    scope.area = oldVal;
                    $("#areaDropDown").setJelect(oldVal);
                }
            });
            scope.loadCity=function(city) {
                loadMapForArea(city);
            }
        },
        controller: "selectCentreController"
    }
});