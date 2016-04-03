"use strict";

angular.module("psApp").directive("selectCentre", function () {
    return {
        templateUrl: "psApp/carService/selectCentre.html",
        link: function (scope, element, attrs) {
           // initializeGoogleMap('autocomplete', 'mapholder', "", "", false);
            var latlng = new google.maps.LatLng(18.520266, 73.856406);
            var options =
            {
                zoom: 14,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
            };

            var map = new google.maps.Map(document.getElementById("mapholder"), options);
            scope.map = map;
            var marker = new google.maps.Marker(
            {
                position: latlng,
                map: map,
                title: "Pune"
            });

           map.setCenter(marker.getPosition());



            $('body').delegate('.dropdown-menu li', 'click', function() {

                $('#txtArea').val($(this).text());
                scope.getCentreDetails($(this).text());

            });
        
        }, controller: ["$scope", "psDataServices", "$state", function ($scope, psDataServices, $state) {
            $scope.center.services = [['Tyers', 'MOT', 'Servicing', 'betteries', 'Breaks ', 'Exhausts'], ['Air-conditioning recharge', 'Shock Absorbers', 'Nitrogern Filled Tyres']];
            $scope.selectedCentre = "";
            $scope.showOnMap = function (centre) {
                $scope.selectedCentre.activeCentre = false;
                centre.activeCentre = true;
                $scope.selectedCentre = centre;
               myClick(centre.$$hashKey, $scope.centreList);
            }
            $scope.selectCentre = function (centre) {
                $state.go("service.appointment");
            }
            $scope.getCentreDetails = function (area) {
                psDataServices.getServiceCentreList('Pune', area).
                 success(function (data) {
                     $scope.centreList = data;
                     $scope.selectedCentre = $scope.centreList[0];
                     $scope.selectedCentre.activeCentre = true;
                     $scope.recommendedCentre = $scope.centreList[0];
                     //$scope.centreList = $scope.centreList.slice(1);
                     $scope.centreList[$scope.centreList.indexOf($scope.selectedCentre)].activeCentre = true;
                     setMarkers($scope.map, $scope.centreList);
                 }).error(function () {
                 });

            }
            psDataServices.getServiceCentreCity().success(function (data) {
                $scope.car.centreCity = data;
            });
            psDataServices.getServiceCentreArea("Pune").success(function (data) {
                $scope.car.centreArea = data;
            });
        }]


    };
});