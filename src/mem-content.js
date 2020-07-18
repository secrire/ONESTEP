import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './member.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

import Map from "./Map";

class MContent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userDisplayname:'',
            userTrips:[],
            tripIDs:[],
          };    
    }
    componentDidMount() {
        let urlUserUID = new URL(location.href).pathname.substr(2);

        let user = firebase.auth().currentUser;
        
        firebase.firestore().collection('users')
            // .where('email','==',user.email)
            .get().then(querySnapshot =>{
                querySnapshot.forEach(doc => {
                    if(doc.id === urlUserUID){
                        this.setState({
                            userDisplayname: doc.data().username
                        });
                    }
                })    
            });

            firebase.firestore().collection('trips')
            .orderBy('createTime','desc')
            .get().then(querySnapshot => {
                let data=[];       // 放state前先foreach處理資料
                let tripID=[];
                querySnapshot.forEach(doc => {
                    if(urlUserUID === doc.data().authorUid){
                        data.push(doc.data());
                        // console.log(doc.id,doc.data().tripName)
                        tripID.push(doc.id);  
                    }
                })
                this.setState({
                    userTrips: data,
                    tripIDs: tripID
                });
                //console.log(this.state.userTrips)
                //console.log(this.state.tripIDs)
            })
            console.log(user)
            // if(user){
                if(user.uid === urlUserUID ){
                    console.log('authour is here') 
                    document.getElementById(`add-trip-btn`).style.display ='block';
                }
            // }
   



            // mapboxgl.accessToken = 'pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig';
            // var map = new mapboxgl.Map({
            //     container: 'map',
            //     style: 'mapbox://styles/mapbox/streets-v11',
            //     zoom: 13,
            //     center: [4.899, 52.372]
            // });

            // var layerList = document.getElementById('menu');
            // var inputs = layerList.getElementsByTagName('input');

            // function switchLayer(layer) {
            //     var layerId = layer.target.id;
            //     map.setStyle('mapbox://styles/mapbox/' + layerId);
            // }

            // for (var i = 0; i < inputs.length; i++) {
            //     inputs[i].onclick = switchLayer;
            // }

    //     if(user){
    //         firebase.firestore().collection('users')
    //         .where('email','==',user.email)
    //         .get()
    //         .then(querySnapshot =>{
    //             querySnapshot.forEach(doc => {
    //                 this.setState({
    //                     userDisplayname: doc.data().username
    //                 });
    //             })    
    //         });

    //         firebase.firestore().collection('trips')
    //         .orderBy('createTime','desc')
    //         .onSnapshot(querySnapshot => {
    //             let data=[];       // 放state前先foreach處理資料
    //             let tripID=[];
    //             querySnapshot.forEach(doc => {
    //                 if(user.uid === doc.data().authorUid){
    //                     data.push(doc.data());
    //                     // console.log(doc.id,doc.data().tripName)
    //                     tripID.push(doc.id);  
    //                 }
    //             })
    //             this.setState({
    //                 userTrips: data,
    //                 tripIDs: tripID
    //             });
    //             console.log(this.state.userTrips)
    //             console.log(this.state.tripIDs)
    //         })
    //     } 
    }
    updateInput(e){
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    showAddTrip(e){
        e.preventDefault();
        document.getElementById(`add-trip`).style.display ='block';
    }
    
    hideAddTrip(e){
        e.preventDefault();
        document.getElementById(`add-trip`).style.display ='none';
    }

    addTrip(e){
        e.preventDefault();
    
        if(document.getElementById(`tripName`).value &&
           document.getElementById(`tripStart`).value){
          document.getElementById(`add-trip-submit`).disabled = false;
          document.getElementById(`add-trip-submit`).style.backgroundColor = '#CC3E55';
    
          console.log(this.state)
          let user = firebase.auth().currentUser;  
    
          firebase.firestore().collection('trips')
          .doc()
          .set({
            authorUid: user.uid,
            planlike: 0,
            trackLike: 0,
            // surpriseLike: 0,
            tripName: document.getElementById(`tripName`).value,
            tripSum: document.getElementById(`add-sum-input`).value,
            tripStart: document.getElementById(`tripStart`).value,
            tripEnd: document.getElementById(`add-end-input`).value,
            createTime: new Date() 
          })
          document.getElementById(`add-trip`).style.display ='none';
          console.log('db add trip ok');  
        } 
    }
     
    render() {
        // console.log(this.state.userTrips)
        let key=0;
        let renderUserTrips = this.state.userTrips.map((n, index)=>{
            return  <li key={key++}>
                        <Link to={"/"+this.state.tripIDs[index]}><div className='card'>  
                            <div className='card-title'>{n.tripName}</div>
                            <div className='card-main'>
                                <div className='card-time'>{n.tripStart}</div>
                                <div className='card-days'>18 days</div>
                            </div>
                            <img className='card-img' src='./imgs/b.JPG'/>
                        </div></Link>
                    </li>
        })

        //   let user = firebase.auth().currentUser;
        //   console.log(user.uid)

        // let renderTripIDs = this.state.tripIDs.map((k)=>{
            // firebase.firestore().collection('trips').doc(k).get()
            // .then(
            //     (doc)=>{
            //         console.log(doc.data())
            //         console.log(renderTripIDs)
            //         // item = 
                    // return <Link to={'/'+k} key={k}>
                    //     <div className='card'>  
                    //         {/* <div className='card-title'>{doc.data().tripName}</div>
                    //         <div className='card-main'>
                    //             <div className='card-time'>{doc.data().tripStart}</div>
                    //             <div className='card-days'>18 days</div>
                    //         </div> */}
                    //         <img className='card-img' src='./imgs/b.JPG'/>
                    //     </div>
                    //     </Link>
                    // content.push(item) 
                    // console.log(content)   
                    
            //     }
            // )


        
        return  <div className='MContent'>
                    <Map/>
                    {/* -----   map   -----
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
                    </div> */}
                    
                    <div className='user-total-trip'>
                        <div className='user-card'>
                            <img className='user-card-img' src='./imgs/b.JPG'></img>
                            <div id='user-card-name'>{this.state.userDisplayname}</div>
                            <div className='user-card-statis'>
                                <div className='user-card-like'>0 likes</div>
                                <div className='user-card-trip'>{this.state.userTrips.length} trips</div>
                            </div>
                        </div>
                        <div className='user-title'>Trips</div>
                        <div onClick={this.showAddTrip.bind(this)} id='add-trip-btn'>+ Trip</div>
                    
                        <ul className='cards'>
                            {renderUserTrips}
                            {/* <li><Link to='/tripID'><div className='card'>  
                                <div className='card-title'>{this.state.tripName}</div>
                                <div className='card-main'>
                                    <div className='card-time'>July 2020</div>
                                    <div className='card-days'>18 days</div> */}
                                    {/* <div onClick={this.addPlan.bind(this)} id='card-add-plan'>Plan</div>
                                    <div onClick={this.addTrack.bind(this)} id='card-add-track'>Track</div> */}
                                {/* </div>
                                <img className='card-img' src='./imgs/b.JPG'></img>
                            </div></Link></li> */}
                        </ul>
                    </div>



                    <div id='add-trip'>
                        <div className='add-pop'>
                        <div onClick={this.hideAddTrip.bind(this)} className='add-close'>x</div>
                        <div className='add-title'>New trip</div>
                        <div className='add-name'>Trip name</div>
                        <input type='text' id='tripName' placeholder='e.g. Europe Train Tour'
                                onChange={this.updateInput.bind(this)}/>
                        <div className='add-sum'>Trip summary</div>
                        <input type='text' id='add-sum-input' placeholder='e.g. First Solo Trip With Luck'
                                onChange={this.updateInput.bind(this)}/>        
                        <div className='add-when'>When?</div>
                        {/* <form action="/action_page.php"> */}
                            {/* <label htmlFor="birthday">Birthday:</label>
                            <input type="date" id="birthday" name="birthday"/>
                            <input type="submit"/> */}
                        {/* </form> */}
                        <div className='add-start'>Start date</div>
                        <input type='date' id='tripStart' placeholder='5 July 2020'
                                onChange={this.updateInput.bind(this)}/>   
                        <div className='add-end'>End date</div>
                        <input type='date' id='add-end-input' placeholder='I have no idea'
                                onChange={this.updateInput.bind(this)}/>
                        {/* <div className='who-can-see'>Who can see my trip</div>                */}
                        <div onClick={this.addTrip.bind(this)} id='add-trip-submit' aria-disabled='true'>Add trip</div>
                        </div>
                    </div>

                </div>
    }
}  

export default MContent;   

