import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './member.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

class AddStep extends React.Component {
  constructor(props){
    super(props);
    // this.state = {
    //   pickedTripID:null
    // };       
  }

  addPlanStep(e){
    e.preventDefault();

    let currentUrl = location.href;
    let currentUrlNew = new URL(currentUrl);
    let pickedTripID = currentUrlNew.pathname.substr(1);
    console.log(pickedTripID)
    
    let stepPic='';
    if(localStorage.getItem('pic')){
      stepPic= localStorage.getItem('pic');
    }
    console.log(stepPic)

    if (document.getElementById(`add-plan-step-place`).value &&
        document.getElementById(`add-plan-step-arrive-date`).value &&
        document.getElementById(`add-plan-step-arrive-time`).value 
       ){
        document.getElementById(`add-plan-step-submit`).style.backgroundColor = '#CC3E55';
        document.getElementById(`add-plan-step-submit`).disabled = false;
      

      firebase.firestore().collection('trips').doc(pickedTripID)
      .collection('plan').doc()
      .set({
        location: document.getElementById(`add-plan-step-place`).value,
        stepName:  document.getElementById(`add-plan-step-name`).value,
        stepArrDate: document.getElementById(`add-plan-step-arrive-date`).value,
        stepArrTime: document.getElementById(`add-plan-step-arrive-time`).value,
        stepDepDate: document.getElementById(`add-plan-step-depart-date`).value,
        stepDepTime: document.getElementById(`add-plan-step-depart-time`).value,
        stepStory: document.getElementById(`add-plan-step-story`).value,
        stepPic: stepPic
      })
      console.log('db plan step ok');
      localStorage.removeItem('pic')  
      document.getElementById(`add-plan-step`).style.display ='none';
    } 
  }

  addTrackStep(e){
    e.preventDefault();

    let currentUrl = location.href;
    let currentUrlNew = new URL(currentUrl);
    let pickedTripID = currentUrlNew.pathname.substr(1);
    
    let stepPic='';
    if(localStorage.getItem('pic')){
      stepPic= localStorage.getItem('pic');
    }
    console.log(stepPic)

    if (document.getElementById(`add-track-step-place`).value &&
        document.getElementById(`add-track-step-arrive-date`).value &&
        document.getElementById(`add-track-step-arrive-time`).value 
       ){
        document.getElementById(`add-track-step-submit`).style.backgroundColor = '#CC3E55';
        document.getElementById(`add-track-step-submit`).disabled = false;
      

      firebase.firestore().collection('trips').doc(pickedTripID)
      .collection('track').doc()
      .set({
        location: document.getElementById(`add-track-step-place`).value,
        stepName:  document.getElementById(`add-track-step-name`).value,
        stepArrDate: document.getElementById(`add-track-step-arrive-date`).value,
        stepArrTime: document.getElementById(`add-track-step-arrive-time`).value,
        stepDepDate: document.getElementById(`add-track-step-depart-date`).value,
        stepDepTime: document.getElementById(`add-track-step-depart-time`).value,
        stepStory: document.getElementById(`add-track-step-story`).value,
        stepPic: stepPic
      })
      console.log('db track step ok');
      localStorage.removeItem('pic') 
      document.getElementById(`add-track-step`).style.display ='none'; 
    } 
  }
  
