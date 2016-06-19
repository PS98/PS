
var placeSearch, autocomplete, autocomplete_textarea, googleMapHolder, map, googleMapMarkers = [], displayCurrentLocation, latlon, userLocation = {}, locationCall, draggable;
var infowindow = google.maps ? new google.maps.InfoWindow() : "";
var geocoder = google.maps ? new google.maps.Geocoder() : "";

var componentForm = {
    //street_number: 'short_name',
    //premise: "short_name",
    //route: 'long_name',
    sublocality_level_1: "short_name",
    sublocality_level_2: "short_name",
    administrative_area_level_2: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

var mapOptions = {
    center: latlon,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    //mapTypeControl: false,
    //navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
}


function initializeGoogleMap(textBoxId, mapHolderId, autocompleteCallback, currentLocation, locationCallBack, candrag) {
    googleMapHolder = "";
    googleMapHolder = mapHolderId;
    displayCurrentLocation = currentLocation;
    locationCall = locationCallBack;
    if (textBoxId !== "") {
        autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById(textBoxId)),
        { types: ['geocode'] });
        if (autocompleteCallback != "")
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                autocompleteCallback(autocomplete);
            });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showMap, handleError);
    } else {
        error('Google Map is not supported');
    }
    if (candrag) {
        draggable = candrag;
    } else {
        draggable = false;
    }
    return autocomplete;
}

function showMap(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    latlon = new google.maps.LatLng(lat, lon);
    // var mapholder = document.getElementById(googleMapHolder);
    //mapholder.style.height = "200px";
    //mapholder.style.width = "500px";
    mapOptions.center = latlon;
    locateCityAndArea(latlon);
    if (displayCurrentLocation) {
        mapOptions.zoom = 12;
    }
    map = new google.maps.Map(document.getElementById(googleMapHolder), mapOptions);

    if (displayCurrentLocation) {
        var marker = new google.maps.Marker({ position: latlon, map: map, title: "You are here!", draggable: draggable });
        infowindow.setContent("You are here!");
        infowindow.open(map, marker);
        if (draggable) {
            google.maps.event.addListener(marker, 'drag', function () {
                // document.getElementById('lat').value = marker.position.lat();
                //document.getElementById('lng').value = marker.position.lng();
                var latlong = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                locateCityAndArea(latlong);
            }
            );
        }
    }

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
    getLatLng('India');

}
function loadMap(lat, lng, zoom) {
    if (!zoom)
        zoom = 4;
    latlon = new google.maps.LatLng(lat, lng);
    mapOptions.center = latlon;
    mapOptions.zoom = zoom;
    map = new google.maps.Map(document.getElementById(googleMapHolder), mapOptions);
}

function loadCurrentLocation(data) {
    if (locationCall)
        locationCall(data.city, data.area);

}
function locateCityAndArea(latlng) {

    var geoType = { 'latLng': latlng };

    callGeoCoderApi(geoType).then(function (data) {
        var obj = getCityAreaFromAddressComponent(data.result);
        loadCurrentLocation(obj);

    });

    //return { city: result.city, area: result.area };
}
function getCityAreaFromAddressComponent(results) {
    var route, street_number, neighborhood, sublocality_level_3, sublocality_level_2, city, area, locality, country, state, pinCode;

    var addressLine1, addressLine2;
    for (var i = 0; i < results.address_components.length; i++) {
        for (var b = 0; b < results.address_components[i].types.length; b++) {
            if (results.address_components[i].types[b] == "route") {
                route = results.address_components[i].long_name;

            }

            if (results.address_components[i].types[b] == "street_number") {
                street_number = results.address_components[i].long_name;

            }

            if (results.address_components[i].types[b] == "neighborhood") {
                neighborhood = results.address_components[i].long_name;

            }
            if (results.address_components[i].types[b] == "sublocality_level_3") {
                sublocality_level_3 = results.address_components[i].long_name;

            }
            if (results.address_components[i].types[b] == "sublocality_level_2") {
                sublocality_level_2 = results.address_components[i].long_name;

            }

            if (results.address_components[i].types[b] == "sublocality_level_1") {
                area = results.address_components[i].long_name;

            }
           
            if (results.address_components[i].types[b] == "locality") {
                locality = results.address_components[i].long_name;

            }
            if (results.address_components[i].types[b] == "administrative_area_level_2") {
                city = results.address_components[i].long_name;
            }

            if (results.address_components[i].types[b] == "administrative_area_level_1") {
                state = results.address_components[i].long_name;

            }
            if (results.address_components[i].types[b] == "country") {
                country = results.address_components[i].long_name;

            }
            if (results.address_components[i].types[b] == "postal_code") {
                pinCode = results.address_components[i].long_name;
                break;
            }
           
        }
    }
    route = route ? route : '';
    street_number = street_number ? street_number : "";
    neighborhood = neighborhood ? neighborhood : "";
    sublocality_level_3 = sublocality_level_3 ? sublocality_level_3 : "";
    sublocality_level_2 = sublocality_level_2 ? sublocality_level_2 : "";
    locality = locality ? locality : "";
    addressLine1 = route ;
    addressLine2 = street_number + " " + neighborhood + " " + sublocality_level_3 + " " + sublocality_level_2 + " " + area + " " + locality;
    return { "city": city, "area": area, "locality": locality, "state": state, "country": country, 'pinCode': pinCode, "addressLine1":addressLine1 ,"addressLine2":addressLine2};
}
function getLatLng(place, zoom) {
    var address = { 'address': place };

    callGeoCoderApi(address).then(function (data) {
        var lat = data.result.geometry.location.lat();
        var lng = data.result.geometry.location.lng();
        loadMap(lat, lng, zoom);
    });

    //return { lat: result.lat, lng: result.lng };

}

