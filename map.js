var firebase = new Firebase("https://atmosphere-5b99c.firebaseio.com/message_list/");
var points = [];

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.522, lng: -0.085},
    zoom: 18,
    styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'on' }]  // Turn off points of interest.
    }, {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
    }],
    disableDoubleClickZoom: true
  });

  // Overlay the heatmap.
  var heat = new google.maps.visualization.HeatmapLayer({
    data: [],
    map: map
  });


  function addSample(snapshot, prevChildKey) {
    // Get latitude and longitude from the cloud.
    var newSample = snapshot.val();

    // Create a google.maps.LatLng object for the position of the marker.
    // A LatLng object literal (as above) could be used, but the heatmap
    // in the next step requires a google.maps.LatLng object.
    var latLng = new google.maps.LatLng(newSample.latitude, newSample.longitude);
    var heartRate = newSample.heartRate;

    heat.getData().push({
      location: latLng,
      weight: heartRate
    });
    console.log(points);

    // Place a marker at that location only if it's new.
    if (null) {
      var marker = new google.maps.Marker({
        position: latLng,
        title: heartRate + 'bpm',
        map: map
      });
    }
  }

  firebase.once("value", function(snapshot) {
    if (snapshot.val() === null) {
      alert("No data yet. Please try later.");
    } else {
      snapshot.forEach(function(sample) {
        addSample(sample, null);
      });
    }
  });

  firebase.on("child_added", addSample);
}
