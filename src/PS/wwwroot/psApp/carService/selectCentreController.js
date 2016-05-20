"use strict";

angular.module("psApp").controller("selectCentreController", ["$scope", "psDataServices", "$state", "$localStorage", function ($scope, psDataServices, $state, $localStorage) {
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
            $("html, body").animate({
                scrollTop: 50
            }, 'fast');
        } else {
            psDataServices.setSelectedCentre($scope.selectedCentre);
            $state.go("service.appointment");
        }
    }
    $scope.getCentreDetails = function (area) {
        if (!area)
            area = $scope.area;
        $localStorage.userData.area = area;

        if (area && area.toLowerCase() !== "select area") {
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
                        $scope.noCentreMatch = false;
                    } else {
                        if (!$scope.car.centreArea.includes($scope.area))
                            $scope.noCentreMatch = true;
                        else {
                            $scope.noServiceMatch = true;
                        }
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
        if ($scope.area && $scope.area.toLowerCase() !== "select area")
        $("#addressOverlay").modal('toggle');
    }

    $scope.MapCallback = function (city, area) {
        $scope.googleMapArea = area;
        $localStorage.userData.area = area;
        $localStorage.userData.city = city;
        psDataServices.setuserAddress($scope.userAddress);

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
    if ($localStorage.userData.area) {
        $('.select.jelect').find('#cityDropDown').text($localStorage.userData.city);
        $('.select.jelect').find('#areaDropDown').text($localStorage.userData.area);

        $scope.city = $localStorage.userData.city;
        $scope.getServiceCentreArea();
       // $scope.getCentreDetails($localStorage.userData.area);
    }

}]);
