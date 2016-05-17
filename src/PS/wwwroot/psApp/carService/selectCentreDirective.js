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
            var infowindow = google.maps ? new google.maps.InfoWindow() : "";
            var geocoder = google.maps ? new google.maps.Geocoder() : "";
            var autocomplete, userLocation = { "lat": '', "lng": '' }, marker, user_address_component;
            $('.jelect').jelect();
            //   $("#addressOverlay").modal('toggle');
            //  $("#addressOverlay").modal('toggle');
            getUserscurrentLocation();
            function getUserscurrentLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(successCall, handleError);
                } else {
                    error('Google Map is not supported');
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

                userMap = new google.maps.Map(document.getElementById("userAddressMap"), mapOptions);

                autocomplete = null;
                autocomplete = new google.maps.places.Autocomplete(document.getElementById("users_formatted_address"), { types: ['geocode'] });
                google.maps.event.addListener(autocomplete, 'place_changed', setAutocomplete);
                // autocomplete.bindTo('bounds', userMap);
                marker = new google.maps.Marker({ position: userLatLng, map: userMap, draggable: true });


                google.maps.event.addListener(marker, 'drag', function () {

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
            element.delegate('#users_formatted_address', 'focus', function geolocates() {
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
                    scope.MapCallback(userCityArea.city.long_name, userCityArea.area.long_name);

                }
                else {
                    var geoType = { 'latLng': latLng };

                    callGeoCoderApi(geoType).then(function (data) {
                        userCityArea = getCityAreaFromAddressComponent(data.result);
                        scope.MapCallback(userCityArea.city.long_name, userCityArea.area.long_name);

                    });
                }

            }
            $('#addressOverlay').on('shown.bs.modal', function () {
                if (userLocation.lat != "") {
                    if (!userMap)
                        initialzeUserAddressMap();
                }
                else {
                    var address = { 'address': scope.area };
                    callGeoCoderApi(address).then(function (data) {
                        userLocation.lat = data.result.geometry.location.lat();
                        userLocation.lng = data.result.geometry.location.lng();
                        initialzeUserAddressMap();
                    });
                }
            })

        },
        controller: ["$scope", "psDataServices", "$state", "$localStorage", function ($scope, psDataServices, $state, $localStorage) {
            $scope.state = $state;

            //  $scope.$parent.state = $state;
            // $scope.center.services = [['Tyers', 'MOT', 'Servicing', 'betteries', 'Breaks ', 'Exhausts'], ['Air-conditioning recharge', 'Shock Absorbers', 'Nitrogern Filled Tyres']];
            $scope.selectedCentre = "";
            $scope.selectServiceCentre = function (centre) {
                if (!centre.activeCentre) {
                    $scope.selectedCentre.activeCentre = false;
                    centre.activeCentre = true;
                    $scope.selectedCentre = centre;
                    myClick(centre.$$hashKey, $scope.centreList);
                } else {
                    psDataServices.setSelectedCentre($scope.selectedCentre);
                    $state.go("service.appointment");
                }
            }
            $scope.getCentreDetails = function (area) {
                if (!area)
                    area = $scope.area;
                $localStorage.userData.area = area;

                if (area.toLowerCase() !== "select area") {
                    psDataServices.getServiceCentreList($scope.city, area).
                        success(function (data) {
                            if (data.length > 0) {
                                removemarker();
                                $scope.centreList = [];
                                $scope.centreList = data;
                                $scope.selectedCentre = $scope.centreList[0];
                                $scope.selectedCentre.activeCentre = true;
                                $scope.recommendedCentre = $scope.centreList[0];
                                //$scope.centreList = $scope.centreList.slice(1);
                                $scope.centreList[$scope.centreList.indexOf($scope.selectedCentre)].activeCentre = true;
                                setMarkers($scope.map, $scope.centreList, $scope.markerClick);
                            } else {
                                $scope.noCentreMatch = true;
                                $scope.centreList = [];
                                $scope.selectedCentre = {};
                                $scope.recommendedCentre = {};
                            }
                        }).error(function () {
                        });
                } else {
                    removemarker();
                    $scope.centreList = [];
                    $scope.selectedCentre = {};
                    $scope.recommendedCentre = {};
                }

            }
            psDataServices.getServiceCentreCity().success(function (data) {
                $scope.car.centreCity = data;
                // initializeGoogleMap('autocomplete', 'mapholder', "", false,);
            });

            $scope.setUserLocation = function (lat, lng) {
                $localStorage.userData.lat = lat;
                $localStorage.userData.lng = lng;
            }

            $scope.getServiceCentreArea = function () {
                $localStorage.userData.city = $scope.city;
                if ($scope.city.toLowerCase() !== "select city") {
                    psDataServices.getServiceCentreArea($scope.city).success(function (data) {
                        removemarker();
                        $scope.car.centreArea = data;

                        if ($scope.car.centreArea.includes($scope.googleMapArea)) {
                            $scope.area = $scope.googleMapArea;
                            $('.select.jelect').find('#areaDropDown').text($scope.googleMapArea);
                            $scope.googleMapArea = "";
                        }
                        $scope.getCentreDetails($scope.googleMapArea);

                        //else {
                        //    getLatLng($scope.city,10);
                        //}

                    });
                } else {
                    $scope.car.centreArea = {};
                    removemarker();
                    $('.select.jelect').find('#areaDropDown').text("Select Area");
                    $scope.centreList = [];
                    $scope.selectedCentre = {};
                    $scope.recommendedCentre = {};

                }
            }

            $scope.markerClick = function (centre) {
                if (centre.$$hashKey != $scope.selectedCentre.$$hashKey) {
                    $scope.selectedCentre.activeCentre = false;
                    centre.activeCentre = true;
                    $scope.selectedCentre = centre;
                    $scope.$apply();
                }
            }

            $scope.changeArea = function () {
                $("#addressOverlay").modal('toggle');
            }

            $scope.MapCallback = function (city, area) {
                $scope.googleMapArea = area;
                $localStorage.userData.area = area;
                $localStorage.userData.city = city;

                if ($scope.car.centreCity.includes(city)) {
                    $scope.city = city;

                    $('.select.jelect').find('#cityDropDown').text(city);
                    $scope.getServiceCentreArea();
                }
                //else {
                //    getLatLng("area");
                //}
            }
            function removemarker() {
                removeMarker();
            }
            //if ($localStorage.userData.area) {
            //    $('.select.jelect').find('#cityDropDown').text($localStorage.userData.city);
            //    $('.select.jelect').find('#areaDropDown').text($localStorage.userData.area);

            //    $scope.city = $localStorage.userData.city;
            //    $scope.getServiceCentreArea();
            //   // $scope.getCentreDetails($localStorage.userData.area);
            //}

        }]


    };
});