// We create the tile layer that will be the background of our map.
console.log("Part 1: Create the Earthquake Visualization");

var graymap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }
);


// Create map  object with options
var map = L.map("map", {
    center: [
        40.7, -94.5
    ],
     zoom: 3
});

// Add graymap tile layer
graymap.addTo(map);

// Call for the earthquake geoJSON data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(function(data) {

  // Return the data for each of the earthquakes we plot passing magnitudee to get the color/ radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

    //Set color of marker to bge determined by magnitude of earthquake.
    function getColor(depth) {
        switch (true) {
        case depth > 90:
            return "#ea2c2c";
        case depth > 70:
            return "#ea822c";
        case depth > 50:
            return "#ee9c00";
        case depth > 30:
            return "#eecc00";
        case depth > 10:
            return "#d4ee00";
        default:
            return "#98ee00";
        }
    }

 //Radius of earthquake's marker based on magnitude. 
  function getRadius(magnitude)  {
    if (magnitude === 0) {
      return 1; 
    }  
    return magnitude * 4;
  }


    
 // Add a GeoJSON layer to the map 
  L.geoJson(data, {
     // Each geoJson feature becomes a marker on the map.
     pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
     // Set the style for each marker on the map w styleInfo: function
    style: styleInfo,
    // Create a opup for each marker to display the magnitude and location
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2]
          + "<br>Location: "
          + feature.properties.place
      );
    }
  }).addTo(map);

  // Here we create a legend control object.
  var legend = L.control({
    position: "bottomright"
  });

          
 //Add details to it
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    
    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];
        
      //Loop through to generate colored square marker with labels per interval
      for (var i = 0; i < grades.length; i++) {
       div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
        
  // Add legend to the map.
  legend.addTo(map);
});


