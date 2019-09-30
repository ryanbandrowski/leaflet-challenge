var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(link, function(data) {
    createFeatures(data.features);
});

function createFeatures(data) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3>" +
            "<hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    function circleColor(mag) {
        if(mag < 1) {
          return "lightgreen"
        }
        else if(mag < 2) {
          return "#d1e231"
        }
        else if(mag < 3) {
          return "yellow"
        }
        else if(mag < 4) {
          return "orange"
        }
        else if(mag < 5) {
            return "red"
          }
        else{
          return "darkred"
        }
    }
    function circleRadius(mag) {
        return mag * 20000;
    }
    var earthquakes = L.geoJson(data, {
        pointToLayer: function(data, latlng) {
            return L.circle(latlng, {
                color: circleColor(data.properties.mag),
                radius: circleRadius(data.properties.mag),
                fillOpacity: .7
            });
        },
        onEachFeature: onEachFeature
    })
    createMap(earthquakes);
};

function createMap(earthquakes) {

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });
    var baseMap = {
        "Light Map": lightmap
    };
    var overlayMap = {
        Earthquakes: earthquakes
      };
    var map = L.map("map", {
        center: [40, -105],
        zoom: 4,
        layers: [lightmap]
    });
    L.control.layers(baseMap, overlayMap, {
        collapses: false
    }).addTo(map);

    function legendColor(mag) {
        return mag > 5 ? "darkred" :
            mag > 4  ? "red" :
            mag > 3  ? "orange" :
            mag > 2  ? "yellow" :
            mag > 1  ? "#d1e231" :
                        "lightgreen";
    }

    var legend = L.control({position: "bottomright"});

    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var mags = [0,1,2,3,4,5];
        var labels = [];

        mags.forEach(function(mag, index) {
            if (mags[index+1] != undefined) {labels.push("<li style=\"background-color: " + legendColor(mags[index]+1) + "\">" + mags[index] + ' - ' + mags[index+1] + "</li>")};
            if (mags[index+1] == undefined) {labels.push("<li style=\"background-color: " + legendColor(mags[index]+1) + "\">" + mags[index] + ' +' + "</li>")};
        });
        div.innerHTML += "<ul class=legend>" + labels.join("") + "</ul>";
            return div; 
    };
  legend.addTo(map);
};
