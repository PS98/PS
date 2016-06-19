"use strict";

angular.module("psApp").directive("admin", function () {
    return {
        templateUrl: "psapp/admin/admin.html",
        link: function (scope, element, attrs) {
            $('.jelect').jelect();
            var centreLocation = {}, centreLatLng, defaultLatLong = new google.maps.LatLng("18.5204303", "73.85674369999992"), centreMap, marker, autocomplete,centreCityArea;
            var mapOptions = {
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
            };
            $("#centreAddressOverlay").on("shown.bs.modal", function () {
               
                // scope.setUserLocation(userLocation.lat, userLocation.lng);
                mapOptions.center = defaultLatLong;
                centreMap = new google.maps.Map(document.getElementById("centreAddressMap"), mapOptions);

                autocomplete = null;
                autocomplete = new google.maps.places.Autocomplete(document.getElementById("centre_formatted_address"), { types: ["geocode"] });

                var circle = new google.maps.Circle({
                    center: defaultLatLong,
                    radius: 30
            });
                autocomplete.setBounds(circle.getBounds());

                google.maps.event.addListener(autocomplete, "place_changed", setAutocomplete);
                // autocomplete.bindTo('bounds', centreMap);
                marker = new google.maps.Marker({ position: defaultLatLong, map: centreMap, draggable: true, animation: google.maps.Animation.DROP });


                google.maps.event.addListener(marker, "dragend", function () {
                    //  scope.setUserLocation(marker.position.lat(), marker.position.lng());
                    centreLocation.lat = marker.position.lat();
                    centreLocation.lng = marker.position.lng();
                    centreLatLng = new google.maps.LatLng(centreLocation.lat, centreLocation.lng);
                    getFullAddress(centreLatLng);

                });
            });
            function getFullAddress(latLngObj) {
                var geoType = { 'latLng': latLngObj };
                callGeoCoderApi(geoType).then(function (data) {
                    if (document.getElementById("centre_formatted_address")) {
                        document.getElementById("centre_formatted_address").value = data.result.formatted_address;
                    }
                    centreCityArea = getCityAreaFromAddressComponent(data.result);

                });
            }
            function setAutocomplete() {
                infowindow.close();
                marker.setVisible(false);
                var place = autocomplete.getPlace();
                centreMap.setCenter(place.geometry.location);
                centreMap.setZoom(15);
               centreLocation.lat = place.geometry.location.lat();
                centreLocation.lng = place.geometry.location.lng();
                marker.setPosition(place.geometry.location);
                marker.setVisible(true);
                centreCityArea = getCityAreaFromAddressComponent(place);
               
            }
            scope.selectLocation = function() {
                scope.centreDetails.Latitude = centreLocation.lat;
                scope.centreDetails.Longitude = centreLocation.lng;
                scope.centreDetails.formattedAddress = document.getElementById("centre_formatted_address").value;
                scope.centreDetails.Area = centreCityArea.area;
            }
        },
        controller: ["$scope", "psDataServices", function ($scope, psDataServices) {
            $scope.carList = {}; $scope.centreDetails = {}; $scope.showBrandName = true; var centreObject = {};
            var obj = function(){
                this["ModelList"] = [];
                this["MilematePrice"] = 0;
                this["ActualPrice"] = 0;
                this["ServiceCentrePrice"] = 0;
                
            }
            var serviceObj = function () {

                this["Name"] = "";
                this["Radius"] = "";
                this["Petrol"] = [];
                this["Diesel"] = [];
                this["CNG"] = [];
                this["Electric"] = [];
            }
            psDataServices.geMockData().
                        success(function (data) {
                            $scope.centreDetails = data;
                            angular.extend(centreObject, data);
                        })
                        .error(function () {
                        });


            psDataServices.getAllCarColletion().
                              success(function (data) {
                                  $scope.carList.carCollections = data.carList;

                              }).error(function () {
                              });
            $scope.selectBrand = function (brandName) {
                $scope.showBrandName = false; $scope.showModel = true;
                $scope.brand = brandName;
                $scope.modelList = $scope.modelList || [];
                psDataServices.getCarType(brandName).
                 success(function (data) {
                     $scope.carList.carTypes = data;
                 }).error(function () {
                 });
            }
            $scope.selectModel = function (type) {
                $scope.modelList = $scope.modelList || [];

                if ($scope.modelList.indexOf(type) < 0)
                    $scope.modelList.push(type);
                else {
                    $scope.modelList.splice($scope.modelList.indexOf(type), 1);
                }

            }
            $scope.addCentreDetails = function () {
                var services = new serviceObj();
                var model = new obj();
                if ($scope.modelList && $scope.modelList.length > 0) {
                    model.ModelList = $scope.modelList;
                    $scope.centreDetails.nearAreas = $scope.nearAreas;
                    model.ActualPrice = $scope.centreDetails.ActualPrice;
                    model.MilematePrice = $scope.centreDetails.MilematePrice;
                    model.ServiceCentrePrice = $scope.centreDetails.ServiceCentrePrice;
                    services.Name = $scope.service;
                    services.Radius = $scope.radius;
                    $scope.centreDetails.ServiceDetails = [];
                    switch ($scope.centreDetails.type) {
                    case "Petrol":
                        services.Petrol.push(model);
                        $scope.centreDetails.ServiceDetails.push(services);
                        break;
                    case "Diesel":
                        services.Diesel.push(model);
                        $scope.centreDetails.ServiceDetails.push(services);
                        break;
                    case "CNG":
                        services.CNG.push(model);
                        $scope.centreDetails.ServiceDetails.push(services);
                        break;
                    case "Electric":
                        services.Electric.push(model);
                        $scope.centreDetails.ServiceDetails.push(services);
                        break;
                    }
                }
                console.log($scope.centreDetails);
                psDataServices.saveCentreDetails($scope.centreDetails).
                            success(function (data) {
                                alert(data.message);
                                if (data.status === 0) {
                                   // $scope.centreDetails = {};
                                  //  angular.extend($scope.centreDetails, centreObject);
                                    $scope.centreDetails.Id = parseInt(data.id);
                                    $scope.newCentre = false;
                                }
                            });
            }
            $scope.editBrand = function () {
                $scope.showBrandName = !$scope.showBrandName; $scope.showModel = !$scope.showModel;
            }
            $scope.openOverlay = function() {
                $("#centreAddressOverlay").modal("toggle");
            }
          //  $scope.AreaList = ["Pimpri", "Chinchwad", "Kothrud", "Aundh", "Pashan", "Baner", "Koregaon Park", "Shivaji Nagar", "Pune Railway", "Swargate", "Boat club", "Magarpatta", "Daund", "Chikhli", "Kalewadi", "Kasarwadi", "Phugewadi ", "Pimple Saudagar", "Narayan peth", "Talegaon", "Kasba peth", "Shirur", "Bhor", "Mulshi", "Wadgaon", "Welhe", "Ambegaon", "Junnar", "Rajgurunagar", "Baramati", "Indapur", "Purandhar", "Bhawani Peth", "Erandwana", "Ghorpuri Lines", "Kalyani Nagar", "Kondhwa", "Narayan Peth", "Hadapsar", "Akurdi"];
            $scope.addArea = function (area) {
                $scope.nearAreas = $scope.nearAreas || [];
                if ($scope.nearAreas.indexOf(area) < 0)
                    $scope.nearAreas.push(area);
                else {
                    $scope.nearAreas.splice($scope.nearAreas.indexOf(area), 1);
                }
            }
        }]

    };
});