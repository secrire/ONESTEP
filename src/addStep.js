import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './member.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

class AddStep extends React.Component {
  constructor(props){
    super(props);

    // this.state = {
    //     tripSubcollect:''
    //   };
  }
  addStep(e){
    e.preventDefault();

    if (document.getElementById(`add-step-place`).value &&
        document.getElementById(`add-step-arrive-date`).value &&
        document.getElementById(`add-step-arrive-time`).value 
       ){
        document.getElementById(`add-step-submit`).style.backgroundColor = '#CC3E55';
        document.getElementById(`add-step-submit`).disabled = false;
      
        
    //   this.setState({
    //     tripSubcollect:'track'
    //   });

      firebase.firestore().collection('trips').doc('BJtEvs1hzD8qZWutOLW1')
      .collection('track').doc()
      .set({
        location: document.getElementById(`add-step-place`).value,
        stepName:  document.getElementById(`add-step-name`).value,
        stepArrDate: document.getElementById(`add-sum-input`).value,
        stepArrTime: document.getElementById(`add-sum-input`).value,
        stepDepDate: document.getElementById(`add-sum-input`).value,
        stepDepTime: document.getElementById(`add-sum-input`).value,
        stepStory: document.getElementById(`add-start-input`).value,
        stepPic: ''
      })
      console.log('db track step ok');  
    } 
  }
  
  hideAddStep(e){
    e.preventDefault();
    document.getElementById(`add-step`).style.display ='none';
  }     
  render() {
    return(
            <div id='add-step'>
                <div className='add-step-pop'>
                    <div  onClick={this.hideAddStep.bind(this)} className='add-step-close'>x</div>
                    <div className='add-step-title'>New step</div>
                    <div className='add-step-p'>Location</div>
                    <input type='text' className='add-step-place' id='add-step-place'/>
                    <div className='add-step-p'>Step name</div>
                    <input type='text' className='add-step-name' id='add-step-name' placeholder='e.g. Europe Train Tour'/>
                    <div className='add-step-p'>Arrival Date & Time</div>
                    <div className='add-step-arrive'>  
                        <input type='date' className='add-step-arrive-date' id='add-step-arrive-date'/>
                        <input type='time' className='add-step-arrive-time' id='add-step-arrive-time'/>
                    </div>
                    <div className='add-step-p'>Departure Date & Time</div>
                    <div className='add-step-depart'> 
                        <input type='date' className='add-step-depart-date' id='add-step-depart-date'/>
                        <input type='time' className='add-step-depart-time' id='add-step-depart-time'/>
                    </div>       
                    {/* <div className='add-step-type'>
                        <img className='add-step-type-story' src="public/imgs/menu.png" />
                        <img className='add-step-type-eat' src="public/imgs/menu.png" />
                        <img className='add-step-type-event' src="public/imgs/menu.png" />
                        <img className='add-step-type-traffic' src="public/imgs/menu.png" />
                        <img className='add-step-type-stay' src="public/imgs/menu.png" />
                    </div> */}
                    <div className='add-step-p'>Your story</div>    
                    <textarea className='add-step-story' id='add-step-story'></textarea>
                    {/* <form action="/action_page.php"> */}
                        {/* <label htmlFor="birthday">Birthday:</label>
                        <input type="date" id="birthday" name="birthday"/>
                        <input type="submit"/> */}
                    {/* </form> */}
                    <div className='add-step-p'>Add your photos</div>
                    <div className='add-step-pic-box'></div>
                    <div className='add-step-btn-box'> 
                        <div className='add-step-submit' onClick={this.addStep.bind(this)} id='add-step-submit' aria-disabled='true'>Add step</div>
                        {/* <div className='add-step-cancel'>Cancel</div>
                        <img className='add-step-remove' src='public/imgs/menu.png'></img> */}
                    </div>
                </div>
            </div>
    )
  }
} 

export default AddStep;
