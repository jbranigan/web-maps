var map = L.map('map', {
    zoomControl: false
});

var floorplan = L.tileLayer('http://branigan.net/maps/floorplan/{z}/{x}/{y}.png', {
    minZoom: 20,
    maxZoom: 22
});

var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
});

var geojson;

// colors from http://www.colourlovers.com/palette/1473/Ocean_Five
// actually from http://www.colourlovers.com/palette/932683/Compatible
function getColor(p) {
    return p == "Meeting" ? '#8EBE94' :
           p == "Phone" ? '#4E395D' :
           p == "Lounge"  ? '#DC5B3E' :
           p == "Relax" ? '#827085' :
           p == "Conference" ? '#CCFC8E' :
            '#CCC';
}
function style(feature) {
    return {
        fillColor: getColor(feature.properties.type),
        weight: 0,
        opacity: 1.0,
        //color: 'black',
        fillOpacity: 0.6
    };
}

function highlightFeature(e) {
    var layer = e.target;

    // doesn't really do much now, but hanging on to it
    layer.setStyle({
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

$.getJSON($('link[rel="areas"]').attr("href"), function(data) {
    //var names = [];
    geojson = L.geoJson(data, {
        style:style,
        onEachFeature: function (feature, layer) {

            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
            });
            //for labels only on hover
            layer.bindLabel(feature.properties.name);

            //static labels
            // var label = L.marker(layer.getBounds().getCenter(), {
            //   icon: L.divIcon({
            //     className: 'label',
            //     html: feature.properties.name,
            //     iconSize: [100, 14]
            //   })
            // }).addTo(map);
        }
    });

    var geoList = new L.Control.GeoJSONSelector(geojson, {
        listItemBuild: function(layer) {
            return L.Util.template('<small><strong>{name}</strong>', layer.feature.properties);
        }
    });
    geoList.on('change', function(e) {
        $('#selection').text(JSON.stringify(e.layers[0].feature.properties));
    });

    map.fitBounds(geojson.getBounds());
    Stamen_TonerLite.addTo(map);
    floorplan.addTo(map);
    geojson.addTo(map);
    map.addControl(L.control.zoom({ position:'topright' }));
    map.addControl(geoList);
});

var legend = L.control({position: 'topright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        types = ['Meeting', 'Phone', 'Lounge', 'Relax', 'Conference'],
        labels = [];

    for (var i = 0; i < types.length; i++) {
        labels.push(
            '<i style="background:' + getColor(types[i]) + '"></i> ' + types[i]);
    }

    labels.push('<i style="background: #fdb462"></i> Other');

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);
