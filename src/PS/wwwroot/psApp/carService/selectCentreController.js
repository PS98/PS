"use strict";

angular.module("psApp").controller("selectCentreController", ["$scope", "psDataServices", "$state", "$localStorage", function ($scope, psDataServices, $state, $localStorage) {
    $scope.state = $state;
    $scope.centreDetails = psDataServices.getCentreDetails() ? psDataServices.getCentreDetails() : {};
    $scope.selectedService = {};
    $scope.selectedService = psDataServices.getSelectedServiceName() || [];
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
        $scope.noCentreMatch = false;
        $scope.noServiceMatch = false;
        if (area && area.toLowerCase() !== "select area") {
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
                    } else {
                        $scope.noServiceMatch = true;
                        removeCentreDetails();

                    }
                }).error(function () {
                });
        } else {
            removeCentreDetails();
        }

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

        if ($scope.centreDetails.cityList.indexOf(city)> -1) {
            $scope.centreDetails.city = city;
            $scope.city = city;
            $('#cityDropDown').setJelect(city);
           // if (!$scope.centreDetails.areaList || $scope.centreDetails.areaList.length === 0) {
             //   $scope.getServiceCentreArea();
            //} else {
                getNearerCentreList();
           // }
        } else {
            $scope.city = "Select City";
            $('#cityDropDown').setJelect("");
            $('#areaDropDown').setJelect("");
            $scope.area = "Select Area";
            $scope.loadCity("India",4);
        }

    }
    function removemarker() {
        removeMarker();
    }
    $scope.setCentreDetails = function () {
        psDataServices.setCentreDetails($scope.centreDetails);
    }
    $scope.openInformationPopup = function (eventInfo) {
        try {
            var left = (parseInt(eventInfo.screenX) - 100) + "px";
            var top = (parseInt(eventInfo.currentTarget.offsetTop) + 100) + "px";
            $scope.style =
            {
                'top': top,
                'left': left,
                'width':"210px"
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    $("body").click(function (event) {
        if (event.target)
            var id = event.target.id;
        if (id !== "informationPopup") {
            $scope.style = {};
            $scope.$apply();
        }
       
    });
    //if ($localStorage.userData.area) {
    //    $('.select.jelect').find('#cityDropDown').text($localStorage.userData.city);
    //    $('.select.jelect').find('#areaDropDown').text($localStorage.userData.area);

    //    $scope.centreDetails.city = $localStorage.userData.city;
    //    $scope.getServiceCentreArea();
    //   // $scope.getCentreDetails($localStorage.userData.area);
    //}

}]);
