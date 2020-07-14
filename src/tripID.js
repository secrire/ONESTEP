import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './member.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

class TripID extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userDisplayname:'',
            trip:[],
            planSteps:[],
            trackSteps:[]
          };        
    }
    componentDidMount() {
        let user = firebase.auth().currentUser;
        console.log(user.email)    

        firebase.firestore().collection('users')
        .where('email','==',user.email)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.data().username)
                this.setState({
                    userDisplayname: doc.data().username
                });   
            }) 
        });

        let currentUrl = location.href;
        let currentUrlNew = new URL(currentUrl);
        let pickedTripID = currentUrlNew.pathname.substr(1);

        firebase.firestore().collection('trips')
        .doc(pickedTripID).get()
        .then(doc => { 
            this.setState({
                trip: doc.data(),
            });
            console.log(this.state.trip)
        })
        firebase.firestore().collection('trips')
        .doc(pickedTripID).collection('plan')
        // .orderBy('time','desc')
        .get()
        .then(querySnapshot => {
            let data=[];    
            querySnapshot.forEach(doc => {
                data.push(doc.data());
                // console.log(doc.id,doc.data())    
            })
            this.setState({
                planSteps:data
            });
            console.log(this.state.planSteps)
        })
        firebase.firestore().collection('trips')
        .doc(pickedTripID).collection('track')
        // .orderBy('time','desc')
        .get()
        .then(querySnapshot => {
            let data2=[];    
            querySnapshot.forEach(doc => {
                data2.push(doc.data());  
            })
            this.setState({
                trackSteps:data2
            });
            console.log(this.state.trackSteps)
        })
    }
    addPlan(e){
        e.preventDefault();
        document.getElementById(`trip-plan-step`).style.display ='block';
        document.getElementById(`card-add-plan`).style.display ='none';
    } 
    
    addTrack(e){
        e.preventDefault();   
        document.getElementById(`trip-track-step`).style.display ='block';
        document.getElementById(`card-add-track`).style.display ='none';
    } 

    showAddPlanStep(e){
        e.preventDefault();
        document.getElementById(`add-plan-step`).style.display ='block';
    }    
    showAddTrackStep(e){
        e.preventDefault();
        document.getElementById(`add-track-step`).style.display ='block';
    }    
  
    render() {
        let key=0;
        let renderPlanSteps = this.state.planSteps.map((n)=>{
            return  <li className='trip-btn-step-box' key={key++}>    
                        <div onClick={this.showAddPlanStep.bind(this)} className='trip-step-add-btn'>+</div>
                        <div className='trip-step'>
                            <div className='trip-step-name'>{n.stepName}</div>
                            <div className='trip-step-date'>{n.stepArrDate}</div>
                            <div className='trip-step-time'>{n.stepArrTime}</div>
                            <div className='trip-step-story'>{n.stepStory}</div>
                            <img className='trip-step-pic'  src={n.stepPic}/>
                            <div className='trip-step-edit'>Edit step</div>
                        </div>
                    </li>
        })
        let renderTrackSteps = this.state.trackSteps.map((n)=>{
            return  <li className='trip-btn-step-box' key={key++}>    
                        <div onClick={this.showAddTrackStep.bind(this)} className='trip-step-add-btn'>+</div>
                        <div className='trip-step'>
                            <div className='trip-step-name'>{n.stepName}</div>
                            <div className='trip-step-date'>{n.stepArrDate}</div>
                            <div className='trip-step-time'>{n.stepArrTime}</div>
                            <div className='trip-step-story'>{n.stepStory}</div>
                            <img className='trip-step-pic'  src={n.stepPic}/>
                            <div className='trip-step-edit'>Edit step</div>
                        </div>
                    </li>
        })
        return  <div className='plan-track-page'>
                    <div className='trip-header'>
                        <img className='trip-header-img' src='./imgs/q.png'></img>
                        <div className='trip-header-name'>{this.state.userDisplayname}</div>
                        <div onClick={this.addPlan.bind(this)} id='card-add-plan'>Plan</div>
                        <div onClick={this.addTrack.bind(this)} id='card-add-track'>Track</div> 
                        <div className='trip-header-set'>Edit trip</div>
                    </div>
                    <div className='plan-track-content'>
                    <div id='trip-plan-step'>
                        {/* <div className='trip-time-line'>-</div> */}
                        <div className='trip-cover'>
                            <div className='trip-title'>{this.state.trip.tripName}</div>
                            <div className='trip-summary'>{this.state.trip.tripSum}</div>
                            {/* <img className='trip-cover-img' src='public/imgs/b.jpg'></img> */}
                            {/* <div className='trip-flag'>3</div> */}
                        </div>    
                        <div className='trip-details'>
                            <div className='trip-detail-like'> 5 likes</div>
                            <div className='trip-detail-day'> 5 days</div>
                            <div className='trip-detail-photo'> 1 photo</div>
                            <div className='trip-detail-country'> 2 country</div>
                            <div className='trip-detail-step'> {this.state.planSteps.length} steps</div>
                        </div>
                        <ul className='trip-steps-box'>
                            <li>
                                <div className='trip-start'>
                                    <img className='trip-start-end-icon' src='./imgs/home.png'></img> 
                                    <div className='trip-start-end-p'>Start</div>  
                                    <div className='trip-start-end-date'>{this.state.trip.tripStart}</div> 
                                </div>
                            </li>
                            {renderPlanSteps}
                            {/* <li className='trip-btn-step-box'>    
                                <div onClick={this.showAddStep.bind(this)} className='trip-step-add-btn'>+</div>
                                <div className='trip-step'>
                                    <div className='trip-step-name'>tainan</div>
                                    <div className='trip-step-date'>7 July 2020</div>
                                    <div className='trip-step-time'>13:00</div>
                                    <div className='trip-step-story'>pick up ticket</div>
                                    <img className='trip-step-pic'  src='public/imgs/b.jpg'/>
                                    <div className='trip-step-edit'>Edit step</div>
                                </div>
                            </li>
                            <li className='trip-btn-step-box'>    
                                <div onClick={this.showAddStep.bind(this)} className='trip-step-add-btn'>+</div>
                                <div className='trip-step'>
                                    <div className='trip-step-name'>taitung</div>
                                    <div className='trip-step-date'>7 July 2020</div>
                                    <div className='trip-step-time'>13:00</div>
                                    <div className='trip-step-story'>go park</div>
                                    <img className='trip-step-pic'  src='public/imgs/b.jpg'/>
                                    <div className='trip-step-edit'>Edit step</div>
                                </div>
                            </li> */}
                            <li>    
                                <div onClick={this.showAddPlanStep.bind(this)} className='trip-step-add-btn'>+</div>
                            </li>
                            <li className='trip-step-add-last'>
                                <div className='trip-step-add-last-btn'>+</div> 
                                <div className='trip-step-add-last-p'>Add a step</div>   
                            </li>
                            <li className='trip-end'>
                                <img className='trip-start-end-icon' src='./imgs/flag.png'></img>
                                <div className='trip-start-end-p'>Finish</div> 
                                <div className='trip-start-end-date'>{this.state.trip.tripEnd}</div>      
                            </li> 
                        </ul> 
                    </div> 

                    <div id='trip-track-step'>
                        {/* <div className='trip-time-line'>-</div> */}
                        <div className='trip-cover'>
                            <div className='trip-title'>{this.state.trip.tripName}</div>
                            <div className='trip-summary'>{this.state.trip.tripSum}</div>
                            {/* <img className='trip-cover-img' src='public/imgs/b.jpg'></img> */}
                            {/* <div className='trip-flag'>3</div> */}
                        </div>    
                        <div className='trip-details'>
                            <div className='trip-detail-like'> 5 likes</div>
                            <div className='trip-detail-day'> 5 days</div>
                            <div className='trip-detail-photo'> 1 photo</div>
                            <div className='trip-detail-country'> 2 country</div>
                            <div className='trip-detail-step'> {this.state.trackSteps.length} steps</div>
                        </div>
                        <ul className='trip-steps-box'>
                            <li>
                                <div className='trip-start'>
                                    <img className='trip-start-end-icon' src='./imgs/home.png'></img> 
                                    <div className='trip-start-start-p'>Start</div>  
                                    <div className='trip-start-end-date'>{this.state.trip.tripStart}</div> 
                                </div>
                            </li>
                            {renderTrackSteps}
                            <li>    
                                <div onClick={this.showAddTrackStep.bind(this)} className='trip-step-add-btn'>+</div>
                            </li>
                            <li className='trip-step-add-last'>
                                <div className='trip-step-add-last-btn'>+</div> 
                                <div className='trip-step-add-last-p'>Add a step</div>   
                            </li>
                            <li className='trip-end'>
                                <img className='trip-start-end-icon' src='./imgs/flag.png'></img>
                                <div className='trip-start-end-p'>Finish</div> 
                                <div className='trip-start-end-date'>{this.state.trip.tripEnd}</div>      
                            </li> 
                        </ul> 
                    </div> 
                    </div>        
                </div> 
        }
    }  

   export default TripID;