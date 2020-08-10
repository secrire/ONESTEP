import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import '../../css/eachTrip.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";


class LikeStep extends React.Component{
    constructor(props){
      super(props);
        this.state = {

        };
    }

    componentDidMount(){
        let user = firebase.auth().currentUser;
        
        if(user){
            this.setState({
                currentUserUid: user.uid,
            }); 

            firebase.firestore().collection('users')
            .onSnapshot(querySnapshot => {
                let planLikeStep=[];
                querySnapshot.forEach(doc => {
                    if(doc.data().email.toLowerCase() === user.email){
                        if(doc.data().planLike){
                            planLikeStep.push(doc.data().planLike);
        
                            this.setState({
                                planLikeSteps: planLikeStep
                            }); 
                        }
                    }
                }) 
            });
        }
    }

    likePlanStep(e){
        e.preventDefault();

        firebase.firestore().collection('users').doc(this.state.currentUserUid)
        .update({
           planLike: firebase.firestore.FieldValue.arrayUnion(e.target.getAttribute('stepid'))
        })

        let pickedTripID = new URL(location.href).pathname.substr(1);
        firebase.firestore().collection('trips').doc(pickedTripID)
        .collection('plan').doc(e.target.getAttribute('stepid'))
        .update({
           stepLike: firebase.firestore.FieldValue.increment(1)
        })
        console.log('db like plan step ok');

        firebase.firestore().collection('trips').doc(pickedTripID)
        .update({
           planLike: firebase.firestore.FieldValue.increment(1)
        })   
    }

    unLikePlanStep(e){
        e.preventDefault();
        console.log(e.target.getAttribute('stepid'));

        let pickedTripID = new URL(location.href).pathname.substr(1);
        firebase.firestore().collection('trips').doc(pickedTripID)
        .collection('plan').doc(e.target.getAttribute('stepid'))
        .update({
           stepLike: firebase.firestore.FieldValue.increment(-1)
        })
        console.log('db unlike step');

        firebase.firestore().collection('trips').doc(pickedTripID)
        .update({
           planLike: firebase.firestore.FieldValue.increment(-1)
        })

        firebase.firestore().collection('users').doc(this.state.currentUserUid)
        .update({
           planLike: firebase.firestore.FieldValue.arrayRemove(e.target.getAttribute('stepid'))
        })
    }

    
    render(){
        let planStepLike = null;

        // if(this.props.state.planStepIDs){
        //     // planStepLike = this.props.state.planStepIDs.map((n)=>{
        //         // let planStepLike = null;
        //         if(this.state.currentUserUid){
        //             planStepLike =  (<div onClick={this.likePlanStep.bind(this)} stepid={this.props.state.planStepIDs[index]}    
        //                                     className='plan-step-like'>
        //                                 <img className='plan-step-like-icon' stepid={this.props.state.planStepIDs[index]} src='./imgs/blueheart.svg'/>
        //                                 <p stepid={this.props.state.planStepIDs[index]}>Like</p>
        //                             </div>)

        //             if(this.state.planLikeSteps){
        //                 for(let k=0; k<this.state.planLikeSteps[0].length; k++){
        //                     if(this.state.planLikeSteps[0][k] === this.props.state.planStepIDs[index]){
        //                         planStepLike = (<div onClick={this.unLikePlanStep.bind(this)} stepid={this.props.state.planStepIDs[index]} className='plan-step-like'>
        //                                             <img className='plan-step-like-icon' stepid={this.props.state.planStepIDs[index]} src='./imgs/redheart.svg'/>
        //                                             <p stepid={this.props.state.planStepIDs[index]}>Like</p>
        //                                         </div>)
        //                     }
        //                 }
        //             }
        //             return planStepLike;
        //         }
        //     // })
        // }         

        if(this.state.currentUserUid){
            planStepLike =  (<div onClick={this.likePlanStep.bind(this)} stepid={this.props.stepid} className='plan-step-like' key={this.props.stepid}>
                                <img className='plan-step-like-icon' stepid={this.props.stepid} src='./imgs/blueheart.svg'/>
                                <p stepid={this.props.stepid}>Like</p>
                            </div>)

                if(this.state.planLikeSteps){
                    for(let k=0; k<this.state.planLikeSteps[0].length; k++){
                        if(this.state.planLikeSteps[0][k] === this.props.stepid){
                            planStepLike = (<div onClick={this.unLikePlanStep.bind(this)} stepid={this.props.stepid} className='plan-step-like' key={this.props.stepid}>
                                                <img className='plan-step-like-icon' stepid={this.props.stepid} src='./imgs/redheart.svg'/>
                                                <p stepid={this.props.stepid}>Like</p>
                                            </div>)
                        }
                    }
                }
        }
        
		return  (
            <>
               {planStepLike} 
            </>
		)
  	}
}
  

export default LikeStep;