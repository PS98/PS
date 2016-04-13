"use strict";

angular.module("psApp").directive("selectCentre", function () {
    return {
        templateUrl: "psApp/carService/selectCentre.html",
        link: function (scope, element, attrs) {
            initializeGoogleMap("", 'mapholder', "", false, scope.MapCallback);
            $('.jelect').jelect();
           
        },
        controller: ["$scope", "psDataServices", "$state", function ($scope, psDataServices, $state) {
            $scope.state = $state;
            $scope.$parent.state = $state;
            $scope.center.services = [['Tyers', 'MOT', 'Servicing', 'betteries', 'Breaks ', 'Exhausts'], ['Air-conditioning recharge', 'Shock Absorbers', 'Nitrogern Filled Tyres']];
            $scope.selectedCentre = "";
            $scope.selectServiceCentre = function (centre) {
                if (!centre.activeCentre) {
                    $scope.selectedCentre.activeCentre = false;
                    centre.activeCentre = true;
                    $scope.selectedCentre = centre;
                    myClick(centre.$$hashKey, $scope.centreList);
                } else {
                    $state.go("service.appointment");
                }
            }
            $scope.getCentreDetails = function (area) {
                if(!area)
                    area = $scope.area;

                if (area.toLowerCase() !== "select area") {
                    psDataServices.getServiceCentreList($scope.city, area).
                        success(function (data) {
                            if (data.length > 0) {
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
                            }
                        }).error(function() {
                        });
                } else {
                    removemarker();
                }

            }
            psDataServices.getServiceCentreCity().success(function (data) {
                $scope.car.centreCity = data;
               // initializeGoogleMap('autocomplete', 'mapholder', "", false,);
            });

            $scope.getServiceCentreArea = function () {
                if ($scope.city.toLowerCase() !== "select city") {
                    psDataServices.getServiceCentreArea($scope.city).success(function(data) {
                        $scope.car.centreArea = data;
                        if ($scope.car.centreArea.includes($scope.googleMapArea)) {
                            $scope.area = $scope.googleMapArea;''
                            $('.select.jelect').find('#areaDropDown').text($scope.googleMapArea);
                            $scope.getCentreDetails($scope.googleMapArea);
                        } else {
                            getLatLng($scope.city,10);
                        }

                    });
                } else {
                    $scope.car.centreArea = {};
                    removemarker();
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
            $scope.MapCallback = function (city, area) {
                $scope.googleMapArea = area;

                if ($scope.car.centreCity.includes(city)) {
                    $scope.city = city;

                    $('.select.jelect').find('#cityDropDown').text(city);
                    $scope.getServiceCentreArea();
                } else {
                    getLatLng("India");
                }
            }
            function removemarker() {
                removeMarker();
            }
           
        }]


    };
});