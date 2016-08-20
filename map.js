var firebase = new Firebase("https://atmosphere-5b99c.firebaseio.com/message_list/");

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 52, lng: -3},
    zoom: 7,
    styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]  // Turn off points of interest.
    }, {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
    }],
    disableDoubleClickZoom: true
  });

  var points = [];

  function addSample(snapshot, prevChildKey) {
    // Get latitude and longitude from the cloud.
    var newSample = snapshot.val();

    // Create a google.maps.LatLng object for the position of the marker.
    // A LatLng object literal (as above) could be used, but the heatmap
    // in the next step requires a google.maps.LatLng object.
    var latLng = new google.maps.LatLng(newSample.latitude, newSample.longitude);
    var heartRate = newSample.heartRate;

    points.push(latLng);

    // Place a marker at that location.
    var marker = new google.maps.Marker({
      position: latLng,
      title: heartRate + 'bpm',
      map: map
    });
  }

  firebase.once("value", function(snapshot) {
    if (snapshot.val() === null) {
      alert("No data yet. Please try later.");
    } else {
      destinations = [];
      snapshot.forEach(function(sample) {
        addSample(sample, null);
        console.log(sample.val());
      });
    }
  });

/*
  // Place a marker at that location.
  var marker = new google.maps.visualization.HeatmapLayer({
    data: points,
    map: map
  });
*/


  firebase.on("child_added", addSample);
}
