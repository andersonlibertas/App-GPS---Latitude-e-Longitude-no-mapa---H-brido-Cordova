

var marker;


/*jshint browser:true */
/*global $ */(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
  adicionarMarcador(-20,919, -46,981, 'Original Choop', 'OC', 'img/beer.png');
   
    
     /* button  Button */
    $(document).on("click", "#btnPegarLocalizacao", function(evt)
    {
        /* your code goes here */ 
         /* your code goes here */ 
            var onSucess= function(p){
            var lat = p.coords.latitude;
            var lon = p.coords.longitude;
            getPlacesLocation();
           
            $("#lblLocalizacao").html("Latitude: "+ lat + "\n Longitude: " + lon);
            
            var map = googleMaps.getObjectBySelector('#mapa');
            var latLong = new google.maps.LatLng(lat,lon);
            
                if (marker===undefined){
                    //Caso não exista, cria o marcador
                    marker = new google.maps.Marker({ position: latLong, map: map});
                } else {
                    
                    //altera a posição do marcador
                    marker.setPosition(latLong);
                    
                }
                //centraliza o mapa no local atual
                map.setCenter(marker.getPosition());
            };
                var onError = function(){
                    
                    alert("geolocation falhou");
                };
               

             navigator.geolocation.watchPosition(onSucess, onError, { enableHighAccuracy: true});
         return false;
         return false;
    });
    
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();



    function adicionarMarcador(lat, lon, titulo, texto, icone) {
        var map = googleMaps.getObjectBySelector('#mapa');
        var posicao = new google.maps.LatLng(lat, lon);
        //cria um novo marcador
        var marcador = new google.maps.Marker({
            position: posicao,
            map: map,
            title: titulo,
            label: texto,
            icon: icone
    });
    //adiciona evento ao clicar no marcador
    marcador.addListener('click', function() {
        alert("Você clicou no marcador! " + titulo);
    });
    }



var Map;
var Infowindow;
var Latitude = undefined;
var Longitude = undefined;

// Get geo coordinates

function getPlacesLocation() {
    navigator.geolocation.getCurrentPosition
    (onPlacesSuccess, onPlacesError, { enableHighAccuracy: true });
}

// Success callback for get geo coordinates

var onPlacesSuccess = function (position) {

    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;

    getPlaces(Latitude, Longitude);

}

// Get places by using coordinates

function getPlaces(latitude, longitude) {

    var latLong = new google.maps.LatLng(latitude, longitude);

    var mapOptions = {

        center: new google.maps.LatLng(latitude, longitude),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP

    };

    Map = new google.maps.Map(document.getElementById("places"), mapOptions);

    Infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(Map);
    service.nearbySearch({

        location: latLong,
        radius: 500,
        type: ['pharmacy']
    }, foundStoresCallback);

}

// Success callback for watching your changing position

var onPlacesWatchSuccess = function (position) {

    var updatedLatitude = position.coords.latitude;
    var updatedLongitude = position.coords.longitude;

    if (updatedLatitude != Latitude && updatedLongitude != Longitude) {

        Latitude = updatedLatitude;
        Longitude = updatedLongitude;

        getPlaces(updatedLatitude, updatedLongitude);
    }
}

// Success callback for locating stores in the area

function foundStoresCallback(results, status) {

    if (status === google.maps.places.PlacesServiceStatus.OK) {

        for (var i = 0; i < results.length; i++) {

            createMarker(results[i]);

        }
    }
}

// Place a pin for each store on the map

function createMarker(place) {

    var placeLoc = place.geometry.location;

    var marker = new google.maps.Marker({
        map: Map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {

        Infowindow.setContent(place.name);
        Infowindow.open(Map, this);

    });
}

// Error callback

function onPlacesError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

// Watch your changing position

function watchPlacesPosition() {

    return navigator.geolocation.watchPosition
    (onPlacesWatchSuccess, onPlacesError, { enableHighAccuracy: true });
}




