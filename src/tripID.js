import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './eachTrip.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import Step from "./AddStep";
import Map from "./Map";

let today = new Date().toJSON().slice(0,10);

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
        if(user){
            firebase.firestore().collection('users')
            .where('email','==',user.email)
            .onSnapshot(querySnapshot => {
                let planLikeStep=[];
                querySnapshot.forEach(doc => {
                    if(doc.data().planLike){
                        planLikeStep.push(doc.data().planLike);
                        // console.log(planLikeStep)
    
                        this.setState({
                            // userDisplayname: doc.data().username,
                            planLikeSteps: planLikeStep
                        }); 
                    }
                    
                    console.log(this.state.planLikeSteps)  
                }) 
            });
        }
     
        console.log(this.props.state.userUid)

        firebase.firestore().collection('trips')
        .doc(pickedTripID)
        .onSnapshot(querySnapshot => {
            this.setState({
                trip: querySnapshot.data(),
            }, () => {
                if(this.props.state.userUid === this.state.trip.authorUid){
                    // console.log('authour  here') 
                    document.getElementById(`trip-header-set`).style.display ='flex';
                    this.setState({
                        isauthor: true
                    });
                    // document.getElementById(`trip-plan-step-edit`).style.display ='block';
                    // document.getElementById(`trip-plan-step-delete`).style.display ='block';
                    // document.getElementById(`trip-track-step-edit`).style.display ='block';
                    // document.getElementById(`trip-track-step-delete`).style.display ='block';
                }
                console.log(this.state.trip)
            });
            console.log(this.state.trip)
            // this.setState({
            //     editor: querySnapshot.data().editor,
            // }, () => {
            //     console.log(this.state.editor[1])
            //     console.log(this.props.state.userUid)
            //     for(let i=0; i<this.state.editor.length; i++){
            //         if(this.props.state.userUid === this.state.editor[i]){
            //             this.setState({
            //                 isEditor: true
            //             });
            //             console.log(this.state.isEditor)
            //         }else{
            //             console.log('not editor') 
            //             console.log(this.state.isEditor)
            //         }
            //     }
    
            // });  
        })
        
        firebase.firestore().collection('users')
        .onSnapshot(querySnapshot =>{
            querySnapshot.forEach(doc => {
                // this.setState({
                //     authorName: doc.data().username
                // });
                if(doc.id === this.state.trip.authorUid){
                    this.setState({
                        authorName: doc.data().username,
                        authorPic:doc.data().profilePic
                    });
                }
                // console.log('test')
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
            // console.log(this.state.planSteps)
            // console.log(this.state.planStepIDs)
            // console.log(this.state.planStepPics)
        })

        // firebase.firestore().collection('trips')
        // .doc(pickedTripID).collection('track')
        // .orderBy('stepArrDate','asc')
        // .onSnapshot(querySnapshot => {
        //     let data2=[];  
        //     let trackStepID=[];    
        //     querySnapshot.forEach(doc => {
        //         data2.push(doc.data()); 
        //         trackStepID.push(doc.id);
        //     })
        //     this.setState({
        //         trackSteps:data2,
        //         trackStepIDs: trackStepID,   
        //     });  
        // })
        
        // console.log(this.state.trip.authorUid)
        // if(this.props.state.userUid !== this.state.trip.authorUid){
        //     console.log('authour not here') 
        //     document.getElementById(`trip-header-set`).style.display ='none';
        // }
        if(this.state.trip.tripStart){
            document.getElementById(`editTripStart`).value = this.state.trip.tripStart;
            document.getElementById(`editTripEnd`).value = this.state.trip.tripEnd;
        }

      
    }

    addPlan(e){
        e.preventDefault();

        let pickedTripID = new URL(location.href).pathname.substr(1);
        firebase.firestore().collection('trips').doc(pickedTripID)
        .update({
            addPlan: true
        })
        // document.getElementById(`trip-plan-step`).style.display ='block';
        document.getElementById(`card-add-plan`).style.display ='none';
    } 
    // addTrack(e){
    //     e.preventDefault();   
    //     // this.setState({
    //     //     showTripTrackStep: true,
    //     // });
    //     let pickedTripID = new URL(location.href).pathname.substr(1);
    //     firebase.firestore().collection('trips').doc(pickedTripID)
    //     .update({
    //         addTrack: true
    //     })
    //     // document.getElementById(`trip-track-step`).style.display ='block';
    //     document.getElementById(`card-add-track`).style.display ='none';
    // } 

    showAddPlanStep(e){
        e.preventDefault();
        document.getElementById(`add-plan-step`).style.display ='block';
        this.setState({
            pickedAdd:'plan',
        })
    }    
    // showAddTrackStep(e){
    //     e.preventDefault();
    //     document.getElementById(`add-track-step`).style.display ='block';
    //     this.setState({
    //         pickedAdd:'track',
    //     })
    // } 

    showEditPlanStep(e){
        e.preventDefault();
        document.getElementById(`edit-plan-step`).style.display ='block';
        // console.log(e.target.getAttribute('stepid'))

        this.setState({
            pickedStepID: e.target.getAttribute('stepid'),
            pickedEdit:'plan',
        },() =>console.log(this.state.pickedStepID))

        let pickedTripID = new URL(location.href).pathname.substr(1);

        firebase.firestore().collection('trips')
        .doc(pickedTripID).collection('plan').doc(e.target.getAttribute('stepid'))
        .get().then(
            doc => {
                console.log(doc.data());
                document.getElementById(`editPlanStepPlace`).value = doc.data().location;
                document.getElementById(`editPlanStepName`).value = doc.data().stepName;
                document.getElementById(`editPlanStepArriveDate`).value = doc.data().stepArrDate;
                document.getElementById(`edit-plan-step-arrive-time`).value = doc.data().stepArrTime;
                document.getElementById(`editPlanStepDepartDate`).value = doc.data().stepDepDate;
                document.getElementById(`edit-plan-step-depart-time`).value = doc.data().stepDepTime;
                document.getElementById(`edit-plan-step-story`).value = doc.data().stepStory;
            })
    }  

    // showEditTrackStep(e){
    //     e.preventDefault();
    //     document.getElementById(`edit-track-step`).style.display ='block';
    //     console.log(e.target.getAttribute('stepid'))

    //     this.setState({
    //         pickedStepID: e.target.getAttribute('stepid'),
    //         pickedEdit:'track',
    //     },() =>console.log(this.state.pickedStepID)) 
        
        
    //     let pickedTripID = new URL(location.href).pathname.substr(1);

    //     firebase.firestore().collection('trips')
    //     .doc(pickedTripID).collection('track').doc(e.target.getAttribute('stepid'))
    //     .get().then(
    //         doc => {
    //             console.log(doc.data());
    //             document.getElementById(`edit-track-step-place`).value = doc.data().location;
    //             document.getElementById(`edit-track-step-name`).value = doc.data().stepName;
    //             document.getElementById(`edit-track-step-arrive-date`).value = doc.data().stepArrDate;
    //             document.getElementById(`edit-track-step-arrive-time`).value = doc.data().stepArrTime;
    //             document.getElementById(`edit-track-step-depart-date`).value = doc.data().stepDepDate;
    //             document.getElementById(`edit-track-step-depart-time`).value = doc.data().stepDepTime;
    //             document.getElementById(`edit-track-step-story`).value = doc.data().stepStory;
    //         })
    // }  


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
                document.getElementById(`editTripName`).value = doc.data().tripName;
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
    
        // if(document.getElementById(`edit-tripName`).value &&
        //    document.getElementById(`editTripStart`).value){
        //   document.getElementById(`add-trip-submit`).disabled = false;
        //   document.getElementById(`add-trip-submit`).style.backgroundColor = '#CC3E55';
    
        //   console.log(this.state)
          let user = firebase.auth().currentUser;  
    
          firebase.firestore().collection('trips')
          .doc(pickedTripID)
          .update({
            authorUid: user.uid,
            planlike: 0,
            trackLike: 0,
            tripName: document.getElementById(`editTripName`).value,
            tripSum: document.getElementById(`edit-tripSum`).value,
            tripStart: document.getElementById(`editTripStart`).value,
            tripEnd: document.getElementById(`editTripEnd`).value,
            // createTime: new Date() 
          })
          document.getElementById(`edit-trip`).style.display ='none';
          console.log('db edit trip ok');  
        // } 
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
    showAddEditor(e){
        e.preventDefault();
        this.setState({
            addEditor: true
        })
    } 
    addEditor(e){
        e.preventDefault();
        console.log('yes');

        firebase.firestore().collection('users')
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {

                if(document.getElementById(`add-editor-input`).value === doc.data().email){
                    console.log(doc.data());

                    // this.setState({
                    //     searchUserName: doc.data().username,
                    //     searchUserUID: doc.id
                    // }); 
                    let pickedTripID = new URL(location.href).pathname.substr(1);
                    firebase.firestore().collection('trips')
                    .doc(pickedTripID)
                    .update({
                        editor: firebase.firestore.FieldValue.arrayUnion(doc.id)
                    })
                    console.log(doc.data().username);
                }else{
                    console.log('no this member exist')
                }    
            }) 
        });

    }

    deletePlanStep(e){
        e.preventDefault();
        let pickedTripID = new URL(location.href).pathname.substr(1);

        firebase.firestore()
        .collection('trips').doc(pickedTripID)
        .collection('plan').doc(e.target.getAttribute('stepid'))
        .delete().then(() =>{
            console.log('delete plan step ok')
        }).catch((err) =>{
            console.log(err.message)
        })
    } 
    // deleteTrackStep(e){
    //     e.preventDefault();
    //     let pickedTripID = new URL(location.href).pathname.substr(1);

    //     // this.setState({
    //     //     pickedStepID: e.target.getAttribute('stepid')
    //     // },() =>console.log(this.state.pickedStepID))    

    //     firebase.firestore()
    //     .collection('trips').doc(pickedTripID)
    //     .collection('track').doc(e.target.getAttribute('stepid'))
    //     .delete().then(() =>{
    //         console.log('delete track step ok')
    //     }).catch((err) =>{
    //         console.log(err.message)
    //     })
    // } 
    changeCoverPic(e){
        e.preventDefault();
        console.log('ooooooooo')
        let storage = firebase.storage();
        let file = e.target.files[0];
        let storageRef = storage.ref('pics/'+file.name);
    
        let pickedTripID = new URL(location.href).pathname.substr(1);
    
        storageRef.put(file).then((snapshot) => {
          console.log('Uploaded', file.name);
    
          storageRef.getDownloadURL().then(
            (url) => {
            console.log('download'+url);
    
            // localStorage.setItem('pic',url);
    
            // this.setState({
            //   AddStepPic: true,
            // });
    
            // document.getElementById('step-pic').src = url;
            // document.getElementById('set-cover-pic').backgroundColor = 'red';
      
            firebase.firestore().collection('trips').doc(pickedTripID)
            .update({
              coverPic: url
            })
    
            console.log(this.props.state.trip.coverPic)
    
          }).catch((error) => {
            console.log('download fail'+error.message)
          });
        });
    }
      
    likePlanStep(e){
        e.preventDefault();
        // for(let i=0; i<this.state.planSteps.length; i++){
        //     // document.getElementById(`plan-step-like`).style.cssText += 'pointer-events: none; background-color: rgb(188, 22, 22);'
        // }
        console.log(e.target.getAttribute('stepid'))

        firebase.firestore().collection('users').doc(this.props.state.userUid)
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

        firebase.firestore().collection('users').doc(this.props.state.userUid)
        .update({
           planLike: firebase.firestore.FieldValue.arrayRemove(e.target.getAttribute('stepid'))
        })
    }
    
    // likeTrackStep(e){
    //     e.preventDefault();
        // for(let i=0; i<this.state.planSteps.length; i++){
        //     console.log(document.getElementById(`plan-step-like`).getAttribute('stepid'))
        //     // document.getElementById(`plan-step-like`).style.cssText += 'pointer-events: none; background-color: rgb(188, 22, 22);'
        // }


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

    // } 
      
    
    render() {
        console.log(this.state)
        if(this.state.deletePickedTrip === true){
            return <Redirect to={"/m"+this.props.state.userUid}/>
        }

        // let cardAddPlan = null;
        // let cardAddTrack = null;
        // if(this.props.state.userUid === this.state.trip.authorUid && this.state.trip.addTrack === null){
        //     cardAddPlan = <div onClick={this.addPlan.bind(this)} id='card-add-plan'>+ Add a PLAN</div>;
        //     cardAddTrack= <div onClick={this.addTrack.bind(this)} id='card-add-track'>+ Add a TRACK</div>; 
        // }

        //   ------      plan step box      ------       //
        let tripPlanStep = null;
        let renderPlanSteps =null;
        let tripPlanStepAddBtn =(
                <div className='trip-step-add-btn-box'>
                    <div className='trip-plan-step-no-add-btn'></div>
                </div>
            )

       
        // console.log(this.state.planLikeSteps)
        // if(this.state.trip.addPlan ===true){

            if(this.state.isauthor ===true 
                // || this.state.isEditor ===true
            ){
                tripPlanStepAddBtn =(<div className='trip-step-add-btn-box'>
                                        <div onClick={this.showAddPlanStep.bind(this)} className='trip-step-add-btn'>+</div>
                                    </div>)
                if(this.state.planStepIDs){
                    renderPlanSteps = this.state.planSteps.map((n, index)=>{
                        let planStepLike = null;
                        if(this.props.state.userUid){
                            planStepLike =  (<div onClick={this.likePlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='plan-step-like'>
                                                <img className='plan-step-like-icon' stepid={this.state.planStepIDs[index]} src='./imgs/blueheart.svg'/>
                                                <p stepid={this.state.planStepIDs[index]}>Like</p>
                                            </div>)

                        if(this.state.planLikeSteps){
                            for(let k=0; k<this.state.planLikeSteps[0].length; k++){
                                if(this.state.planLikeSteps[0][k] === this.state.planStepIDs[index]){
                                    planStepLike = (<div onClick={this.unLikePlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='plan-step-like'>
                                                        <img className='plan-step-like-icon' stepid={this.state.planStepIDs[index]} src='./imgs/redheart.svg'/>
                                                        <p stepid={this.state.planStepIDs[index]}>Like</p>
                                                    </div>)
                                }
                            }
                        }

                        }
                        
                        
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
                                            {planStepLike}
                                            <div onClick={this.showEditPlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='plan-step-like' id='trip-plan-step-edit'>
                                                <img className='plan-step-edit-icon' stepid={this.state.planStepIDs[index]} src='./imgs/editpen1.svg'/>
                                                <p stepid={this.state.planStepIDs[index]}>Edit step</p>
                                            </div>
                                            <div onClick={this.deletePlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='trip-step-edit' id='trip-plan-step-delete'>
                                                <img className='plan-step-delete-icon' stepid={this.state.planStepIDs[index]} src='./imgs/bluebin.svg'/>
                                                {/* <p>Edit step</p> */}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                    }) 

                }
                
                
                tripPlanStep =(
                    <div id='trip-plan-step'>
                        {/* <div className='trip-time-line'>-</div> */}
                        <div className='trip-cover'>
                            {/* <div className='trip-category'>PLAN</div> */}
                            <div className='trip-title'>{this.state.trip.tripName}</div>
                            <div className='trip-summary'>{this.state.trip.tripSum}</div>
                            <img className='trip-cover-img' src={this.state.trip.coverPic}></img>
                            <label className='upload-pic-label'>
                                <input onChange={this.changeCoverPic.bind(this)} className='trip-cover-change-pic' id="uploadPicInput" type="file"/>
                                <img className='upload-pic-icon' src='./imgs/bluecamera.svg'/>
                            </label>
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
                                    <div className='trip-start-end-p'>Trip Start</div>  
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
                            </li>*/}
                            {tripPlanStepAddBtn}
                            {/* <li className='trip-step-add-last'>
                                <div className='trip-step-add-last-btn'>+</div> 
                                <div className='trip-step-add-last-p'>Add a step</div>   
                            </li> */}
                            <div onClick={this.showAddPlanStep.bind(this)} className='trip-step-add-last-box'>
                                <div className='trip-step-add-last-decoration'></div>
                                <div className='trip-step-add-last-line'>
                                    <div className='trip-step-add-last-btn'>+</div>
                                    <div className='trip-step-add-last-p'>Add a step</div>
                                </div>
                            </div>
                            <li className='author-trip-end-box'>
                                <div className='author-trip-end-box-line'/>
                                <div className='trip-end'>
                                    <img className='trip-start-end-icon' src='./imgs/flagc-256.png'></img>
                                    <div className='trip-start-end-p'>Trip Finish</div> 
                                    <div className='trip-start-end-date'>{this.state.trip.tripEnd}</div>      
                                </div>    
                            </li> 
                        </ul> 
                    </div>)
            }else{
                if(this.state.planStepIDs){
                    renderPlanSteps = this.state.planSteps.map((n, index)=>{
                        let planStepLike = null;
                        if(this.props.state.userUid){
                            planStepLike =  (<div onClick={this.likePlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='plan-step-like'>
                                                <img className='plan-step-like-icon' stepid={this.state.planStepIDs[index]} src='./imgs/blueheart.svg'/>
                                                <p stepid={this.state.planStepIDs[index]}>Like</p>
                                            </div>)

                        if(this.state.planLikeSteps){
                            for(let k=0; k<this.state.planLikeSteps[0].length; k++){
                                if(this.state.planLikeSteps[0][k] === this.state.planStepIDs[index]){
                                    planStepLike = (<div onClick={this.unLikePlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='plan-step-like'>
                                                        <img className='plan-step-like-icon' stepid={this.state.planStepIDs[index]} src='./imgs/redheart.svg'/>
                                                        <p stepid={this.state.planStepIDs[index]}>Like</p>
                                                    </div>)
                                }
                            }
                        }

                        }

                       
                        return  <li className='trip-btn-step-box' key={this.state.planStepIDs[index]}>    
                                    {tripPlanStepAddBtn}
                                    <div className='trip-step'>
                                        <div className='trip-step-name'>{n.stepName}</div>
                                        <div className='trip-step-date'>{n.stepArrDate}</div>
                                        <div className='trip-step-time'>{n.stepArrTime}</div>
                                        <div className='trip-step-story'>{n.stepStory}</div>
                                        <img className='trip-step-pic'  src={n.stepPic}/>
                                        <div className='trip-step-btn'>
                                            {planStepLike}
                                            {/* <div onClick={this.showEditPlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='trip-step-edit' id='trip-plan-step-edit'>Edit step</div>
                                            <div onClick={this.deletePlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='trip-step-edit' id='trip-plan-step-delete'>delete</div> */}
                                        </div>
                                    </div>
                                </li>
                    })  
                }
                
                

                tripPlanStep =(
                    <div id='trip-plan-step'>
                        <div className='trip-cover'>
                            <div className='trip-title'>{this.state.trip.tripName}</div>
                            <div className='trip-summary'>{this.state.trip.tripSum}</div>
                            <img className='trip-cover-img' src={this.state.trip.coverPic}></img>
                        </div>    
                        <div className='trip-details'>
                            <div className='trip-detail-like'> {this.state.trip.planLike} likes</div>
                            <div className='trip-detail-step'> {this.state.planSteps.length} steps</div>
                        </div>
                        <ul className='trip-steps-box'>
                            <li>
                                <div className='trip-start'>
                                    <img className='trip-start-end-icon' src='./imgs/home.png'></img> 
                                    <div className='trip-start-end-p'>Trip Start</div>  
                                    <div className='trip-start-end-date'>{this.state.trip.tripStart}</div> 
                                </div>
                            </li>
                            {renderPlanSteps}

                            <li className='trip-end-box'>
                                <div className='trip-end'>
                                    <img className='trip-start-end-icon' src='./imgs/flagc-256.png'></img>
                                    <div className='trip-start-end-p'>Trip Finish</div> 
                                    <div className='trip-start-end-date'>{this.state.trip.tripEnd}</div>      
                                </div>    
                            </li> 
                        </ul> 
                    </div>)
            }    
        // }
        
        //   ------      track step box      ------       //
        // let tripTrackStep = null;
        // let renderTrackSteps = null;
        // let tripTrackStepAddBtn =<div>o</div>;

        // if(this.state.trip.addTrack ===true){
        //     if(this.state.isauthor ===true){
        //         tripTrackStepAddBtn = <div onClick={this.showAddTrackStep.bind(this)} className='trip-step-add-btn'>+</div>

        //         renderTrackSteps = this.state.trackSteps.map((n, index)=>{
        //             return  <li className='trip-btn-step-box' key={this.state.trackStepIDs[index]}>    
        //                         {tripTrackStepAddBtn}
        //                         <div className='trip-step'>
        //                             <div className='trip-step-name'>{n.stepName}</div>
        //                             <div className='trip-step-date'>{n.stepArrDate}</div>
        //                             <div className='trip-step-time'>{n.stepArrTime}</div>
        //                             <div className='trip-step-story'>{n.stepStory}</div>
        //                             <img className='trip-step-pic'  src={n.stepPic}/>
        //                             <div className='trip-step-btn'>
        //                                 <div onClick={this.likeTrackStep.bind(this)} stepid={this.state.trackStepIDs[index]} className='trip-step-like'>Like</div>
        //                                 <div onClick={this.showEditTrackStep.bind(this)} stepid={this.state.trackStepIDs[index]} className='trip-step-edit' id='trip-track-step-edit'>Edit step</div>
        //                                 <div onClick={this.deleteTrackStep.bind(this)} stepid={this.state.trackStepIDs[index]} className='trip-step-edit' id='trip-track-step-delete'>delete</div>
        //                             </div>
        //                         </div>
        //                     </li>
        //         })

        //         tripTrackStep =(<div id='trip-track-step'>
        //                         <div className='trip-cover'>
        //                             <div className='trip-category'>TRACK</div>
                                   
                             
        //                         </div>    
        //                         <div className='trip-details'>
        //                             <div className='trip-detail-like'> 5 likes</div>
        //                             <div className='trip-detail-step'> {this.state.trackSteps.length} steps</div>
        //                         </div>
        //                         <ul className='trip-steps-box'>
        //                             <li>
        //                                 <div className='trip-start'>
        //                                     <img className='trip-start-end-icon' src='./imgs/home.png'></img> 
        //                                     <div className='trip-start-end-p'>Start</div>  
        //                                     <div className='trip-start-end-date'>{this.state.trip.tripStart}</div> 
        //                                 </div>
        //                             </li>
        //                             {renderTrackSteps}
        //                             <li>    
        //                                 {tripTrackStepAddBtn}
        //                             </li>
        //                             <li className='trip-step-add-last'>
        //                                 <div className='trip-step-add-last-btn'>+</div> 
        //                                 <div className='trip-step-add-last-p'>Add a step</div>   
        //                             </li>
        //                             <li className='trip-end'>
        //                                 <img className='trip-start-end-icon' src='./imgs/flag.png'></img>
        //                                 <div className='trip-start-end-p'>Finish</div> 
        //                                 <div className='trip-start-end-date'>{this.state.trip.tripEnd}</div>      
        //                             </li> 
        //                         </ul> 
        //                     </div> )
        //     }else{
        //         renderTrackSteps = this.state.trackSteps.map((n, index)=>{
        //             return  <li className='trip-btn-step-box' key={this.state.trackStepIDs[index]}>    
        //                         {tripTrackStepAddBtn}
        //                         <div className='trip-step'>
        //                             <div className='trip-step-name'>{n.stepName}</div>
        //                             <div className='trip-step-date'>{n.stepArrDate}</div>
        //                             <div className='trip-step-time'>{n.stepArrTime}</div>
        //                             <div className='trip-step-story'>{n.stepStory}</div>
        //                             <img className='trip-step-pic'  src={n.stepPic}/>
        //                             <div className='trip-step-like'>Like</div>
        //                         </div>
        //                     </li>
        //         })
        //         tripTrackStep =(<div id='trip-track-step'>
        //                         <div className='trip-cover'>
        //                             <div className='trip-category'>TRACK</div>
        //                             {/* <div className='trip-title'>{this.state.trip.tripName}</div>
        //                             <div className='trip-summary'>{this.state.trip.tripSum}</div> */}
                                
        //                         </div>    
        //                         <div className='trip-details'>
        //                             <div className='trip-detail-like'> 5 likes</div>
        //                             <div className='trip-detail-step'> {this.state.trackSteps.length} steps</div>
        //                         </div>
        //                         <ul className='trip-steps-box'>
        //                             <li>
        //                                 <div className='trip-start'>
        //                                     <img className='trip-start-end-icon' src='./imgs/home.png'></img> 
        //                                     <div className='trip-start-end-p'>Start</div>  
        //                                     <div className='trip-start-end-date'>{this.state.trip.tripStart}</div> 
        //                                 </div>
        //                             </li>
        //                             {renderTrackSteps}
        //                             {tripTrackStepAddBtn}
                                    
        //                             <li className='trip-end'>
        //                                 <img className='trip-start-end-icon' src='./imgs/flag.png'></img>
        //                                 <div className='trip-start-end-p'>Finish</div> 
        //                                 <div className='trip-start-end-date'>{this.state.trip.tripEnd}</div>      
        //                             </li> 
        //                         </ul> 
        //                     </div> )
        //     }   
        // }


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

        if(this.state.trip.createTime){
            console.log('gooooooooo')
            document.getElementById(`editTripStart`).value = this.state.trip.tripStart;
            document.getElementById(`editTripEnd`).value = this.state.trip.tripEnd;
        }
        if(this.state.editTripStart && this.state.trip.tripStart !== this.state.editTripStart){
            document.getElementById(`editTripStart`).value = this.state.editTripStart;
        }
        if(this.state.editTripEnd && this.state.trip.tripEnd !== this.state.editTripEnd){
            document.getElementById(`editTripEnd`).value = this.state.editTripEnd;
        }
        let editTripSubmit = <div id='add-trip-submit'>Save changes</div>
        if(this.state.editTripName || this.state.editTripStart){
            editTripSubmit = <div onClick={this.editTrip.bind(this)} id='add-trip-submit-approve'>Save changes</div>
          }
        
        let addEditorPop = null;
        // console.log(this.state.addEditor)
        if(this.state.addEditor ===true){
            addEditorPop = <form onSubmit={this.addEditor.bind(this)}>
                <input onChange={this.updateInput.bind(this)} id='add-editor-input' placeholder='by email'/>
            </form>     
        }

        return  <div className='plan-track-page'>
                    <Map/>

                    <div className='trip-header'>
                        <img className='trip-header-img' src={this.state.authorPic}></img>
                        <div className='trip-header-name'>{this.state.authorName}</div>
                       
                        {/* <div onClick={this.addPlan.bind(this)} id='card-add-plan'>Plan</div> */}
                        {/* {cardAddPlan} */}
                        {/* <div onClick={this.addTrack.bind(this)} id='card-add-track'>Track</div>  */}
                        {/* {cardAddTrack} */}
                        <div onClick={this.showEditTrip.bind(this)} id='trip-header-set'>
                            <img className='trip-header-set-icon' src='./imgs/whiteset.svg'/>
                            <p>Trip settings</p>
                        </div>
                        {/* <div onClick={this.showAddEditor.bind(this)} id='trip-header-coedit'>invite</div>
                        {addEditorPop} */}
                    </div>
                    {/* <div className='trip-name-div'>
                        <div className='trip-title'>{this.state.trip.tripName}</div>
                        <div className='trip-summary'>{this.state.trip.tripSum}</div>
                    </div> */}
                    <div className='plan-track-content'>
                        {/* {cardAddPlan} */}
                        {tripPlanStep}
                        {/* {cardAddTrack} */}
                        {/* {tripTrackStep} */}
    
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
                            <input type='text' className='each-tripName' id='editTripName' placeholder='e.g. Europe Train Tour'
                                    onChange={this.updateInput.bind(this)}/>
                            <div className='add-sum'>Trip summary</div>
                            <input type='text' className='each-tripSum' id='edit-tripSum' placeholder='e.g. First Solo Trip With Luck'
                                    onChange={this.updateInput.bind(this)}/>        
                            <div className='add-when'>When?</div>
                            <div className='add-start'>Start date</div>
                            <input type='date' className='each-tripStart' id='editTripStart' 
                                    onChange={this.updateInput.bind(this)}/>   
                            <div className='add-end'>End date</div>
                            <input type='date' className='each-tripEnd' id='editTripEnd'  min={this.state.editTripStart}
                                    onChange={this.updateInput.bind(this)}/>
                            {editTripSubmit}
                            <div onClick={this.deleteTrip.bind(this)} id='delete-trip-submit'>delete</div>
                        </div>
                    </div>   

                    
                    <Step state={this.state}/>
                </div> 
        }
    }  

   export default TripID;