  hideAddPlanStep(e){
    e.preventDefault();
    document.getElementById(`add-plan-step`).style.display ='none';
  }  
  hideAddTrackStep(e){
    e.preventDefault();
    document.getElementById(`add-track-step`).style.display ='none';
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

  // downloadPic(e){
  //   e.preventDefault();
  //   let storage = firebase.storage();
  //   var storageRef = storage.ref('pics/');
  //   storageRef.child('q.png').getDownloadURL().then((url) => {
  //     console.log('download'+url);
  //     document.getElementById('pic').src = url;
  //   }).catch((error) => {
  //     console.log('download fail'+error.message)
  //   });
  // }

  render() {
    return(
        <div>
            <div id='add-plan-step'>
                <div className='add-step-pop'>
                    <div  onClick={this.hideAddPlanStep.bind(this)} className='add-step-close'>x</div>
                    <div className='add-step-title'>New step of Plan</div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Location</div>
                        <input type='text' className='add-step-place' id='add-plan-step-place'/>
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Step name</div>
                        <input type='text' className='add-step-name' id='add-plan-step-name' placeholder='e.g. Europe Train Tour'/>
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Arrival Date & Time</div>
                      {/* <div className='add-step-arrive'>   */}
                        <input type='date' className='add-step-arrive-date' id='add-plan-step-arrive-date'/>
                        <input type='time' className='add-step-arrive-time' id='add-plan-step-arrive-time'/>
                      {/* </div> */}
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Departure Date & Time</div>
                        <input type='date' className='add-step-depart-date' id='add-plan-step-depart-date'/>
                        <input type='time' className='add-step-depart-time' id='add-plan-step-depart-time'/>
                    </div>     
                    {/* <div className='add-step-type'>
                        <img className='add-step-type-story' src="public/imgs/menu.png" />
                        <img className='add-step-type-eat' src="public/imgs/menu.png" />
                        <img className='add-step-type-event' src="public/imgs/menu.png" />
                        <img className='add-step-type-traffic' src="public/imgs/menu.png" />
                        <img className='add-step-type-stay' src="public/imgs/menu.png" />
                    </div> */}
                    <div className='add-step-list'>
                        <div className='add-step-p'>Your note</div>    
                        <textarea className='add-step-story' id='add-plan-step-story'></textarea>
                    </div>    
                    {/* <form action="/action_page.php"> */}
                        {/* <label htmlFor="birthday">Birthday:</label>
                        <input type="date" id="birthday" name="birthday"/>
                        <input type="submit"/> */}
                    {/* </form> */}
                    <div className='add-step-list'>
                        <div className='add-step-p'>Add your photos</div>
                        <div className='add-step-pic-box'>
                            <input onChange={this.uploadPic.bind(this)} id="uploadPicInput" type="file"></input>
                            <img id='pic'/>
                        </div>
                    </div>    
                    <div className='add-step-list'> 
                        <div className='add-step-submit' onClick={this.addPlanStep.bind(this)} id='add-plan-step-submit' aria-disabled='true'>Add step</div>
                        {/* <div className='add-step-cancel'>Cancel</div>
                        <img className='add-step-remove' src='public/imgs/menu.png'></img> */}
                    </div>
                </div>
            </div>

            <div id='add-track-step'>
                <div className='add-step-pop'>
                    <div onClick={this.hideAddTrackStep.bind(this)} className='add-step-close'>x</div>
                    <div className='add-step-title'>New step of Track</div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Location</div>
                        <input type='text' className='add-step-place' id='add-track-step-place'/>
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Step name</div>
                        <input type='text' className='add-step-name' id='add-track-step-name' placeholder='e.g. Europe Train Tour'/>
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Arrival Date & Time</div>
                        <input type='date' className='add-step-arrive-date' id='add-track-step-arrive-date'/>
                        <input type='time' className='add-step-arrive-time' id='add-track-step-arrive-time'/>
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Departure Date & Time</div>
                        <input type='date' className='add-step-depart-date' id='add-track-step-depart-date'/>
                        <input type='time' className='add-step-depart-time' id='add-track-step-depart-time'/>
                    </div>     
                    <div className='add-step-list'>
                        <div className='add-step-p'>Your story</div>    
                        <textarea className='add-step-story' id='add-track-step-story'></textarea>
                    </div>    
                    <div className='add-step-list'>
                        <div className='add-step-p'>Add your photos</div>
                        <div className='add-step-pic-box'>
                            <input onChange={this.uploadPic.bind(this)} id="uploadPicInput" type="file"></input>
                            <img id='pic'/>
                        </div>
                    </div>    
                    <div className='add-step-list'> 
                        <div className='add-step-submit' onClick={this.addTrackStep.bind(this)} id='add-track-step-submit' aria-disabled='true'>Add step</div>
                    </div>
                </div>
            </div>
        </div>  
    )
  }
} 

export default AddStep;
