import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import '../css/member.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

import Map from "./map";


let map;
let today = new Date().toJSON().slice(0,10);
let urlUserUID = new URL(location.href).pathname.substr(2);

class MContent extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            userTrips:[],
            tripIDs:[],
            addTripStart: today,
            addTripEnd: today,
            addTripSum:''
        };    
    }

    componentDidMount() {
        let user = firebase.auth().currentUser;
        let urlUserUID = new URL(location.href).pathname.substr(2);

        mapboxgl.accessToken = 'pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig';
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-v9',
            zoom: 2,
            center: [10, 30],
        });

        let geojson = {
            'type': 'FeatureCollection',
            'features': []
        };

        firebase
            .firestore()
            .collection('trips')
            .orderBy('createTime','desc')
            .onSnapshot(querySnapshot => {
                let data=[];      
                let tripID=[];
                querySnapshot.forEach(doc => {
                    if(urlUserUID === doc.data().authorUid){
                        data.push(doc.data());
                        tripID.push(doc.id);  
                    }
                })
                this.setState({
                    userTrips: data,
                    tripIDs: tripID
                },() =>{
                    let currentUserTotalSteps=[];
                    for(let k= 0; k<this.state.tripIDs.length; k++){
                        firebase
                            .firestore()
                            .collection('trips')
                            .doc(this.state.tripIDs[k])
                            .collection('plan')
                            .onSnapshot(querySnapshot => {
                                querySnapshot.forEach(doc => {
                                    currentUserTotalSteps.push(doc.data());        
                                })

                                this.setState({
                                    currentUserTotalSteps: currentUserTotalSteps,
                                }, () => {
                                    geojson.features=[];
                                    let arr = this.state.currentUserTotalSteps;
                                    for(let i = 0; i<arr.length; i++){
                                        let item = {
                                            'type': 'Feature',
                                            'geometry': {
                                            'type': 'Point',
                                            'coordinates': [arr[i].longitude,arr[i].latitude]
                                            }}
                                        geojson.features.push(item);   
                                    }
                        
                                    geojson.features.forEach(function(marker){
                                        let el = document.createElement('img');
                                        
                                        el.className = 'totalStepPoint';
                                        el.src = './imgs/redbgpin.svg';
                                        //   el.style.backgroundColor = '#CC3E55';
                                        el.style.width = '24px';
                                        el.style.height ='24px';
                                        //   el.style.border ='3px white solid';
                                        el.style.boxShadow = 'rgb(253, 253, 254) 0px 0px 3px 1px';
                                        el.style.borderRadius ='50%';
                                        // console.log(marker.geometry.coordinates);
                            
                                        if(marker.geometry.coordinates[0]){
                                            new mapboxgl.Marker(el)
                                            .setLngLat(marker.geometry.coordinates)
                                            .addTo(map);
                                        }
                                    });  
                                });
                        })
                    }
                });
        })

        firebase.firestore().collection('users')
        .onSnapshot(querySnapshot =>{
            querySnapshot.forEach(doc => {
                if(doc.id === urlUserUID){
                    this.setState({
                        tripAuthor: doc.data()
                    });
                }
            })    
        });

        if(this.props.state.userUid === urlUserUID ){
            console.log('authour is here') 
            this.setState({
                isAuthor: true
            });
        }
            // var layerList = document.getElementById('menu');
            // var inputs = layerList.getElementsByTagName('input');

            // function switchLayer(layer) {
            //     var layerId = layer.target.id;
            //     map.setStyle('mapbox://styles/mapbox/' + layerId);
            // }

            // for (var i = 0; i < inputs.length; i++) {
            //     inputs[i].onclick = switchLayer;
            // }       
    }
    updateInput(e){
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    showAddTrip(e){
        e.preventDefault();
        this.setState({
            showAddTripPage: true
        });
    }
    
    hideAddTrip(e){
        e.preventDefault();
        this.setState({
            showAddTripPage: null
        });
    }

    addTrip(e){
        e.preventDefault();
        let user = firebase.auth().currentUser;  

        firebase
            .firestore()
            .collection('trips')
            .doc()
            .set({
                authorUid: user.uid,
                planLike: 0,
                tripName: this.state.addTripName,
                tripSum: this.state.addTripSum,
                tripStart: this.state.addTripStart,
                tripEnd: this.state.addTripEnd,
                createTime: new Date(),
            })
        this.setState({
            showAddTripPage: null
        });
        console.log('db add trip ok');  

        this.setState({
            addNewTrip: true
        }, () =>{
            firebase
                .firestore()
                .collection('trips')
                .orderBy('createTime','desc')
                .limit(1)
                .onSnapshot(querySnapshot => {      
                    let newTripID='';
                    querySnapshot.forEach(doc => {
                        newTripID = doc.id;
                    })
                    this.setState({
                        newTripID: newTripID
                    });
                })
        });
    }
     
    render() {
        if(this.state.addNewTrip && this.state.newTripID){
            return <Redirect to={'/'+this.state.newTripID}/>
        }

        console.log(this.state);

        let addTripBtn = null;
        if(this.state.isAuthor){
            if(this.state.userTrips.length === 0){
                addTripBtn =(
                    <div className='add-first-trip-box'>
                        <div className='add-first-trip-p'>
                            Start your travel adventures now by adding a past, current or future trip.
                        </div>
                        <div onClick={this.showAddTrip.bind(this)} id='add-first-trip-btn'>Add a trip</div>
                    </div>
                )
            }else{
                addTripBtn = <div onClick={this.showAddTrip.bind(this)} id='add-trip-btn'>Add a past, current, or future trip</div>
            }
        }
   
        let key=0;
        let renderUserTrips = this.state.userTrips.map((n, index)=>{
            let cardImg;
            if(n.coverPic){
                cardImg = <img className='card-img' src={n.coverPic}/>
            }else{
                cardImg = <div className='card-no-img'/>
            } 

            let calTripStart= new Date(n.tripStart);
            let calTripEnd = new Date(n.tripEnd);
            let tripDays = parseInt(Math.abs(calTripStart - calTripEnd) / 1000 / 60 / 60 / 24);
            let tripMonth = calTripStart.toString().substring(4,7);
            let tripYear = calTripStart.toString().substring(11,15);

            return  (
                <li key={key++}>
                    <Link to={"/"+this.state.tripIDs[index]}>
                        <div className='card'> 
                            <div className='card-title'>{n.tripName}</div>
                            <div className='card-title-arrow'>></div>
                            <div className='card-main-container'>
                                <div className='card-main'>
                                    <div className='card-main-line1'>{tripYear}</div>
                                    <div className='card-main-line2'>{tripMonth}</div>
                                </div>
                                <div className='card-main'>
                                    <div className='card-main-line1'>{tripDays}</div>
                                    <div className='card-main-line2'>days</div>
                                </div>
                            </div>
                            {cardImg}
                        </div>
                    </Link>
                </li>
            )
        })

        let tripAuthorInfo = null;
        let userCardImg = null;
        let userCardCity = null;
        let userCardAbout = null;
        if(this.state.tripAuthor){
            if(this.state.tripAuthor.profilePic){
                userCardImg = (<img className='user-card-img' src={this.state.tripAuthor.profilePic}/>)
            }else{
                userCardImg = ( <div className='user-card-noimg'>
                                    <img className='user-card-img' src='./imgs/whiteprofile.svg'/>
                                </div>
                )      
            }

            if(this.state.tripAuthor.place){
                userCardCity =  <div id='user-card-city'>{this.state.tripAuthor.place}</div>
            }

            if(this.state.tripAuthor.about){
                userCardAbout =  <div id='user-card-about'>{this.state.tripAuthor.about}</div>
            }
            
            tripAuthorInfo=(
                                <div className='trip-author-info'>
                                    {userCardImg}
                                    <div id='user-card-name'>{this.state.tripAuthor.username}</div>
                                    {userCardCity}
                                    {userCardAbout}
                                </div>
                            ) 
        }

        let addTripSubmit = <div id='add-trip-submit' aria-disabled='true'>Add trip</div>
        if(this.state.addTripName && this.state.addTripStart){
            addTripSubmit = <div onClick={this.addTrip.bind(this)} id='add-trip-submit-approve'>Add trip</div>
        }

        let addTripPage = null;
        if(this.state.showAddTripPage){
            addTripPage =(
                <div id='add-trip'>
                    <div className='add-pop'>
                    <div onClick={this.hideAddTrip.bind(this)} className='add-close'>x</div>
                    <div className='add-title'>New trip</div>
                    <div className='add-name'>Trip name</div>
                    <input type='text' className='each-tripName' id='addTripName' placeholder='e.g. Europe Train Tour'
                            onChange={this.updateInput.bind(this)} value={this.state.addTripName || ''}/>
                    <div className='add-sum'>Trip summary</div>
                    <input type='text' className='each-tripSum' id='addTripSum' placeholder='e.g. First Solo Trip With Luck'
                            onChange={this.updateInput.bind(this)} value={this.state.addTripSum || ''}/>        
                    <div className='add-when'>When?</div>
                    <div className='add-start'>Start date</div>
                    <input type='date' className='each-tripStart' id='addTripStart'
                            onChange={this.updateInput.bind(this)} value={this.state.addTripStart}/>   
                    <div className='add-end'>End date</div>
                    <input type='date' className='each-tripEnd' id='addTripEnd'  min={this.state.addTripStart}
                            onChange={this.updateInput.bind(this)} value={this.state.addTripEnd}/>
                    {addTripSubmit}
                    </div>
                </div>
            )
        }
        
        return  (
            <div className='MContent'>
                <Map/>
                
                <div className='user-total-trip'>
                    <div className='user-card'>
                        {tripAuthorInfo}
                        <div className='user-card-statis'>
                            <div className='user-card-trip'>{this.state.userTrips.length} trips</div>
                        </div>
                    </div>
                    <div className='user-title'>Trips</div>
                    {addTripBtn}
                
                    <ul className='cards'>
                        {renderUserTrips}
                    </ul>
                </div>

            {addTripPage}

            </div>
        )
    }
}  

export default MContent;   