function callGeoCoderApi(type) {
    var city, area, lat, lng;
    var defer = new $.Deferred();
    geocoder.geocode(type, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                var obj = { 'result': results[0] };
                defer.resolve(obj);

            } else {
                alert("No results found");
                defer.reject();
            }
        } else {
            // alert("Geocoder failed due to: " + status);
            defer.reject();
        }

    });
    return defer.promise();

}

function fillInAddress(autocomplete) {
    var place = autocomplete.getPlace();
    console.log(place.geometry.location.lng());
    for (var component in componentForm) {
        document.getElementById(component).value = '';
        if (component != "administrative_area_level_2" && component != "administrative_area_level_1" && component != "country" && component != "postal_code") {
            document.getElementById(component).disabled = false;
        }
        fillInAddressToTextBox(place.address_components);
    }
}

function fillInAddressToTextBox(addressComponents, formatted_address) {
    for (var i = 0; i < addressComponents.length; i++) {
        var addressType = addressComponents[i].types[0];
        if (componentForm[addressType]) {
            var val = addressComponents[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
    if (document.getElementById("formatted_address") && formatted_address)
        document.getElementById("formatted_address").value = formatted_address;
}

function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = new google.maps.LatLng(
                position.coords.latitude, position.coords.longitude);
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}


function setMarkers(googleMap, locations, callback) {
    if (googleMap)
        map = googleMap;
    var latlngset, markers = [];
    googleMapMarkers = [];
    var bounds = new google.maps.LatLngBounds();
    infowindow.close();
    $.each(locations, function (index, val) {
        var lat = val.latitude;
        var long = val.longitude;
        latlngset = new google.maps.LatLng(lat, long);

        var marker = new google.maps.Marker({
            map: map,
            position: latlngset,
            animation: google.maps.Animation.DROP
        });

        if(index === 0)
        map.setCenter(marker.getPosition());
       // marker.setMap(map)

        var content = '<div><strong>' + val.name + '</strong><br>' +
                 val.address.line1 + ',<br/>' + val.address.line2 + '<br/>' +
                val.phoneNo + '</div>';

        bounds.extend(marker.position);

        google.maps.event.addListener(marker, 'click', (function (marker, infowindow, callback, val, content) {
            return function () {
                infowindow.setContent(content);
                infowindow.open(map, marker);
                callback(val);
            };
        })(marker, infowindow, callback,val, content));
        if (val.activeCentre) {
            infowindow.open(map, marker);
            infowindow.setContent(content);
        }

        googleMapMarkers.push(marker);

    });

   // map.fitBounds(bounds);
}
function myClick(id, markersLocations) {
    var mapMarkerIndex;


    $.each(markersLocations, function (index, val) {

        if (val.$$hashKey == id) {
            mapMarkerIndex = index;
        }
    });
    google.maps.event.trigger(googleMapMarkers[mapMarkerIndex], 'click');
}
function removeMarker() {

    for (var i = 0; i < googleMapMarkers.length; i++) {
        googleMapMarkers[i].setMap(null);
    }
    googleMapMarkers = [];
}
