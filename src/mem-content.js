import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './member.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

import Map from "./Map";


let map;
let today = new Date().toJSON().slice(0,10);

class MContent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // userDisplayname:'',
            userTrips:[],
            tripIDs:[],
            addTripStart: today,
            addTripEnd: today,
          };    
    }
    componentDidMount() {
        let urlUserUID = new URL(location.href).pathname.substr(2);

        let user = firebase.auth().currentUser;

        mapboxgl.accessToken = 'pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig';
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 2,
            center: [80, 30],
        });
        map.setStyle('mapbox://styles/mapbox/satellite-v9');
        
        firebase.firestore().collection('users')
        // .where('email','==',user.email)
        .onSnapshot(querySnapshot =>{
            querySnapshot.forEach(doc => {
                if(doc.id === urlUserUID){
                    this.setState({
                        tripAuthor: doc.data()
                    });
                }
            })    
        });

        firebase.firestore().collection('trips')
        .orderBy('createTime','desc')
        .onSnapshot(querySnapshot => {
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
        // console.log(user)
        // if(user){
            if(this.props.state.userUid === urlUserUID ){
                console.log('authour is here') 
                // document.getElementById(`add-trip-btn`).style.display ='block';
                this.setState({
                    isAuthor: true
                });
            }
        // }
   
        document.getElementById(`addTripStart`).value = today;
        document.getElementById(`addTripEnd`).value = today;
        // console.log(this.state.addTripStart)

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
    
        // if(document.getElementById(`addTripName`).value &&
        //    document.getElementById(`addTripStart`).value){
        //   document.getElementById(`add-trip-submit`).disabled = false;
        //   document.getElementById(`add-trip-submit`).style.backgroundColor = '#CC3E55';
    
          console.log(this.state)
          let user = firebase.auth().currentUser;  
    
          firebase.firestore().collection('trips')
          .doc()
          .set({
            authorUid: user.uid,
            // planlike: 0,
            // trackLike: 0,
            // surpriseLike: 0,
            tripName: document.getElementById(`addTripName`).value,
            tripSum: document.getElementById(`add-tripSum`).value,
            tripStart: document.getElementById(`addTripStart`).value,
            tripEnd: document.getElementById(`addTripEnd`).value,
            createTime: new Date(),
            addPlan:null,
            addTrack:null, 
          })
          document.getElementById(`add-trip`).style.display ='none';
          console.log('db add trip ok');  
        // } 

        this.setState({
            addNewTrip: true
        }, () =>{
            firebase.firestore().collection('trips')
            .orderBy('createTime','desc').limit(1)
            .onSnapshot(querySnapshot => {      
              let newTripID='';
              querySnapshot.forEach(doc => {
                  newTripID = doc.id;
              })
              this.setState({
                newTripID: newTripID
              });
              console.log(this.state.newTripID)
            })
        });
    }
     
    render() {
        // console.log(this.props.state.tripIDs)
        console.log(this.state.newTripID)
        if(this.state.addNewTrip && this.state.newTripID){
            // console.log('pppppppppppp')
            return <Redirect to={'/'+this.state.newTripID}/>
        }

        // console.log(this.state)
        if(this.state.addTripStart !== today){
            document.getElementById(`addTripEnd`).value = this.state.addTripStart;
        }
        if(this.state.addTripEnd !== this.state.addTripStart){
            document.getElementById(`addTripEnd`).value = this.state.addTripEnd;
        }

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
            return  <li key={key++}>
                        <Link to={"/"+this.state.tripIDs[index]}><div className='card'>  
                            <div className='card-title'>{n.tripName}</div>
                            <div className='card-main'>
                                <div className='card-time'>{n.tripStart}</div>
                                {/* <div className='card-days'>18 days</div> */}
                            </div>
                            {cardImg}
                        </div></Link>
                    </li>
        })
        let tripAuthorInfo = null;
        let userCardImg = null;
        if(this.state.tripAuthor){
            if(this.state.tripAuthor.profilePic){
                userCardImg = (<img className='user-card-img' src={this.state.tripAuthor.profilePic}/>)
            }else{
                userCardImg = ( <div className='user-card-noimg'>
                                    <img className='user-card-img' src='./imgs/whiteprofile.svg'/>
                                </div>
                )      
            }
            
            tripAuthorInfo= <div className='trip-author-info'>
                                {userCardImg}
                                <div id='user-card-name'>{this.state.tripAuthor.username}</div>
                                <div id='user-card-city'></div>
                                <div id='user-card-about'></div>
                            </div>   
        }
        
        let addTripSubmit = <div id='add-trip-submit' aria-disabled='true'>Add trip</div>
        if(this.state.addTripName && this.state.addTripStart){
            addTripSubmit = <div onClick={this.addTrip.bind(this)} id='add-trip-submit-approve'>Add trip</div>
          }

        

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
                    
                    <div className='user-total-trip'>
                        <div className='user-card'>
                           {tripAuthorInfo}
                            <div className='user-card-statis'>
                                {/* <div className='user-card-like'>0 likes</div> */}
                                <div className='user-card-trip'>{this.state.userTrips.length} trips</div>
                            </div>
                        </div>
                        <div className='user-title'>Trips</div>
                        {addTripBtn}
                    
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
                        <input type='text' className='each-tripName' id='addTripName' placeholder='e.g. Europe Train Tour'
                                onChange={this.updateInput.bind(this)}/>
                        <div className='add-sum'>Trip summary</div>
                        <input type='text' className='each-tripSum' id='add-tripSum' placeholder='e.g. First Solo Trip With Luck'
                                onChange={this.updateInput.bind(this)}/>        
                        <div className='add-when'>When?</div>
                        {/* <form action="/action_page.php"> */}
                            {/* <label htmlFor="birthday">Birthday:</label>
                            <input type="date" id="birthday" name="birthday"/>
                            <input type="submit"/> */}
                        {/* </form> */}
                        <div className='add-start'>Start date</div>
                        <input type='date' className='each-tripStart' id='addTripStart'
                                onChange={this.updateInput.bind(this)}/>   
                        <div className='add-end'>End date</div>
                        <input type='date' className='each-tripEnd' id='addTripEnd'  min={this.state.addTripStart}
                                onChange={this.updateInput.bind(this)}/>
                        {/* <div className='who-can-see'>Who can see my trip</div> */}
                        {addTripSubmit}
                        </div>
                    </div>

                </div>
    }
}  

export default MContent;   

