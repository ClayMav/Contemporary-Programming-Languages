// Tell ESLint that we have access to the Leaflet global variable
/* global L */
(function() {
  'use strict';

  const trackerURL = 'https://delivery-trackinator.appspot.com';
  $.ajax(trackerURL, {
    statusCode: {
      404: function() {
        trackerURL = '.';
      }
    }
  });
  const rollaCenter = [37.9544, -91.7744];
  const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const osmAttrib = [
    'Map data ©',
    '<a bhref="http://openstreetmap.org">OpenStreetMap</a>',
    'contributors',
  ].join(' ');

  // We want to create icons from these paths. Note that all we need
  // is the path part of the URL because we're loading them from our
  // filesystem.
  const iconPaths = [
    'images/0.png', 'images/1.png', 'images/2.png', 'images/3.png',
    'images/4.png', 'images/5.png',
  ];

  /*
   *  Your code goes here!
   */

  let mapElement = document.getElementById('map');
  let mymap = L.map(mapElement).setView(rollaCenter, 16);
  L.tileLayer(osmUrl, {
    attribution: osmAttrib,
    maxZoom: 18,
  }).addTo(mymap);

  let resZoom = document.getElementById('resetZoom');
  resZoom.addEventListener('click', function(e) {
    e.preventDefault();
    mymap.flyTo(rollaCenter, 16);
    return false;
  }, true);

  let markers = {};
  let noneYet = document.getElementById('noDeliveries');
  let noneY = true;
  let completed = document.getElementById('completedDeliveries');
  update();

  /** 
   * @description Updates the map and all markers, calls itself asynchronously
   */
  function update() {
    $.getJSON(trackerURL + '/position.json', (data) => {
      let inators = [];
      for (let i of data) {
        inators.push(i.Inator);
        if (i.Inator in markers) {
          markers[i.Inator].setLatLng(L.latLng(i.Lat, i.Long));
        } else {
          markers[i.Inator] = new L.Marker([i.Lat, i.Long], {icon: L.icon({
            iconUrl: iconPaths[i.Disposition],
            iconSize: [31, 48],
            iconAnchor: [15, 48],
            popupAnchor: [0, -48],
          })}).bindPopup(i.Inator);
          mymap.addLayer(markers[i.Inator]);
        }
      }
      for (let i in markers) {
        if (inators.indexOf(i) == -1) {
          if (noneY) {
            noneY = false;
            noneYet.remove();
          }
          let node = document.createElement('LI');
          let d = new Date();
          let textnode = document.createTextNode(i + ' delivered at ' +
            d.toISOString());
          node.appendChild(textnode);
          completed.appendChild(node);
          mymap.removeLayer(markers[i]);
          delete markers[i];
        }
      }
    });
    setTimeout(function() {
      update();
    }, 500);
  }
})();
