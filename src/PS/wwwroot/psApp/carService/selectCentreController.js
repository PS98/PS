"use strict";

angular.module("psApp").controller("selectCentreController", ["$scope", "psDataServices", "$state", "$localStorage", function ($scope, psDataServices, $state, $localStorage) {
    $scope.state = $state;
    $scope.centreDetails = psDataServices.getCentreDetails($scope.centreDetails) ? psDataServices.getCentreDetails($scope.centreDetails) : {};
  //  $scope.centreDetails.area = $localStorage.userData.area;
    //$scope.centreDetails.selectedCentre = "";
    $scope.selectServiceCentre = function (centre) {
        if (!centre.activeCentre) {
            $scope.centreDetails.selectedCentre.activeCentre = false;
            centre.activeCentre = true;
            $scope.centreDetails.selectedCentre = centre;
            myClick(centre.$$hashKey, $scope.centreDetails.centreList);
            $("html, body").animate({
                scrollTop: 50
            }, 'slow');
        } else {
            psDataServices.setCentreDetails($scope.centreDetails);
            $state.go("service.appointment");
        }
    }
    $scope.getCentreDetails = function (area) {
        if (!area)
            area = $scope.centreDetails.area;
        $localStorage.userData.area = area;

        if (area && area.toLowerCase() !== "select area") {
            psDataServices.getServiceCentreList($scope.centreDetails.city, area).
                success(function (data) {
                    if (data.length > 0) {
                        removemarker();
                        $scope.centreDetails.centreList = [];
                        $scope.centreDetails.centreList = data;
                        $scope.centreDetails.selectedCentre = $scope.centreDetails.centreList[0];
                        $scope.centreDetails.selectedCentre.activeCentre = true;
                        $scope.centreDetails.recommendedCentre = $scope.centreDetails.centreList[0];
                        //$scope.centreDetails.centreList = $scope.centreDetails.centreList.slice(1);
                        $scope.centreDetails.centreList[$scope.centreDetails.centreList.indexOf($scope.centreDetails.selectedCentre)].activeCentre = true;
                        setMarkers($scope.centreDetails.map, $scope.centreDetails.centreList, $scope.markerClick);
                        $scope.noCentreMatch = false;
                        $scope.noServiceMatch = false;
                    } else {
                        if (!$scope.centreDetails.areaList.includes($scope.centreDetails.area))
                            $scope.noCentreMatch = true;
                        else {
                            $scope.noServiceMatch = true;
                        }
                        $scope.centreDetails.centreList = [];
                        $scope.centreDetails.selectedCentre = {};
                        $scope.centreDetails.recommendedCentre = {};
                    }
                }).error(function () {
                });
        } else {
            removemarker();
            $scope.centreDetails.centreList = [];
            $scope.centreDetails.selectedCentre = {};
            $scope.centreDetails.recommendedCentre = {};
        }

    }
    if (!$scope.centreDetails.cityList || $scope.centreDetails.cityList.length ===0)
        psDataServices.getServiceCentreCity().success(function(data) {
            $scope.centreDetails.cityList = data;
        });
    else {
        if ($scope.centreDetails.cityList.includes($scope.centreDetails.city)) {
            $('.select.jelect').find('#cityDropDown').text($scope.centreDetails.city);
        }
        if ($scope.centreDetails.areaList.includes($scope.centreDetails.area)) {
            $('.select.jelect').find('#areaDropDown').text($scope.centreDetails.area);
        }
    }
    $scope.setUserLocation = function (lat, lng) {
        $localStorage.userData.lat = lat;
        $localStorage.userData.lng = lng;
    }

    $scope.getServiceCentreArea = function () {
        $localStorage.userData.city = $scope.city;
        if ($scope.city.toLowerCase() !== "select city") {
            psDataServices.getServiceCentreArea($scope.city).success(function (data) {
                removemarker();
                $scope.centreDetails.areaList = data;

                if ($scope.centreDetails.areaList.includes($scope.googleMapArea)) {
                    $scope.centreDetails.area = $scope.googleMapArea;
                    $('.select.jelect').find('#areaDropDown').text($scope.googleMapArea);
                    $scope.googleMapArea = "";
                }
                $scope.getCentreDetails($scope.googleMapArea);
            });
        }
        else {
            $scope.centreDetails.areaList = {};
            removemarker();
            $('.select.jelect').find('#areaDropDown').text("Select Area");
            $scope.centreDetails.centreList = [];
            $scope.centreDetails.selectedCentre = {};
            $scope.centreDetails.recommendedCentre = {};

        }
    }

    $scope.markerClick = function (centre) {
        if (centre.$$hashKey != $scope.centreDetails.selectedCentre.$$hashKey) {
            $scope.centreDetails.selectedCentre.activeCentre = false;
            centre.activeCentre = true;
            $scope.centreDetails.selectedCentre = centre;
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
        psDataServices.setuserAddress($scope.centreDetails.userAddress);

        if ($scope.centreDetails.cityList.includes(city)) {
            $scope.centreDetails.city = city;

            $('.select.jelect').find('#cityDropDown').text(city);
            $scope.getServiceCentreArea();
        }
       
    }
    function removemarker() {
        removeMarker();
    }
    //if ($localStorage.userData.area) {
    //    $('.select.jelect').find('#cityDropDown').text($localStorage.userData.city);
    //    $('.select.jelect').find('#areaDropDown').text($localStorage.userData.area);

    //    $scope.centreDetails.city = $localStorage.userData.city;
    //    $scope.getServiceCentreArea();
    //   // $scope.getCentreDetails($localStorage.userData.area);
    //}

}]);
