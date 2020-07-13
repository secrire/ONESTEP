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
            isaddedPlan: false
          };        
        }
    addPlan(e){
        e.preventDefault();
        document.getElementById(`trip-plan-step`).style.display ='block';
        document.getElementById(`card-add-plan`).style.display ='none';
        // firebase.firestore().collection('trips').doc('BJtEvs1hzD8qZWutOLW1')
        // .collection('plan').doc()
        // .set({
        //     location: ''
        // })
        console.log('db add plan subcollection ok');  
        // document.getElementById(`card-add-plan`).style.display ='none';
        this.setState({
            isaddedPlan: true
        });
    } 
    
    addTrack(e){
        e.preventDefault();   
        document.getElementById(`trip-track-step`).style.display ='block';
        document.getElementById(`card-add-track`).style.display ='none';

        firebase.firestore().collection('trips').doc('BJtEvs1hzD8qZWutOLW1')
        .collection('track')
        .doc()
        .set({
            location: '',
        //     stepName:  document.getElementById(`add-step-name`).value,
        //     stepArrDate: document.getElementById(`add-sum-input`).value,
        //     stepArrTime: document.getElementById(`add-sum-input`).value,
        //     stepDepDate: document.getElementById(`add-sum-input`).value,
        //     stepDepTime: document.getElementById(`add-sum-input`).value,
        //     stepStory: document.getElementById(`add-start-input`).value,
        //     stepPic: ''
        })
        console.log('db add track subcollection ok');  
        // document.getElementById(`card-add-track`).style.display ='none';
        this.setState({
            isaddedPlan: true
        });
    } 

    showAddStep(e){
        e.preventDefault();
        document.getElementById(`add-step`).style.display ='block';
    }     
  
    render() {
      return<div className='plan-track-page'>
                <div className='trip-header'>
                    <img className='trip-header-img' src='./imgs/q.png'></img>
                    <div className='trip-header-name'>username</div>
                    <div onClick={this.addPlan.bind(this)} id='card-add-plan'>Plan</div>
                    <div onClick={this.addTrack.bind(this)} id='card-add-track'>Track</div> 
                    <div className='trip-header-set'>Edit trip</div>
                </div>
                <div className='plan-track-content'>
                <div id='trip-plan-step'>
                  
                    {/* <div className='trip-time-line'>-</div> */}
                    <div className='trip-cover'>
                        <div className='trip-title'>taiwan</div>
                        <div className='trip-summary'>it is so humid</div>
                        {/* <img className='trip-cover-img' src='public/imgs/b.jpg'></img> */}
                        {/* <div className='trip-flag'>3</div> */}
                    </div>    
                    <div className='trip-details'>
                        <div className='trip-detail-like'> 5 likes</div>
                        <div className='trip-detail-day'> 5 days</div>
                        <div className='trip-detail-photo'> 1 photo</div>
                        <div className='trip-detail-country'> 2 country</div>
                        <div className='trip-detail-step'> 3 steps</div>
                    </div>
                    <ul className='trip-steps-box'>
                        <li>
                            <div className='trip-start'>
                                <img className='trip-start-icon' src='./imgs/q.png'></img> 
                                <div className='trip-start-p'>Start</div>  
                                <div className='trip-start-date'>6 July 2020</div> 
                            </div>
                        </li>
                        <li className='trip-btn-step-box'>    
                            <div onClick={this.showAddStep.bind(this)} className='trip-step-add-btn'>+</div>
                            <div className='trip-step'>
                                <div className='trip-step-name'>tainan</div>
                                <div className='trip-step-date'>7 July 2020</div>
                                <div className='trip-step-time'>13:00</div>
                                <div className='trip-step-story'>pick up ticket</div>
                                {/* <img className='trip-step-pic'  src='public/imgs/b.jpg'/> */}
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
                                {/* <img className='trip-step-pic'  src='public/imgs/b.jpg'/> */}
                                <div className='trip-step-edit'>Edit step</div>
                            </div>
                        </li>
                        <li>    
                            <div onClick={this.showAddStep.bind(this)} className='trip-step-add-btn'>+</div>
                        </li>
                        <li className='trip-step-add-last'>
                            <div className='trip-step-add-last-btn'>+</div> 
                            <div className='trip-step-add-last-p'>Add a step</div>   
                        </li>
                        <li className='trip-end'>
                            <img className='trip-end-icon' src='./imgs/q.png'></img>
                            <div className='trip-end-p'>Finish</div> 
                            <div className='trip-end-date'>21 July 2020</div>      
                        </li> 
                    </ul> 
                </div> 

                <div id='trip-track-step'>
                    {/* <div className='trip-time-line'>-</div> */}
                    <div className='trip-cover'>
                        <div className='trip-title'>taiwan</div>
                        <div className='trip-summary'>it is so humid</div>
                        {/* <img className='trip-cover-img' src='public/imgs/b.jpg'></img> */}
                        {/* <div className='trip-flag'>3</div> */}
                    </div>    
                    <div className='trip-details'>
                        <div className='trip-detail-like'> 5 likes</div>
                        <div className='trip-detail-day'> 5 days</div>
                        <div className='trip-detail-photo'> 1 photo</div>
                        <div className='trip-detail-country'> 2 country</div>
                        <div className='trip-detail-step'> 3 steps</div>
                    </div>
                    <ul className='trip-steps-box'>
                        <li>
                            <div className='trip-start'>
                                <img className='trip-start-icon' src='./imgs/q.png'></img> 
                                <div className='trip-start-p'>Start</div>  
                                <div className='trip-start-date'>6 July 2020</div> 
                            </div>
                        </li>
                        <li className='trip-btn-step-box'>    
                            <div onClick={this.showAddStep.bind(this)} className='trip-step-add-btn'>+</div>
                            <div className='trip-step'>
                                <div className='trip-step-name'>tainan</div>
                                <div className='trip-step-date'>7 July 2020</div>
                                <div className='trip-step-time'>13:00</div>
                                <div className='trip-step-story'>so humid!!!!!</div>
                                <img className='trip-step-pic'  src='./imgs/b.jpg'/>
                                <div className='trip-step-edit'>Edit step</div>
                            </div>
                        </li>
                        <li className='trip-btn-step-box'>    
                            <div onClick={this.showAddStep.bind(this)} className='trip-step-add-btn'>+</div>
                            <div className='trip-step'>
                                <div className='trip-step-name'>tainan</div>
                                <div className='trip-step-date'>7 July 2020</div>
                                <div className='trip-step-time'>13:00</div>
                                <div className='trip-step-story'>so humid!!!!!</div>
                                <img className='trip-step-pic'  src='./imgs/b.jpg'/>
                                <div className='trip-step-edit'>Edit step</div>
                            </div>
                        </li>
                        <li className='trip-btn-step-box'>    
                            <div onClick={this.showAddStep.bind(this)} className='trip-step-add-btn'>+</div>
                            <div className='trip-step'>
                                <div className='trip-step-name'>taitung</div>
                                <div className='trip-step-date'>7 July 2020</div>
                                <div className='trip-step-time'>13:00</div>
                                <div className='trip-step-story'>very hot weather</div>
                                <img className='trip-step-pic'  src='./imgs/b.jpg'/>
                                <div className='trip-step-edit'>Edit step</div>
                            </div>
                        </li>
                        <li>    
                            <div onClick={this.showAddStep.bind(this)} className='trip-step-add-btn'>+</div>
                        </li>
                        <li className='trip-step-add-last'>
                            <div className='trip-step-add-last-btn'>+</div> 
                            <div className='trip-step-add-last-p'>Add a step</div>   
                        </li>
                        <li className='trip-end'>
                            <img className='trip-end-icon' src='./imgs/q.png'></img>
                            <div className='trip-end-p'>Finish</div> 
                            <div className='trip-end-date'>21 July 2020</div>      
                        </li> 
                    </ul> 
                </div> 
                </div>        
            </div> 
        }
   }  

   export default TripID;