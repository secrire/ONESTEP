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
        }
    showAddStep(e){
        e.preventDefault();
        document.getElementById(`add-step`).style.display ='block';
    }     
  
    render() {
      return<div className='content'>
                <div className='trip-add-step'>
                    <div className='trip-header'>
                        {/* <img className='trip-header-img' src='public/imgs/q.png'></img>
                        <div className='trip-header-name'>username</div> */}
                        <div className='trip-title'>taipei</div>
                        <div className='trip-summary'>it is so humid</div>
                        <div className='trip-header-set'>trip settings</div>
                    </div>
                    {/* <div className='trip-time-line'>-</div> */}
                    {/* <div className='trip-cover'> */}
                        <img className='trip-cover-img' src='public/imgs/b.jpg'></img>
                        {/* <div className='trip-flag'>3</div> */}
                    {/* </div>     */}
                    <div className='trip-details'>
                        <div className='trip-detail-like'> 5 likes</div>
                        <div className='trip-detail-day'> 5 days</div>
                        <div className='trip-detail-photo'> 1 photo</div>
                        <div className='trip-detail-country'> 2 country</div>
                        <div className='trip-detail-step'> 3 steps</div>
                    </div>
                    <div className='trip-steps-box'>
                        <div className='trip-start'>
                            <img className='trip-start-icon' src='public/imgs/q.png'></img> 
                            <div className='trip-start-date'>6 July 2020</div>
                            {/* <div className='trip-start-p'>Start</div> */}   
                        </div>
                        <div onClick={this.showAddStep.bind(this)} className='trip-step-add-btn'>+</div>
                        <div className='trip-step-add-btn'>+</div>
                        <div className='trip-step'>
                            <div className='trip-step-name'>tainan</div>
                            <div className='trip-step-date'>7 July 2020</div>
                            <div className='trip-step-time'>13:00</div>
                            <img className='trip-step-pic'  src='public/imgs/b.jpg'/>
                            <div className='trip-step-edit'>Edit</div>
                        </div>
                        <div className='trip-step-add-btn'>+</div>
                        <div className='trip-step-add-last'>
                            <div className='trip-step-add-last-p'>Add a step</div>
                            <div className='trip-step-add-last-btn'>+</div>    
                        </div>
                        <div className='trip-end'>
                            <img className='trip-end-icon' src='public/imgs/q.png'></img>
                            <div className='trip-end-date'>21 July 2020</div>
                            {/* <div className='trip-end-p'>Finish</div> */}       
                        </div> 
                    </div> 
                </div>         
            </div> 
        }
   }  

   export default TripID;