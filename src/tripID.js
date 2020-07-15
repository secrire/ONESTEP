import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
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
            trackSteps:[],
            deletePickedTrip: null,
            planStepIDs:[],
            pickedStepID: null,
            trackStepIDs:[],
            pickedTrackID: null
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
        .doc(pickedTripID)
        .onSnapshot(querySnapshot => { 
            this.setState({
                trip: querySnapshot.data(),
            });
            console.log(this.state.trip)
        })

        firebase.firestore().collection('trips')
        .doc(pickedTripID).collection('plan')
        .orderBy('stepArrDate','asc')
        .onSnapshot(querySnapshot => {
            let data=[]; 
            let planStepID=[];   
            querySnapshot.forEach(doc => {
                data.push(doc.data()); 
                planStepID.push(doc.id);
            })
            this.setState({
                planSteps:data,
                planStepIDs: planStepID
            });
            console.log(this.state.planSteps)
            console.log(this.state.planStepIDs)
        })

        firebase.firestore().collection('trips')
        .doc(pickedTripID).collection('track')
        .orderBy('stepArrDate','asc')
        .onSnapshot(querySnapshot => {
            let data2=[];  
            let trackStepID=[];  
            querySnapshot.forEach(doc => {
                data2.push(doc.data()); 
                trackStepID.push(doc.id);
            })
            this.setState({
                trackSteps:data2,
                trackStepIDs: trackStepID
            });
            console.log(this.state.trackSteps)
            console.log(this.state.trackStepIDs)
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

    showEditPlanStep(e){
        e.preventDefault();
        document.getElementById(`edit-plan-step`).style.display ='block';
        console.log(e.target.getAttribute('stepid'))

        this.setState({
            pickedStepID: e.target.getAttribute('stepid')
        },() =>console.log(this.state.pickedStepID))    
    }    
    showEditTrackStep(e){
        e.preventDefault();
        document.getElementById(`edit-track-step`).style.display ='block';
        console.log(e.target.getAttribute('stepid'))

        this.setState({
            pickedStepID: e.target.getAttribute('stepid')
        },() =>console.log(this.state.pickedStepID))    
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
    editTrip(e){
        e.preventDefault();
        let pickedTripID = new URL(location.href).pathname.substr(1);
    
        if(document.getElementById(`tripName`).value &&
           document.getElementById(`tripStart`).value){
          document.getElementById(`add-trip-submit`).disabled = false;
          document.getElementById(`add-trip-submit`).style.backgroundColor = '#CC3E55';
    
          console.log(this.state)
          let user = firebase.auth().currentUser;  
    
          firebase.firestore().collection('trips')
          .doc(pickedTripID)
          .set({
            authorUid: user.uid,
            planlike: 0,
            trackLike: 0,
            tripName: document.getElementById(`tripName`).value,
            tripSum: document.getElementById(`add-sum-input`).value,
            tripStart: document.getElementById(`tripStart`).value,
            tripEnd: document.getElementById(`add-end-input`).value,
            createTime: new Date() 
          })
          document.getElementById(`add-trip`).style.display ='none';
          console.log('db edit trip ok');  
        } 
    }
    deleteTrip(e){
        e.preventDefault();
        
        let pickedTripID = new URL(location.href).pathname.substr(1);
        firebase.firestore().collection('trips')
        .doc(pickedTripID)
        .delete().then(() =>{
            console.log('delete trip ok')
        })
        this.setState({
            deletePickedTrip:true
        })
    } 
    
    editPlanStep(e){
        e.preventDefault();
    
        let pickedTripID = new URL(location.href).pathname.substr(1);
        let stepPic='';
        if(localStorage.getItem('pic')){
          stepPic= localStorage.getItem('pic');
        }
        console.log(stepPic)
    
        if (document.getElementById(`edit-plan-step-place`).value &&
            document.getElementById(`edit-plan-step-arrive-date`).value &&
            document.getElementById(`edit-plan-step-arrive-time`).value 
           ){
            document.getElementById(`edit-plan-step-submit`).style.backgroundColor = '#CC3E55';
            document.getElementById(`edit-plan-step-submit`).disabled = false;
          
            firebase.firestore().collection('trips').doc(pickedTripID)
            .collection('plan').doc(this.state.pickedStepID)
            .update({
                location: document.getElementById(`edit-plan-step-place`).value,
                stepName:  document.getElementById(`edit-plan-step-name`).value,
                stepArrDate: document.getElementById(`edit-plan-step-arrive-date`).value,
                stepArrTime: document.getElementById(`edit-plan-step-arrive-time`).value,
                stepDepDate: document.getElementById(`edit-plan-step-depart-date`).value,
                stepDepTime: document.getElementById(`edit-plan-step-depart-time`).value,
                stepStory: document.getElementById(`edit-plan-step-story`).value,
                stepPic: stepPic    
            })
            console.log('db edit plan step ok');
            localStorage.removeItem('pic')  
            document.getElementById(`edit-plan-step`).style.display ='none';
            } 
    }
    editTrackStep(e){
        e.preventDefault();
    
        let pickedTripID = new URL(location.href).pathname.substr(1);
        
        let stepPic='';
        if(localStorage.getItem('pic')){
          stepPic= localStorage.getItem('pic');
        }
        console.log(stepPic)
    
        if (document.getElementById(`edit-track-step-place`).value &&
            document.getElementById(`edit-track-step-arrive-date`).value &&
            document.getElementById(`edit-track-step-arrive-time`).value 
           ){
            document.getElementById(`edit-track-step-submit`).style.backgroundColor = '#CC3E55';
            document.getElementById(`edit-track-step-submit`).disabled = false;
          
    
          firebase.firestore().collection('trips').doc(pickedTripID)
          .collection('track').doc(this.state.pickedStepID)
          .update({
            location: document.getElementById(`edit-track-step-place`).value,
            stepName:  document.getElementById(`edit-track-step-name`).value,
            stepArrDate: document.getElementById(`edit-track-step-arrive-date`).value,
            stepArrTime: document.getElementById(`edit-track-step-arrive-time`).value,
            stepDepDate: document.getElementById(`edit-track-step-depart-date`).value,
            stepDepTime: document.getElementById(`edit-track-step-depart-time`).value,
            stepStory: document.getElementById(`edit-track-step-story`).value,
            stepPic: stepPic
          })
          console.log('db edit track step ok');
          localStorage.removeItem('pic') 
          document.getElementById(`edit-track-step`).style.display ='none'; 
        } 
    }

    deletePlanStep(e){
        e.preventDefault();
        
        let pickedTripID = new URL(location.href).pathname.substr(1);
        this.setState({
            pickedStepID: e.target.getAttribute('stepid')
        },() =>console.log(this.state.pickedStepID))    

        firebase.firestore()
        .collection('trips').doc(pickedTripID)
        .collection('plan').doc(this.state.pickedStepID)
        .delete().then(() =>{
            console.log('delete plan step ok')
        }).catch((err) =>{
            console.log(err.message)
        })
    } 
    deleteTrackStep(e){
        e.preventDefault();
        
        let pickedTripID = new URL(location.href).pathname.substr(1);

        this.setState({
            pickedStepID: e.target.getAttribute('stepid')
        },() =>console.log(this.state.pickedStepID))    

        firebase.firestore()
        .collection('trips').doc(pickedTripID)
        .collection('track').doc(this.state.pickedStepID)
        .delete().then(() =>{
            console.log('delete track step ok')
        }).catch((err) =>{
            console.log(err.message)
        })
    } 
      
    hideEditPlanStep(e){
        e.preventDefault();
        document.getElementById(`edit-plan-step`).style.display ='none';
    }  
    hideEditTrackStep(e){
        e.preventDefault();
        document.getElementById(`edit-track-step`).style.display ='none';
    } 
    
    likePlanStep(e){
        e.preventDefault();
        // document.getElementById(`plan-step-like`).style.backgroundColor ='red';
        console.log(e.target.getAttribute('stepid'))

        let pickedTripID = new URL(location.href).pathname.substr(1);
        firebase.firestore().collection('trips').doc(pickedTripID)
        .collection('plan').doc(e.target.getAttribute('stepid'))
        .update({
           stepLike: 1
        })
        console.log('db like plan step ok');
    } 
      
    uploadPic(e){
        e.preventDefault();
        let storage = firebase.storage();
        let file = e.target.files[0];
        let storageRef = storage.ref('pics/'+file.name);
    
        // let currentUrl = location.href;
        // let currentUrlNew = new URL(currentUrl);
        // let pickedTripID = currentUrlNew.pathname.substr(1);
    
        storageRef.put(file).then((snapshot) => {
          console.log('Uploaded', file.name);
    
          storageRef.getDownloadURL().then(
            (url) => {
            console.log('download'+url);
    
            localStorage.setItem('pic',url);
      
            // firebase.firestore().collection('trips').doc(pickedTripID)
            // .collection('plan').doc()
            // .update({
            //   stepPic: url
            // })
          }).catch((error) => {
            console.log('download fail'+error.message)
          });
        });
    }
  
    render() {
        if(this.state.deletePickedTrip === true){
            return <Redirect to='/member'/>
        }

        let renderPlanSteps = this.state.planSteps.map((n, index)=>{
            return  <li className='trip-btn-step-box' key={this.state.planStepIDs[index]}>    
                        <div onClick={this.showAddPlanStep.bind(this)} className='trip-step-add-btn'>+</div>
                        <div className='trip-step'>
                            <div className='trip-step-name'>{n.stepName}</div>
                            <div className='trip-step-date'>{n.stepArrDate}</div>
                            <div className='trip-step-time'>{n.stepArrTime}</div>
                            <div className='trip-step-story'>{n.stepStory}</div>
                            <img className='trip-step-pic'  src={n.stepPic}/>
                            <div onClick={this.likePlanStep.bind(this)} stepid={this.state.planStepIDs[index]} id='plan-step-like'>Like</div>
                            <div onClick={this.showEditPlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='trip-step-edit'>Edit step</div>
                            <div onClick={this.deletePlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='trip-step-edit'>delete</div>
                        </div>
                    </li>
        })
        let renderTrackSteps = this.state.trackSteps.map((n, index)=>{
            return  <li className='trip-btn-step-box' key={this.state.trackStepIDs[index]}>    
                        <div onClick={this.showAddTrackStep.bind(this)} className='trip-step-add-btn'>+</div>
                        <div className='trip-step'>
                            <div className='trip-step-name'>{n.stepName}</div>
                            <div className='trip-step-date'>{n.stepArrDate}</div>
                            <div className='trip-step-time'>{n.stepArrTime}</div>
                            <div className='trip-step-story'>{n.stepStory}</div>
                            <img className='trip-step-pic'  src={n.stepPic}/>
                            <div className='trip-step-like'>Like</div>
                            <div onClick={this.showEditTrackStep.bind(this)} stepid={this.state.trackStepIDs[index]} className='trip-step-edit'>Edit step</div>
                            <div onClick={this.deleteTrackStep.bind(this)} stepid={this.state.trackStepIDs[index]} className='trip-step-edit'>delete</div>
                        </div>
                    </li>
        })
        return  <div className='plan-track-page'>
                    <div className='trip-header'>
                        <img className='trip-header-img' src='./imgs/q.png'></img>
                        <div className='trip-header-name'>{this.state.userDisplayname}</div>
                        <div onClick={this.addPlan.bind(this)} id='card-add-plan'>Plan</div>
                        <div onClick={this.addTrack.bind(this)} id='card-add-track'>Track</div> 
                        <div onClick={this.showAddTrip.bind(this)} className='trip-header-set'>Edit trip</div>
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
                                    <img className='trip-start-end-icon' src='./imgs/flagc-256.png'></img>
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
                    
                    {/* -----   edit trip   ----- */}
                    <div id='add-trip'>
                        <div className='add-pop'>
                        <div onClick={this.hideAddTrip.bind(this)} className='add-close'>x</div>
                        <div className='add-title'>Edit trip</div>
                        <div className='add-name'>Trip name</div>
                        <input type='text' id='tripName' placeholder='e.g. Europe Train Tour'
                                onChange={this.updateInput.bind(this)}/>
                        <div className='add-sum'>Trip summary</div>
                        <input type='text' id='add-sum-input' placeholder='e.g. First Solo Trip With Luck'
                                onChange={this.updateInput.bind(this)}/>        
                        <div className='add-when'>When?</div>
                        <div className='add-start'>Start date</div>
                        <input type='date' id='tripStart' placeholder='5 July 2020'
                                onChange={this.updateInput.bind(this)}/>   
                        <div className='add-end'>End date</div>
                        <input type='date' id='add-end-input' placeholder='I have no idea'
                                onChange={this.updateInput.bind(this)}/>
                        <div onClick={this.editTrip.bind(this)} id='add-trip-submit' aria-disabled='true'>Save changes</div>
                        <div onClick={this.deleteTrip.bind(this)} id='delete-trip-submit'>delete</div>
                        </div>
                    </div>   

                    {/* -----   edit step   ----- */}
                    <div id='edit-plan-step'>
                        <div className='add-step-pop'>
                            <div  onClick={this.hideEditPlanStep.bind(this)} className='add-step-close'>x</div>
                            <div className='add-step-title'>Edit step of Plan</div>
                            <div className='add-step-list'>
                                <div className='add-step-p'>Location</div>
                                <input type='text' className='add-step-place' id='edit-plan-step-place'/>
                            </div>
                            <div className='add-step-list'>
                                <div className='add-step-p'>Step name</div>
                                <input type='text' className='add-step-name' id='edit-plan-step-name' placeholder='e.g. Europe Train Tour'/>
                            </div>
                            <div className='add-step-list'>
                                <div className='add-step-p'>Arrival Date & Time</div>
                                <input type='date' className='add-step-arrive-date' id='edit-plan-step-arrive-date'/>
                                <input type='time' className='add-step-arrive-time' id='edit-plan-step-arrive-time'/>
                            </div>
                            <div className='add-step-list'>
                                <div className='add-step-p'>Departure Date & Time</div>
                                <input type='date' className='add-step-depart-date' id='edit-plan-step-depart-date'/>
                                <input type='time' className='add-step-depart-time' id='edit-plan-step-depart-time'/>
                            </div>     
                            <div className='add-step-list'>
                                <div className='add-step-p'>Your note</div>    
                                <textarea className='add-step-story' id='edit-plan-step-story'></textarea>
                            </div>    
                            <div className='add-step-list'>
                                <div className='add-step-p'>Add your photos</div>
                                <div className='add-step-pic-box'>
                                    <input onChange={this.uploadPic.bind(this)} id="uploadPicInput" type="file"></input>
                                    <img id='pic'/>
                                </div>
                            </div>    
                            <div className='add-step-list'> 
                                <div className='add-step-submit' onClick={this.editPlanStep.bind(this)} id='edit-plan-step-submit' aria-disabled='true'>Save changes</div>
                                {/* <div className='add-step-cancel'>Cancel</div> */}
                                {/* <img className='add-step-remove' src='public/imgs/menu.png'/> */}
                            </div>
                        </div>
                    </div>

                    <div id='edit-track-step'>
                        <div className='add-step-pop'>
                            <div onClick={this.hideEditTrackStep.bind(this)} className='add-step-close'>x</div>
                            <div className='add-step-title'>Edit step of Track</div>
                            <div className='add-step-list'>
                                <div className='add-step-p'>Location</div>
                                <input type='text' className='add-step-place' id='edit-track-step-place'/>
                            </div>
                            <div className='add-step-list'>
                                <div className='add-step-p'>Step name</div>
                                <input type='text' className='add-step-name' id='edit-track-step-name' placeholder='e.g. Europe Train Tour'/>
                            </div>
                            <div className='add-step-list'>
                                <div className='add-step-p'>Arrival Date & Time</div>
                                <input type='date' className='add-step-arrive-date' id='edit-track-step-arrive-date'/>
                                <input type='time' className='add-step-arrive-time' id='edit-track-step-arrive-time'/>
                            </div>
                            <div className='add-step-list'>
                                <div className='add-step-p'>Departure Date & Time</div>
                                <input type='date' className='add-step-depart-date' id='edit-track-step-depart-date'/>
                                <input type='time' className='add-step-depart-time' id='edit-track-step-depart-time'/>
                            </div>     
                            <div className='add-step-list'>
                                <div className='add-step-p'>Your story</div>    
                                <textarea className='add-step-story' id='edit-track-step-story'></textarea>
                            </div>    
                            <div className='add-step-list'>
                                <div className='add-step-p'>Add your photos</div>
                                <div className='add-step-pic-box'>
                                    <input onChange={this.uploadPic.bind(this)} id="uploadPicInput" type="file"></input>
                                    <img id='pic'/>
                                </div>
                            </div>    
                            <div className='add-step-list'> 
                                <div className='add-step-submit' onClick={this.editTrackStep.bind(this)} id='edit-track-step-submit' aria-disabled='true'>Save changes</div>
                            </div>
                        </div>
                    </div>
                </div> 
        }
    }  

   export default TripID;