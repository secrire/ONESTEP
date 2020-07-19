import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './member.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

class Map extends React.Component {
    constructor(props){
        super(props);
    }
    
    componentDidMount() {
            mapboxgl.accessToken = 'pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig';
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                zoom: 7,
                center: [122, 24.5]
            });
            map.setStyle('mapbox://styles/mapbox/satellite-v9')

            if(new URL(location.href).pathname.substr(0,2) !== '/m'){
                console.log('got you')
                document.getElementById("map").style.cssText += 'left: 750px;width:50%;';
            }
            
        // mapboxgl.accessToken = 'pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig';
        // var map = new mapboxgl.Map({
        //     container: 'map',
        //     style: 'mapbox://styles/mapbox/streets-v11',
        //     zoom: 3,
        //     center: [100, 30]
        // });
        // map.setStyle('mapbox://styles/mapbox/satellite-v9')

        // var layerList = document.getElementById('menu');
        // var inputs = layerList.getElementsByTagName('input');

        // function switchLayer(layer) {
        //     var layerId = layer.target.id;
        //     map.setStyle('mapbox://styles/mapbox/' + layerId);
        // }

        // for (var i = 0; i < inputs.length; i++) {
        //     inputs[i].onclick = switchLayer;
        // } 
        // console.log('mappppppp') 
    }  
      
  render() {
    return  <div className='map-page'>
                <div id="map"></div>
                <div id="menu">
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
                </div>
            </div>
      }
} 



export default Map;
