// Instantiate the map
var map = L.map('map');

var cartodbAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: cartodbAttribution,
    opacity: 1
}).addTo(map);

// load the map data
var routeData;
var poiData;


$.getJSON($('link[rel="routeData"]').attr("href"), function(data) {
    routeData = L.geoJson(data, {
        style:{
            weight: 2.0,
            opacity: 1.0,
            color: 'red',
        },
        interactive: false
    });

    routeData.addTo(map);
});

// TODO: finish the point loading
$.getJSON($('link[rel="poiData"]').attr("href"), function(data) {

    poiData = L.geoJson(data, {

        onEachFeature: pointInfo,

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    });

    poiData.addTo(map);
});

function pointInfo(feature, layer) {
    var popupContent = "<p><strong>North</strong>: " + feature.properties.north_cue + "</p>" +
                        "<p><strong>South</strong>: " + feature.properties.south_cue + "</p>";

    layer.bindPopup(popupContent);
}

// TODO: break up the data using vectorGrid

map.setView({ lat: 37.5407, lng: -77.4360 }, 13);
