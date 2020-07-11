import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './member.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";



class MContent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isaddedPlan: false
          };    
        }
    addPlan(e){
        e.preventDefault();
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
     
    render() {
        if(this.state.isaddedPlan === true){
            return <Redirect to='/tripID'/>
        }
          
        return <div className='content'>
                    <div className='user-total-trip'>
                        <div className='user-card'>
                            <img className='user-card-img' src='public/imgs/b.JPG'></img>
                            <div className='user-card-name'>username</div>
                            <div className='user-card-statis'>
                                <div className='user-card-like'>5 likes</div>
                                <div className='user-card-trip'>5 trips</div>
                            </div>
                        </div>
                        <div className='user-title'>Trips</div>
                        
                        <div className='cards'>
                            <Link to='/tripID'><div className='card'>  
                                <div className='card-title'>italy gelato</div>
                                <div className='card-main'>
                                    <div className='card-time'>July 2020</div>
                                    <div className='card-days'>18 days</div>
                                    <div onClick={this.addPlan.bind(this)} id='card-add-plan'>Plan</div>
                                    <div onClick={this.addTrack.bind(this)} id='card-add-track'>Track</div>
                                </div>
                                <img className='card-img' src='public/imgs/b.JPG'></img>
                            </div></Link>
                            <a><div className='card'>  
                                <div className='card-title'>italy gelato</div>
                                <div className='card-main'>
                                    <div className='card-time'>July 2020</div>
                                    <div className='card-days'>18 days</div>
                                </div>
                                <img className='card-img' src='public/imgs/b.JPG'></img>
                            </div></a>
                            <a><div className='card'>  
                                <div className='card-title'>italy gelato</div>
                                <div className='card-main'>
                                    <div className='card-time'>July 2020</div>
                                    <div className='card-days'>18 days</div>
                                </div>
                                <img className='card-img' src='public/imgs/b.JPG'></img>
                            </div></a>
                        </div>
                    </div>

                </div>
    }
}  

export default MContent;   

