// api key to get the maps displayed
var apiKey =
  'pk.eyJ1IjoiZmlyZXByb29mc29ja3MiLCJhIjoiY2psd2FpbzdpMTRhczNwcGUxb2phcnRuMCJ9.l4EjUexxcYe9PEifJy2NrA'

// define the map layer
eartquakeColormap = L.tileLayer(
  'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BB-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets-basic',
    accessToken: apiKey
  }
)

// Create the map object with zoom 4
var map_object = L.map('mapid', {
  center: [35.7, -94.5],
  zoom: 4
})

// add map object to earthquake map
eartquakeColormap.addTo(map_object)

// Get geoJSON data with AJAX call
d3.json(
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
  function (data) {
    // Get style pointer on for the earthquake point on the map, showing the magnitude in color indicator and radius
    function styleInfo (quakePoint) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(quakePoint.properties.mag),
        color: '#f542dd',
        radius: getRadius(quakePoint.properties.mag),
        stroke: true,
        weight: 0.5
      }
    }

    // Function to get color based on magnitude
    function getColor (magnitude) {
      switch (true) {
        case magnitude > 5:
          return '#f54242'
        case magnitude > 4:
          return '#b942f5'
        case magnitude > 3:
          return '#42cef5'
        case magnitude > 2:
          return '#84f542'
        case magnitude > 1:
          return '#f5e342'
        default:
          return '#f54242'
      }
    }

    // Function to get radius to be displayed on the map
    function getRadius (magnitude) {
      if (magnitude === 0) {
        return 1
      }
      return magnitude * 2
    }

    // Load the AJAX called geoJSON and process in place to load data on the map layer, style the quake point with magnitude and location information based on latitude longitude
    L.geoJson(data, {
      pointToLayer: function (quakePoint, latlng) {
        return L.circleMarker(latlng)
      },
      style: styleInfo,
      onEachFeature: function (quakePoint, layer) {
        layer.bindPopup(
          'Magnitude: ' +
            quakePoint.properties.mag +
            '<br>Location: ' +
            quakePoint.properties.place
        )
      }
    }).addTo(map_object)

    // position the legend for magnitude scale
    var legend = L.control({
      position: 'bottomright'
    })

    // show magintude color range information on the legend.
    legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'info legend')

      var grades = [0, 1, 2, 3, 4, 5]
      var colors = [
        '#f54242',
        '#f5e342',
        '#84f542',
        '#42cef5',
        '#b942f5',
        '#f54242'
      ]

      // create the grade color legend objects on the map
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background: " +
          colors[i] +
          "'></i> " +
          grades[i] +
          (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
      }
      return div
    }

    // add the created legend to the map
    legend.addTo(map_object)
  }
)
