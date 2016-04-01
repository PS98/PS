
var placeSearch, autocomplete, autocomplete_textarea, googleMapHolder, map, markersLocations, googleMapMarkers = [];
var infowindow = new google.maps.InfoWindow();

var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initializeGoogleMap(textBoxId, mapHolderId, autocompleteCallback, locations) {
    googleMapHolder = "";
    googleMapHolder = mapHolderId;

    autocomplete = new google.maps.places.Autocomplete(
       (document.getElementById(textBoxId)),
        { types: ['geocode'] });
    if (autocompleteCallback !="")
    google.maps.event.addListener(autocomplete, 'place_changed',function() {
        autocompleteCallback(autocomplete);
    });

   if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showMap, handleError);
    } else {
        error('Google Map is not supported');
   }
   markersLocations = locations;
}

function showMap(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var latlon = new google.maps.LatLng(lat, lon);
    var mapholder = document.getElementById(googleMapHolder);
    mapholder.style.height = "200px";
    mapholder.style.width = "500px";


    var myOptions = {
        center: latlon, zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
    }

    map = new google.maps.Map(document.getElementById(googleMapHolder), myOptions);
    var marker = new google.maps.Marker({ position: latlon, map: map, title: "You are here!" });
    infowindow.setContent("You are here!");
    infowindow.open(map, marker);

    if (markersLocations)
        setMarkers(map, markersLocations);

}
function handleError(err) {
    switch (err.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred.";
            break;
    }
}









function fillInAddress(autocomplete) {
  var place = autocomplete.getPlace();
  console.log(place.geometry.location.lng());
  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
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

function locate(list) {
    setMarkers(map, list);
}


function setMarkers(map, locations) {

    var latlngset,markers =[];
    var bounds = new google.maps.LatLngBounds();
    $.each(locations, function(index, val) {

        //var lat = val.latitude;
        //var long = val.longitute;


        var lat = val.longitute;
        var long = val.latitude;
        latlngset = new google.maps.LatLng(lat, long);

        var marker = new google.maps.Marker({
            map: map,
            position: latlngset
        });
        map.setCenter(marker.getPosition());


        var content = val.name;

        bounds.extend(marker.position);

        google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
            return function () {
               infowindow.setContent(content);
                infowindow.open(map, marker);
            };
        })(marker, content, infowindow));

        googleMapMarkers.push(marker);

    });
    
    map.fitBounds(bounds);
}
function myClick(id) {
    var mapMarker;
    $.each(googleMapMarkers, function (index, val) {

        if (val._id == id) {
            mapMarker = val;
        }
    });
    google.maps.event.trigger(mapMarker, 'click');
}
