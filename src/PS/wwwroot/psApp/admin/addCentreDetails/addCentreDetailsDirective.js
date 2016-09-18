angular.module("psApp").directive("addCentreDetails", function() {
    return {
        templateUrl: "psapp/admin/addCentreDetails/addCentreDetails.html",
        replace:true,
        link: function(scope, element, attrs) {
            $('.jelect').jelect();
            var centreLocation = {}, centreLatLng, defaultLatLong = new google.maps.LatLng("18.5204303", "73.85674369999992"), centreMap, marker, autocomplete, centreCityArea;
            var mapOptions = {
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
            };
            $("#centreAddressOverlay").on("shown.bs.modal", function() {

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


                google.maps.event.addListener(marker, "dragend", function() {
                    //  scope.setUserLocation(marker.position.lat(), marker.position.lng());
                    centreLocation.lat = marker.position.lat();
                    centreLocation.lng = marker.position.lng();
                    centreLatLng = new google.maps.LatLng(centreLocation.lat, centreLocation.lng);
                    getFullAddress(centreLatLng);

                });
            });

            function getFullAddress(latLngObj) {
                var geoType = { 'latLng': latLngObj };
                callGeoCoderApi(geoType).then(function(data) {
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
                scope.centreDetails.latitude = centreLocation.lat;
                scope.centreDetails.longitude = centreLocation.lng;
                scope.centreDetails.formattedAddress = document.getElementById("centre_formatted_address").value;
                scope.centreDetails.area = centreCityArea.area;
            }
        },
        controller: "addCentreDetailsController"

    };
});