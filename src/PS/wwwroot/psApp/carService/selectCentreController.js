"use strict";

angular.module("psApp").controller("selectCentreController", ["$scope", "psDataServices", "$state", "$localStorage", function ($scope, psDataServices, $state, $localStorage) {
    $scope.state = $state;
    $scope.centreDetails = psDataServices.getCentreDetails() ? psDataServices.getCentreDetails() : {};
    if (!$scope.centreDetails.selectedCentre) {
        $scope.userLastLocation = {};
        $scope.userLastLocation.lat = $localStorage.userData.lat;
        $scope.userLastLocation.lng = $localStorage.userData.lng;
    }
    $scope.selectedService = psDataServices.getSelectedServiceName() || [];
    $scope.selectServiceCentre = function (centre) {
        if (!centre.activeCentre) {
            $scope.centreDetails.selectedCentre.activeCentre = false;
            centre.activeCentre = true;
            $scope.centreDetails.selectedCentre = centre;
            myClick(centre.$$hashKey, $scope.centreDetails.centreList);
            $scope.getScrollPosition(3).then(function (data) {
                $scope.scrollContent(data);
            });
            $scope.setWorkingHours($scope.centreDetails.selectedCentre);
        } else {
            psDataServices.setCentreDetails($scope.centreDetails);
            //  $state.go("service.appointment");
            $scope.changeStep(4);
        }
    }
    $scope.getCentreDetails = function (area) {
        //  if (!area)
        area = $scope.centreDetails.area;
        $localStorage.userData.area = area;
        $scope.noCentreMatch = false;
        $scope.noServiceMatch = false;
        //  if (area && area.toLowerCase() !== "select area") {
        psDataServices.getServiceCentreList($scope.centreDetails.city, area).
            success(function (data) {
                if (data.list.length > 0) {
                    removemarker();
                    //  $('#areaDropDown').setJelect(area);
                    $scope.centreDetails.centreList = [];
                    $scope.centreDetails.centreList = data.list;
                    $scope.centreDetails.selectedCentre = $scope.centreDetails.centreList[0];
                    $scope.centreDetails.selectedCentre.activeCentre = true;
                    $scope.centreDetails.recommendedCentre = $scope.centreDetails.centreList[0];
                    //$scope.centreDetails.centreList = $scope.centreDetails.centreList.slice(1);
                    $scope.centreDetails.centreList[$scope.centreDetails.centreList.indexOf($scope.centreDetails.selectedCentre)].activeCentre = true;
                    setMarkers($scope.centreDetails.map, $scope.centreDetails.centreList, $scope.markerClick);
                    $scope.noCentreMatch = false;
                    $scope.noServiceMatch = false;
                    $scope.setWorkingHours($scope.centreDetails.selectedCentre);
                } else {
                    if (data.status === 0) {
                        $scope.noServiceMatch = true;
                        $scope.noCentreMatch = false;
                    }
                    if (data.status === 1) {
                        $scope.noCentreMatch = true;
                        $scope.noServiceMatch = false;
                    }
                    removeCentreDetails();

                }
            }).error(function () {
            });
        //} else {
        //    removeCentreDetails();
        //}

    }
    if (!$scope.centreDetails.cityList || $scope.centreDetails.cityList.length === 0)
        psDataServices.getServiceCentreCity().success(function (data) {
            $scope.centreDetails.cityList = data;
        });

    $scope.setUserLocation = function (lat, lng) {
        $localStorage.userData.lat = lat;
        $localStorage.userData.lng = lng;
    }

    $scope.getServiceCentreArea = function () {
        $scope.noCentreMatch = false;
        $scope.noServiceMatch = false;
        $localStorage.userData.city = $scope.city;
        if ($scope.city.toLowerCase() !== "select city") {
            psDataServices.getServiceCentreArea($scope.city).success(function (data) {
                removemarker();
                //  $scope.centreDetails.areaList = data;
                if ($scope.googleMapArea && $scope.googleMapArea !== "") {
                    getNearerCentreList();
                }

            });
        }
        else {
            //   $scope.centreDetails.areaList = {};
            removeCentreDetails();
            //$('.select.jelect').find('#areaDropDown').text("Select Area");
            //$scope.area = "Select Area";
            // $('#areaDropDown').setJelect("");
        }
    }
    function getNearerCentreList() {
        //if ($scope.centreDetails.areaList.indexOf($scope.googleMapArea) > -1) {
        $scope.getCentreDetails($scope.googleMapArea);
        $scope.centreDetails.area = $scope.googleMapArea;
        $scope.area = $scope.googleMapArea;
        //   $('#areaDropDown').setJelect($scope.googleMapArea);
        $scope.googleMapArea = "";
        //} else {
        //     $scope.area = "Select Area";
        //     $('#areaDropDown').setJelect("");
        //    $scope.noCentreMatch = true;
        //    removeCentreDetails();
        //    $scope.loadCity($scope.city);
        //}
    }

    function removeCentreDetails() {
        removemarker();
        $scope.centreDetails.centreList = [];
        $scope.centreDetails.selectedCentre = {};
        $scope.centreDetails.recommendedCentre = {};
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
        //  if ($scope.area && $scope.area.toLowerCase() !== "select area") {
        $("#addressOverlay").modal('toggle');
        //} else {
        //    removeCentreDetails();
        //}
    }

    $scope.MapCallback = function (city, area) {
        $scope.googleMapArea = area;
        $localStorage.userData.area = area;
        $localStorage.userData.city = city;
        psDataServices.setuserAddress($scope.centreDetails.userAddress);

        if ($scope.centreDetails.cityList && $scope.centreDetails.cityList.indexOf(city) > -1) {
            $scope.centreDetails.city = city;
            $scope.city = city;
            $('#cityDropDown').setJelect(city);
            getNearerCentreList();
        } else if (!$scope.isDataLoaded) {
            psDataServices.getServiceCentreCity().success(function (data) {
                $scope.centreDetails.cityList = data;
                $scope.isDataLoaded = true;
                $scope.MapCallback(city, area);
                return;
            });
        } else {
            $scope.city = "Select City";
            $('#cityDropDown').setJelect("");
            $('#areaDropDown').setJelect("");
            $scope.area = "Select Area";
            $scope.loadCity("India", 4);
        }

    }
    function removemarker() {
        removeMarker();
    }
    $scope.setCentreDetails = function () {
        psDataServices.setCentreDetails($scope.centreDetails);
    }
    $scope.setWorkingHours = function (centre) {
        $scope.centreWorkingHours = [];
        var today = new Date();
        var weekDays = [0, 1, 2, 3, 4, 5, 6];
        var day = today.getDay();
        var d1 = new Date();
        var d2 = new Date();
        var startingFrom = weekDays.splice(weekDays.indexOf(day), weekDays.length);
        weekDays = startingFrom.concat(weekDays);

        $.each(weekDays, function (i, v) {
            var obj = { day: "", time: "" };

            obj.day = getDay(v);
            obj.time = getTime(centre, v);

            $scope.centreWorkingHours.push(obj);
        });

        var openingTime = amPmToHours(centre.openingHours);
        var closingTime = amPmToHours(centre.closingHours);

        if (openingTime)
            openingTime = openingTime.split(":");
        if (closingTime) {
            closingTime = closingTime.split(":");
            if (closingTime[0] === "0") {
                d2.setDate(today.getDate() + 1);
            }
        }

        d1.setHours(openingTime[0], openingTime[1], 0);
        d2.setHours(closingTime[0], closingTime[1], 0);

        $scope.opneNow = d2.getTime() > today.getTime() && today.getTime() > d1.getTime();
    }
    function amPmToHours(time) {
        if (time) {
            var hours = Number(time.match(/^(\d+)/)[1]);
            var minutes = Number(time.match(/:(\d+)/)[1]);
            var ampm = time.match(/\s(.*)$/)[1];
            ampm = ampm.toLowerCase();
            if (ampm === "pm" && hours < 12) hours = hours + 12;
            if (ampm === "am" && hours === 12) hours = hours - 12;
            var sHours = hours.toString() + ":" + minutes.toString();
            return (sHours);
        }
    }
    function getDay(day) {
        var weekday;
        switch (day) {
            case 0:
                weekday = "Sun";
                break;
            case 1:
                weekday = "Mon";
                break;
            case 2:
                weekday = "Tue";
                break;
            case 3:
                weekday = "Wed";
                break;
            case 4:
                weekday = "Thus";
                break;
            case 5:
                weekday = "Fri";
                break;
            case 6:
                weekday = "Sat";
                break;
        }
        return weekday;

    }

    function getTime(centre, day) {
        if (day === centre.holiday) {
            return "holiday";
        }
        if (!centre.openingHours)
            centre.openingHours = "9:30 AM";
        if (!centre.closingHours)
            centre.closingHours = "8:00 PM";
        return centre.openingHours + " to " + centre.closingHours;
    }
    if ($scope.centreDetails.selectedCentre) {
        $scope.setWorkingHours($scope.centreDetails.selectedCentre);
    }
}]);
