import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './eachTrip.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

import AddStep from "./AddStep";
import Map from "./Map";

class TripID extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userDisplayname:'',
            authorName:'',
            trip:[],
            planSteps:[],
            trackSteps:[],
            deletePickedTrip: null,
            planStepIDs:[],
            pickedStepID: null,
            trackStepIDs:[],
            pickedTrackID: null,
            planStepPics:null,
            isauthor: null,

            planLikeSteps:null,
        };        
    }
    componentDidMount() {
        let user = firebase.auth().currentUser;
        let pickedTripID = new URL(location.href).pathname.substr(1);

        // console.log(user.uid)   

        // firebase.firestore().collection('users')
        // .where('email','==',user.email)
        // .onSnapshot(querySnapshot => {
        //     let planLikeStep=[];
        //     querySnapshot.forEach(doc => {
        //         planLikeStep.push(doc.data().planLike);
        //         console.log(planLikeStep)
        //         this.setState({
        //             userDisplayname: doc.data().username,
        //             planLikeSteps: planLikeStep
        //         }); 
        //         console.log(this.state.planLikeSteps)  
        //     }) 
        // });

        firebase.firestore().collection('trips')
        .doc(pickedTripID)
        .onSnapshot(querySnapshot => {
            this.setState({
                trip: querySnapshot.data(),
            }, () => {
                if(this.props.state.userUid === this.state.trip.authorUid){
                    console.log('authour  here') 
                    document.getElementById(`trip-header-set`).style.display ='block';
                    this.setState({
                        isauthor: true
                    });
                    // document.getElementById(`trip-plan-step-edit`).style.display ='block';
                    // document.getElementById(`trip-plan-step-delete`).style.display ='block';
                    // document.getElementById(`trip-track-step-edit`).style.display ='block';
                    // document.getElementById(`trip-track-step-delete`).style.display ='block';
                }
            });
            console.log(this.state.trip.planLike)
        })
        
        firebase.firestore().collection('users')
            // .where('email','==',user.email)
        .get().then(querySnapshot =>{
            querySnapshot.forEach(doc => {
                if(doc.id === this.state.trip.authorUid){
                    this.setState({
                        authorName: doc.data().username
                    });
                }
            })    
        });

        firebase.firestore().collection('trips')
        .doc(pickedTripID).collection('plan')
        .orderBy('stepArrDate','asc')
        .onSnapshot(querySnapshot => {
            let data=[]; 
            let planStepID=[];
            let planStepPic=[];   
            querySnapshot.forEach(doc => {
                data.push(doc.data()); 
                planStepID.push(doc.id);
                planStepPic.push(doc.data().stepPic); 
            })
            this.setState({
                planSteps:data,
                planStepIDs: planStepID,
                planStepPics:planStepPic
            });
            console.log(this.state.planSteps)
            // console.log(this.state.planStepIDs)
            console.log(this.state.planStepPics)
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
                // stepPic.push(doc.data().stepPic); 
            })
            this.setState({
                trackSteps:data2,
                trackStepIDs: trackStepID,
                // stepPics: stepPic
            });
            // console.log(this.state.trackSteps)
            // console.log(this.state.trackStepIDs)
        })
        // console.log(this.state.trip.authorUid)
        // if(this.props.state.userUid !== this.state.trip.authorUid){
        //     console.log('authour not here') 
        //     document.getElementById(`trip-header-set`).style.display ='none';
        // }
    }

    addPlan(e){
        e.preventDefault();
        console.log('badddddd')
        let pickedTripID = new URL(location.href).pathname.substr(1);
        firebase.firestore().collection('trips').doc(pickedTripID)
        .update({
            addPlan: true
        })
        // document.getElementById(`trip-plan-step`).style.display ='block';
        document.getElementById(`card-add-plan`).style.display ='none';
    } 
    addTrack(e){
        e.preventDefault();   
        // this.setState({
        //     showTripTrackStep: true,
        // });
        let pickedTripID = new URL(location.href).pathname.substr(1);
        firebase.firestore().collection('trips').doc(pickedTripID)
        .update({
            addTrack: true
        })
        // document.getElementById(`trip-track-step`).style.display ='block';
        document.getElementById(`card-add-track`).style.display ='none';
    } 

    showAddPlanStep(e){
        e.preventDefault();
        console.log('llllllll')
        document.getElementById(`add-plan-step`).style.display ='block';
    }    
    showAddTrackStep(e){
        e.preventDefault();
        console.log('aaaaaaaaa')
        document.getElementById(`add-track-step`).style.display ='block';
    } 

    showEditPlanStep(e){
        e.preventDefault();
        document.getElementById(`edit-plan-step`).style.display ='block';
        console.log(e.target.getAttribute('stepid'))

        this.setState({
            pickedStepID: e.target.getAttribute('stepid')
        },() =>console.log(this.state.pickedStepID))

        let pickedTripID = new URL(location.href).pathname.substr(1);

        firebase.firestore().collection('trips')
        .doc(pickedTripID).collection('plan').doc(e.target.getAttribute('stepid'))
        .get().then(
            doc => {
                console.log(doc.data());
                document.getElementById(`edit-plan-step-place`).value = doc.data().location;
                document.getElementById(`edit-plan-step-name`).value = doc.data().stepName;
                document.getElementById(`edit-plan-step-arrive-date`).value = doc.data().stepArrDate;
                document.getElementById(`edit-plan-step-arrive-time`).value = doc.data().stepArrTime;
                document.getElementById(`edit-plan-step-depart-date`).value = doc.data().stepDepDate;
                document.getElementById(`edit-plan-step-depart-time`).value = doc.data().stepDepTime;
                document.getElementById(`edit-plan-step-story`).value = doc.data().stepStory;
            })
        }  

    showEditTrackStep(e){
        e.preventDefault();
        document.getElementById(`edit-track-step`).style.display ='block';
        console.log(e.target.getAttribute('stepid'))

        this.setState({
            pickedStepID: e.target.getAttribute('stepid')
        },() =>console.log(this.state.pickedStepID)) 
        
        
        let pickedTripID = new URL(location.href).pathname.substr(1);

        firebase.firestore().collection('trips')
        .doc(pickedTripID).collection('track').doc(e.target.getAttribute('stepid'))
        .get().then(
            doc => {
                console.log(doc.data());
                document.getElementById(`edit-track-step-place`).value = doc.data().location;
                document.getElementById(`edit-track-step-name`).value = doc.data().stepName;
                document.getElementById(`edit-track-step-arrive-date`).value = doc.data().stepArrDate;
                document.getElementById(`edit-track-step-arrive-time`).value = doc.data().stepArrTime;
                document.getElementById(`edit-track-step-depart-date`).value = doc.data().stepDepDate;
                document.getElementById(`edit-track-step-depart-time`).value = doc.data().stepDepTime;
                document.getElementById(`edit-track-step-story`).value = doc.data().stepStory;
            })
    }  


    updateInput(e){
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    showEditTrip(e){
        e.preventDefault();
        document.getElementById(`edit-trip`).style.display ='block';

        let pickedTripID = new URL(location.href).pathname.substr(1);

        firebase.firestore().collection('trips')
        .doc(pickedTripID)
        .get().then(
            doc => {
                console.log(doc.data());
                document.getElementById(`edit-tripName`).value = doc.data().tripName;
                document.getElementById(`edit-tripSum`).value = doc.data().tripSum;
                document.getElementById(`edit-tripStart`).value = doc.data().tripStart;
                document.getElementById(`edit-TripEnd`).value = doc.data().tripEnd;
            })
    }
    hideEditTrip(e){
        e.preventDefault();
        document.getElementById(`edit-trip`).style.display ='none';
    }
    editTrip(e){
        e.preventDefault();
        let pickedTripID = new URL(location.href).pathname.substr(1);
    
        if(document.getElementById(`edit-tripName`).value &&
           document.getElementById(`edit-tripStart`).value){
          document.getElementById(`add-trip-submit`).disabled = false;
          document.getElementById(`add-trip-submit`).style.backgroundColor = '#CC3E55';
    
          console.log(this.state)
          let user = firebase.auth().currentUser;  
    
          firebase.firestore().collection('trips')
          .doc(pickedTripID)
          .update({
            authorUid: user.uid,
            planlike: 0,
            trackLike: 0,
            tripName: document.getElementById(`edit-tripName`).value,
            tripSum: document.getElementById(`edit-tripSum`).value,
            tripStart: document.getElementById(`edit-tripStart`).value,
            tripEnd: document.getElementById(`edit-tripEnd`).value,
            createTime: new Date() 
          })
          document.getElementById(`edit-trip`).style.display ='none';
          console.log('db edit trip ok');  
        } 
    }
    deleteTrip(e){
        e.preventDefault();
        
        // alert('Warning! all the steps including text, photos, locations for this trip will be deleted FOREVER!')
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
    
        if (document.getElementById(`edit-plan-step-place`).value &&
            document.getElementById(`edit-plan-step-arrive-date`).value 
            // &&document.getElementById(`edit-plan-step-arrive-time`).value 
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
                // stepPic: stepPic    
            })
            console.log('db edit plan step ok');
            document.getElementById(`edit-plan-step`).style.display ='none';
            } 
    }
    editTrackStep(e){
        e.preventDefault();
    
        let pickedTripID = new URL(location.href).pathname.substr(1);
    
        if (document.getElementById(`edit-track-step-place`).value &&
            document.getElementById(`edit-track-step-arrive-date`).value 
            // &&document.getElementById(`edit-track-step-arrive-time`).value 
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
            // stepPic: stepPic
          })
          console.log('db edit track step ok');
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
        // for(let i=0; i<this.state.planSteps.length; i++){
        //     console.log(document.getElementById(`plan-step-like`).getAttribute('stepid'))
        //     // document.getElementById(`plan-step-like`).style.cssText += 'pointer-events: none; background-color: rgb(188, 22, 22);'
        // }

        // console.log(e.target.getAttribute('stepid'))

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

        firebase.firestore().collection('users').doc(this.props.state.userUid)
        .update({
           planLike: firebase.firestore.FieldValue.arrayUnion(e.target.getAttribute('stepid'))
        })

    }
    
    likeTrackStep(e){
        e.preventDefault();
        // for(let i=0; i<this.state.planSteps.length; i++){
        //     console.log(document.getElementById(`plan-step-like`).getAttribute('stepid'))
        //     // document.getElementById(`plan-step-like`).style.cssText += 'pointer-events: none; background-color: rgb(188, 22, 22);'
        // }

        console.log(e.target.getAttribute('stepid'))

        // let pickedTripID = new URL(location.href).pathname.substr(1);
        // firebase.firestore().collection('trips').doc(pickedTripID)
        // .collection('plan').doc(e.target.getAttribute('stepid'))
        // .update({
        //    stepLike: firebase.firestore.FieldValue.increment(1)
        // })
        // console.log('db like plan step ok');

        // firebase.firestore().collection('trips').doc(pickedTripID)
        // .update({
        //    planLike: firebase.firestore.FieldValue.increment(1)
        // })

        // firebase.firestore().collection('users').doc(this.props.state.userUid)
        // .update({
        //    planLike: firebase.firestore.FieldValue.arrayUnion(e.target.getAttribute('stepid'))
        // })

    } 
      
    uploadPlanPic(e){
        e.preventDefault();
        let storage = firebase.storage();
        let file = e.target.files[0];
        let storageRef = storage.ref('pics/'+file.name);
    
        let pickedTripID = new URL(location.href).pathname.substr(1);
    
        storageRef.put(file).then((snapshot) => {
          console.log('Uploaded', file.name);
    
          storageRef.getDownloadURL().then(
            (url) => {
            console.log('download'+url);
      
            firebase.firestore().collection('trips').doc(pickedTripID)
            .collection('plan').doc(this.state.pickedStepID)
            .update({
              stepPic: url
            })
          }).catch((error) => {
            console.log('download fail'+error.message)
          });
        });
    }
  
    uploadTrackPic(e){
        e.preventDefault();
        let storage = firebase.storage();
        let file = e.target.files[0];
        let storageRef = storage.ref('pics/'+file.name);
    
        let pickedTripID = new URL(location.href).pathname.substr(1);
    
        storageRef.put(file).then((snapshot) => {
          console.log('Uploaded', file.name);
    
          storageRef.getDownloadURL().then(
            (url) => {
            console.log('download'+url);
      
            firebase.firestore().collection('trips').doc(pickedTripID)
            .collection('track').doc(this.state.pickedStepID)
            .update({
              stepPic: url
            })
          }).catch((error) => {
            console.log('download fail'+error.message)
          });
        });
    }
    render() {
        if(this.state.deletePickedTrip === true){
            return <Redirect to={"/m"+this.props.state.userUid}/>
        }

        let cardAddPlan = null;
        let cardAddTrack = null;
        if(this.props.state.userUid === this.state.trip.authorUid && this.state.trip.addTrack === null){
            cardAddPlan = <div onClick={this.addPlan.bind(this)} id='card-add-plan'>PLAN</div>;
            cardAddTrack= <div onClick={this.addTrack.bind(this)} id='card-add-track'>TRACK</div>; 
        }

        //   ------      plan step box      ------       //
        let tripPlanStep = null;
        let renderPlanSteps =null;
        let tripPlanStepAddBtn =<div>o</div>;

        if(this.state.trip.addPlan ===true){

            if(this.state.isauthor ===true){
                tripPlanStepAddBtn =(<div className='trip-step-add-btn-box'>
                                        <div onClick={this.showAddPlanStep.bind(this)} className='trip-step-add-btn'>+</div>
                                    </div>)

                renderPlanSteps = this.state.planSteps.map((n, index)=>{
                    return  <li className='trip-btn-step-box' key={this.state.planStepIDs[index]}>    
                                {tripPlanStepAddBtn}
                                {/* <div onClick={this.showAddPlanStep.bind(this)} className='trip-step-add-btn'>+</div> */}
                                <div className='trip-step'>
                                    <div className='trip-step-name'>{n.stepName}</div>
                                    <div className='trip-step-date'>{n.stepArrDate}</div>
                                    <div className='trip-step-time'>{n.stepArrTime}</div>
                                    <div className='trip-step-story'>{n.stepStory}</div>
                                    <img className='trip-step-pic'  src={n.stepPic}/>
                                    <div className='trip-step-btn'>
                                        <div onClick={this.likePlanStep.bind(this)} stepid={this.state.planStepIDs[index]} id='plan-step-like'>Like</div>
                                        <div onClick={this.showEditPlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='trip-step-edit' id='trip-plan-step-edit'>Edit step</div>
                                        <div onClick={this.deletePlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='trip-step-edit' id='trip-plan-step-delete'>delete</div>
                                    </div>
                                </div>
                            </li>
                }) 
                
                tripPlanStep =(
                    <div id='trip-plan-step'>
                        {/* <div className='trip-time-line'>-</div> */}
                        <div className='trip-cover'>
                            <div className='trip-category'>PLAN</div>
                            {/* <div className='trip-title'>{this.state.trip.tripName}</div>
                            <div className='trip-summary'>{this.state.trip.tripSum}</div> */}
                            {/* <img className='trip-cover-img' src='public/imgs/b.jpg'></img> */}
                            {/* <div className='trip-flag'>3</div> */}
                        </div>    
                        <div className='trip-details'>
                            <div className='trip-detail-like'> {this.state.trip.planLike} likes</div>
                            {/* <div className='trip-detail-day'> 5 days</div>
                            <div className='trip-detail-photo'> 1 photo</div>
                            <div className='trip-detail-country'> 2 country</div> */}
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
                            {tripPlanStepAddBtn}
                            {/* <li className='trip-step-add-last'>
                                <div className='trip-step-add-last-btn'>+</div> 
                                <div className='trip-step-add-last-p'>Add a step</div>   
                            </li> */}
                            <div className='a'>
                                <div className='dec'></div>
                                <div className='trip-step-add-last-line'>
                                    <div className='trip-step-add-last-btn'>+</div>
                                    <div className='trip-step-add-last-p'>Add a step</div>
                                </div>
                            </div>
                            <li className='trip-end'>
                                <img className='trip-start-end-icon' src='./imgs/flagc-256.png'></img>
                                <div className='trip-start-end-p'>Finish</div> 
                                <div className='trip-start-end-date'>{this.state.trip.tripEnd}</div>      
                            </li> 
                        </ul> 
                    </div>)
            }else{
                renderPlanSteps = this.state.planSteps.map((n, index)=>{
                    return  <li className='trip-btn-step-box' key={this.state.planStepIDs[index]}>    
                                {tripPlanStepAddBtn}
                                <div className='trip-step'>
                                    <div className='trip-step-name'>{n.stepName}</div>
                                    <div className='trip-step-date'>{n.stepArrDate}</div>
                                    <div className='trip-step-time'>{n.stepArrTime}</div>
                                    <div className='trip-step-story'>{n.stepStory}</div>
                                    <img className='trip-step-pic'  src={n.stepPic}/>
                                    <div className='trip-step-btn'>
                                        <div onClick={this.likePlanStep.bind(this)} stepid={this.state.planStepIDs[index]} id='plan-step-like'>Like</div>
                                        {/* <div onClick={this.showEditPlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='trip-step-edit' id='trip-plan-step-edit'>Edit step</div>
                                        <div onClick={this.deletePlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='trip-step-edit' id='trip-plan-step-delete'>delete</div> */}
                                    </div>
                                </div>
                            </li>
                })  

                tripPlanStep =(
                    <div id='trip-plan-step'>
                        <div className='trip-cover'>
                            <div className='trip-category'>PLAN</div>
                            {/* <div className='trip-title'>{this.state.trip.tripName}</div>
                            <div className='trip-summary'>{this.state.trip.tripSum}</div> */}
                            
                        </div>    
                        <div className='trip-details'>
                            <div className='trip-detail-like'> 5 likes</div>
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

                            <li className='trip-end'>
                                <img className='trip-start-end-icon' src='./imgs/flagc-256.png'></img>
                                <div className='trip-start-end-p'>Finish</div> 
                                <div className='trip-start-end-date'>{this.state.trip.tripEnd}</div>      
                            </li> 
                        </ul> 
                    </div>)
            }    
        }
        
        //   ------      track step box      ------       //
        let tripTrackStep = null;
        let renderTrackSteps = null;
        let tripTrackStepAddBtn =<div>o</div>;

        if(this.state.trip.addTrack ===true){
            if(this.state.isauthor ===true){
                tripTrackStepAddBtn = <div onClick={this.showAddTrackStep.bind(this)} className='trip-step-add-btn'>+</div>

                renderTrackSteps = this.state.trackSteps.map((n, index)=>{
                    return  <li className='trip-btn-step-box' key={this.state.trackStepIDs[index]}>    
                                {tripTrackStepAddBtn}
                                <div className='trip-step'>
                                    <div className='trip-step-name'>{n.stepName}</div>
                                    <div className='trip-step-date'>{n.stepArrDate}</div>
                                    <div className='trip-step-time'>{n.stepArrTime}</div>
                                    <div className='trip-step-story'>{n.stepStory}</div>
                                    <img className='trip-step-pic'  src={n.stepPic}/>
                                    <div className='trip-step-btn'>
                                        <div onClick={this.likeTrackStep.bind(this)} stepid={this.state.trackStepIDs[index]} className='trip-step-like'>Like</div>
                                        <div onClick={this.showEditTrackStep.bind(this)} stepid={this.state.trackStepIDs[index]} className='trip-step-edit' id='trip-track-step-edit'>Edit step</div>
                                        <div onClick={this.deleteTrackStep.bind(this)} stepid={this.state.trackStepIDs[index]} className='trip-step-edit' id='trip-track-step-delete'>delete</div>
                                    </div>
                                </div>
                            </li>
                })

                tripTrackStep =(<div id='trip-track-step'>
                                <div className='trip-cover'>
                                    <div className='trip-category'>TRACK</div>
                                    {/* <div className='trip-title'>{this.state.trip.tripName}</div>
                                    <div className='trip-summary'>{this.state.trip.tripSum}</div> */}
                             
                                </div>    
                                <div className='trip-details'>
                                    <div className='trip-detail-like'> 5 likes</div>
                                    <div className='trip-detail-step'> {this.state.trackSteps.length} steps</div>
                                </div>
                                <ul className='trip-steps-box'>
                                    <li>
                                        <div className='trip-start'>
                                            <img className='trip-start-end-icon' src='./imgs/home.png'></img> 
                                            <div className='trip-start-end-p'>Start</div>  
                                            <div className='trip-start-end-date'>{this.state.trip.tripStart}</div> 
                                        </div>
                                    </li>
                                    {renderTrackSteps}
                                    <li>    
                                        {tripTrackStepAddBtn}
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
                            </div> )
            }else{
                renderTrackSteps = this.state.trackSteps.map((n, index)=>{
                    return  <li className='trip-btn-step-box' key={this.state.trackStepIDs[index]}>    
                                {tripTrackStepAddBtn}
                                <div className='trip-step'>
                                    <div className='trip-step-name'>{n.stepName}</div>
                                    <div className='trip-step-date'>{n.stepArrDate}</div>
                                    <div className='trip-step-time'>{n.stepArrTime}</div>
                                    <div className='trip-step-story'>{n.stepStory}</div>
                                    <img className='trip-step-pic'  src={n.stepPic}/>
                                    <div className='trip-step-like'>Like</div>
                                </div>
                            </li>
                })
                tripTrackStep =(<div id='trip-track-step'>
                                <div className='trip-cover'>
                                    <div className='trip-category'>TRACK</div>
                                    {/* <div className='trip-title'>{this.state.trip.tripName}</div>
                                    <div className='trip-summary'>{this.state.trip.tripSum}</div> */}
                                
                                </div>    
                                <div className='trip-details'>
                                    <div className='trip-detail-like'> 5 likes</div>
                                    <div className='trip-detail-step'> {this.state.trackSteps.length} steps</div>
                                </div>
                                <ul className='trip-steps-box'>
                                    <li>
                                        <div className='trip-start'>
                                            <img className='trip-start-end-icon' src='./imgs/home.png'></img> 
                                            <div className='trip-start-end-p'>Start</div>  
                                            <div className='trip-start-end-date'>{this.state.trip.tripStart}</div> 
                                        </div>
                                    </li>
                                    {renderTrackSteps}
                                    {tripTrackStepAddBtn}
                                    
                                    <li className='trip-end'>
                                        <img className='trip-start-end-icon' src='./imgs/flag.png'></img>
                                        <div className='trip-start-end-p'>Finish</div> 
                                        <div className='trip-start-end-date'>{this.state.trip.tripEnd}</div>      
                                    </li> 
                                </ul> 
                            </div> )
            }   
        }

        

        // console.log(this.props.state.userUid)
        // console.log(this.state.trip.authorUid)


        // let planStepUploadPicInput = this.state.planSteps.map((n, index)=>{
        //     return  <div key={this.state.planStepIDs[index]}>    
        //                 <input onChange={this.uploadPic.bind(this)} stepid={this.state.trackStepIDs[index]} className="uploadPicInput" type="file"/>
        //                     {/* <img className='trip-step-pic'  src={n.stepPic}/> */}
 
        //             </div>
        // })

        // let renderPlanStepPics = this.state.planStepPics.map((n, index)=>{
        //     return  <div key={this.state.planStepPics[index]}>    
        //                 <img stepid={this.state.planStepPics[index]} src={n}/>   
        //             </div>
        // })

        return  <div className='plan-track-page'>
                    <Map/>

                    <div className='trip-header'>
                        <img className='trip-header-img' src='./imgs/q.png'></img>
                        <div className='trip-header-name'>{this.state.authorName}</div>
                       
                        {/* <div onClick={this.addPlan.bind(this)} id='card-add-plan'>Plan</div> */}
                        {cardAddPlan}
                        {/* <div onClick={this.addTrack.bind(this)} id='card-add-track'>Track</div>  */}
                        {cardAddTrack}
                        <div onClick={this.showEditTrip.bind(this)} id='trip-header-set'>Edit trip</div>
                    </div>
                    <div className='trip-name-div'>
                        <div className='trip-title'>{this.state.trip.tripName}</div>
                        <div className='trip-summary'>{this.state.trip.tripSum}</div>
                    </div>
                    <div className='plan-track-content'>
                        {tripPlanStep}
                        {tripTrackStep}
    
                        {/* <div id='trip-track-step'>
                            <div className='trip-cover'>
                                <div className='trip-title'>{this.state.trip.tripName}</div>
                                <div className='trip-summary'>{this.state.trip.tripSum}</div>
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
                        </div>  */}
                    </div> 
                    
                    {/* -----   edit trip   ----- */}
                    <div id='edit-trip'>
                        <div className='add-pop'>
                            <div onClick={this.hideEditTrip.bind(this)} className='add-close'>x</div>
                            <div className='add-title'>Edit trip</div>
                            <div className='add-name'>Trip name</div>
                            <input type='text' className='each-tripName' id='edit-tripName' placeholder='e.g. Europe Train Tour'
                                    onChange={this.updateInput.bind(this)}/>
                            <div className='add-sum'>Trip summary</div>
                            <input type='text' className='each-tripSum' id='edit-tripSum' placeholder='e.g. First Solo Trip With Luck'
                                    onChange={this.updateInput.bind(this)}/>        
                            <div className='add-when'>When?</div>
                            <div className='add-start'>Start date</div>
                            <input type='date' className='each-tripStart' id='edit-tripStart' placeholder='5 July 2020'
                                    onChange={this.updateInput.bind(this)}/>   
                            <div className='add-end'>End date</div>
                            <input type='date' className='each-tripEnd' id='edit-tripEnd' placeholder='I have no idea'
                                    onChange={this.updateInput.bind(this)}/>
                            <div onClick={this.editTrip.bind(this)} id='add-trip-submit' aria-disabled='true'>Save changes</div>
                            <div onClick={this.deleteTrip.bind(this)} id='delete-trip-submit'>delete</div>
                        </div>
                    </div>   

                    {/* -----   edit step   ----- */}
                    <div id='edit-plan-step'>
                        <div className='add-step-pop'>
                            <div onClick={this.hideEditPlanStep.bind(this)} className='add-step-close'>x</div>
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
                                <div className='add-step-p'>Arrival</div>
                                <input type='date' className='add-step-arrive-date' id='edit-plan-step-arrive-date' min={this.state.trip.tripStart} max={this.state.trip.tripEnd}/>
                                <input type='time' className='add-step-arrive-time' id='edit-plan-step-arrive-time'/>
                            </div>
                            <div className='add-step-list'>
                                <div className='add-step-p'>Departure</div>
                                <input type='date' className='add-step-depart-date' id='edit-plan-step-depart-date' min={this.state.trip.tripStart} max={this.state.trip.tripEnd}/>
                                <input type='time' className='add-step-depart-time' id='edit-plan-step-depart-time'/>
                            </div>     
                            <div className='add-step-list'>
                                <div className='add-step-p'>Your note</div>    
                                <textarea className='add-step-story' id='edit-plan-step-story'></textarea>
                            </div>    
                            <div className='add-step-list'>
                                <div className='add-step-p'>Add your photos</div>
                                <div className='add-step-pic-box'>
                                    {/* {planStepUploadPicInput} */}
                                    <input onChange={this.uploadPlanPic.bind(this)} className="uploadPicInput" type="file"/>
                                    {/* <img id='stepPic' src={this.state.stepPic}/> */}
                                    {/* {renderPlanStepPics} */}
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
                                <div className='add-step-p'>Arrival</div>
                                <input type='date' className='add-step-arrive-date' id='edit-track-step-arrive-date' min={this.state.trip.tripStart} max={this.state.trip.tripEnd}/>
                                <input type='time' className='add-step-arrive-time' id='edit-track-step-arrive-time'/>
                            </div>
                            <div className='add-step-list'>
                                <div className='add-step-p'>Departure</div>
                                <input type='date' className='add-step-depart-date' id='edit-track-step-depart-date' min={this.state.trip.tripStart} max={this.state.trip.tripEnd}/>
                                <input type='time' className='add-step-depart-time' id='edit-track-step-depart-time'/>
                            </div>     
                            <div className='add-step-list'>
                                <div className='add-step-p'>Your story</div>    
                                <textarea className='add-step-story' id='edit-track-step-story'></textarea>
                            </div>    
                            <div className='add-step-list'>
                                <div className='add-step-p'>Add your photos</div>
                                <div className='add-step-pic-box'>
                                    <input onChange={this.uploadTrackPic.bind(this)} className="uploadPicInput" type="file"></input>
                                    <img id='pic'/>
                                </div>
                            </div>    
                            <div className='add-step-list'> 
                                <div className='add-step-submit' onClick={this.editTrackStep.bind(this)} id='edit-track-step-submit' aria-disabled='true'>Save changes</div>
                            </div>
                        </div>
                    </div>
                    <AddStep state={this.state}/>
                </div> 
        }
    }  

   export default TripID;