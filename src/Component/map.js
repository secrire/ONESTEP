import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import '../css/member.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

class Map extends React.Component {
    constructor(props){
        super(props);
    }
    
    componentDidMount() {
        // mapboxgl.accessToken = 'pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig';
        // var map = new mapboxgl.Map({
        //     container: 'map',
        //     style: 'mapbox://styles/mapbox/streets-v11',
        //     zoom: 7,
        //     center: [122, 24.5],
        //     // transition: {
        //     //     "duration": 300,
        //     //     "delay": 0.5
        //     //   }
        // });
        // map.setStyle('mapbox://styles/mapbox/satellite-v9')

        if(new URL(location.href).pathname.substr(0,2) !== '/m'){
            console.log('got you')
            document.getElementById("map").style.cssText += 'left: 600px;width:100%;';
        }

        // // draw line between click points
        // var distanceContainer = document.getElementById('distance');

        // // GeoJSON object to hold our measurement features
        // var geojson = {
        //     'type': 'FeatureCollection',
        //     'features': []
        // };

        // // Used to draw a line between points
        // var linestring = {
        //     'type': 'Feature',
        //     'geometry': {
        //         'type': 'LineString',
        //         'coordinates': []
        //     }
        // };

        // map.on('load', function() {
        //     map.addSource('geojson', {
        //         'type': 'geojson',
        //         'data': geojson
        //     });

        //     // Add styles to the map
        //     map.addLayer({
        //         id: 'measure-points',
        //         type: 'circle',
        //         source: 'geojson',
        //         paint: {
        //             'circle-radius': 7,
        //             'circle-color': '#fff'
        //         },
        //         filter: ['in', '$type', 'Point']
        //     });
        //     map.addLayer({
        //         id: 'measure-lines',
        //         type: 'line',
        //         source: 'geojson',
        //         layout: {
        //             'line-cap': 'round',
        //             'line-join': 'round'
        //         },
        //         paint: {
        //             'line-color': '#fff',
        //             'line-width': 3
        //         },
        //         filter: ['in', '$type', 'LineString']
        //     });

        //     map.on('click', function(e) {
        //         var features = map.queryRenderedFeatures(e.point, {
        //             layers: ['measure-points']
        //         });




        //         // Remove the linestring from the group
        //         // So we can redraw it based on the points collection
        //         if (geojson.features.length > 1) geojson.features.pop();

        //         // Clear the Distance container to populate it with a new value
        //         distanceContainer.innerHTML = '';

        //         // If a feature was clicked, remove it from the map
        //         if (features.length) {
        //             var id = features[0].properties.id;
        //             geojson.features = geojson.features.filter(function(point) {
        //                 return point.properties.id !== id;
        //             });
        //         } else {
        //             var point = {
        //                 'type': 'Feature',
        //                 'geometry': {
        //                     'type': 'Point',
        //                     'coordinates': [e.lngLat.lng, e.lngLat.lat]
        //                 },
        //                 'properties': {
        //                     'id': String(new Date().getTime())
        //                 }
        //             };

        //             geojson.features.push(point);
        //         }

        //         if (geojson.features.length > 1) {
        //             linestring.geometry.coordinates = geojson.features.map(function(point) {
        //                 return point.geometry.coordinates;
        //             });

        //             geojson.features.push(linestring);

        //             // Populate the distanceContainer with total distance
        //             // var value = document.createElement('pre');
        //             // value.textContent =
        //             //     'Total distance: ' +
        //             //     turf.length(linestring).toLocaleString() +
        //             //     'km';
        //             // distanceContainer.appendChild(value);
        //         }

        //         map.getSource('geojson').setData(geojson);
        //     });
        // });

        // map.on('mousemove', function(e) {
        //     var features = map.queryRenderedFeatures(e.point, {
        //         layers: ['measure-points']
        //     });
        //     // UI indicator for clicking/hovering a point on the map
        //     map.getCanvas().style.cursor = features.length
        //         ? 'pointer'
        //         : 'crosshair';
        // });
        
    }  
      
  render() {
    return  <div className='map-page'>
                <div id="map"></div>
                {/* <div id="distance" className="distance-container"></div> */}

                {/* <div id="menu">
                    <input
                        id="streets-v11"
                        type="radio"
                        name="rtoggle"
                        value="streets"
                        checked="checked"
                    />
                    <label for="streets-v11">streets</label>
                    <input id="light-v10" type="radio" name="rtoggle" value="light" />
                    <label for="light-v10">light</label>
                    <input id="dark-v10" type="radio" name="rtoggle" value="dark" />
                    <label for="dark-v10">dark</label>
                    <input id="outdoors-v11" type="radio" name="rtoggle" value="outdoors" />
                    <label for="outdoors-v11">outdoors</label>
                    <input id="satellite-v9" type="radio" name="rtoggle" value="satellite" />
                    <label for="satellite-v9">satellite</label>
                </div> */}
            </div>
      }
} 



export default Map;
