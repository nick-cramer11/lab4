//Map: Custom Basemap
var map = L.map('map').setView([43.8, -120.6], 7);

//GOAL: Map of railroads in Oregon using custom Mapbox basemap
//Sources: Mapbox (tile layer), ChatGPT and Stack Overflow (debugging)

//create map
L.tileLayer('https://api.mapbox.com/styles/v1/nick-cramer11/clonhe0tu003o01r64nhfaz59/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmljay1jcmFtZXIxMSIsImEiOiJjbG9peW5tZ3owY2c0MmttaWJwemU1ZmIyIn0.we0TvzWqYCpQhcmXdl3xNg', {
    attribution: '© <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 14,
}).addTo(map);

//load GeoJSON data for county boundaries
fetch('data/oregon_county_boundary.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        //add as a layer and move to back
        L.geoJSON(data, {
            style: {
                color: 'green',
                weight: 1,
                fillOpacity: 0
            },
            onEachFeature: function (feature, layer) {
                //customize pop-up
                layer.bindPopup('<i>' + feature.properties.instName + '</i>');
            }
        }).addTo(map).bringToBack();
    });

//load GeoJSON data for railroads
fetch('data/railroads2019.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        //create main and shadow layers
        var railroadLayer = L.geoJSON(data, {
            style: {
                color: 'blue',
                weight: 2,
                opacity: 1
            },
            onEachFeature: function (feature, layer) {
                //customize pop-up
                layer.bindPopup('<b>Railroad Name: </b>' + toNormalCase(feature.properties.RR_NAME));
            }
        }).addTo(map);

        var shadowLayer = L.geoJSON(data, {
            style: {
                color: 'black',
                weight: 5,
                opacity: 0.5
            }
        }).addTo(map);

        //move shadow layer to back
        shadowLayer.bringToBack();

        //move railroad layer to front
        railroadLayer.bringToFront();
    });

//add title card
var titleCard = L.control({
    position: 'topright'
});

titleCard.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'title-card');
    div.innerHTML = '<h2>Railroads in Oregon</h2><p>Made by Nicholas Cramer</p><p>GEOG 371 - Lab 4</p>';
    return div;
};

titleCard.addTo(map);

//custom styles for title card
var titleCardStyle = document.querySelector('.title-card');
titleCardStyle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
titleCardStyle.style.padding = '10px';
titleCardStyle.style.border = '1px solid #ccc';
titleCardStyle.style.borderRadius = '5px';

//convert text to normal case
function toNormalCase(text) {
    return text.split(' ').map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}
