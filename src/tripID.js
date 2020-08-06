import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './css/eachTrip.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import Step from "./AddStep";
import Map from "./Map";

let map;
let today = new Date().toJSON().slice(0,10);
let pickedTripID = new URL(location.href).pathname.substr(1);

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


            editTripSum: '',
            editTripEnd: '',
        };        
    }
    componentDidMount() {
        let user = firebase.auth().currentUser;
        let pickedTripID = new URL(location.href).pathname.substr(1);
        
        if(user){
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
                    // console.log(this.state.planLikeSteps)  
                }) 
            });
        }

        firebase.firestore().collection('trips')
        .doc(pickedTripID)
        .onSnapshot(querySnapshot => {
            this.setState({
                trip: querySnapshot.data(),
            }, () => {
                if(this.props.state.userUid === this.state.trip.authorUid){
                    this.setState({
                        isauthor: true
                    });
                }
                console.log(this.state.trip);

                let calTripStart= new Date(this.state.trip.tripStart);
                let calTripEnd = new Date(this.state.trip.tripEnd);
                let tripDays = parseInt(Math.abs(calTripStart - calTripEnd) / 1000 / 60 / 60 / 24);
                this.setState({
                    tripDays: tripDays
                });
            });

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
                if(doc.id === this.state.trip.authorUid){
                    this.setState({
                        authorName: doc.data().username,
                        authorPic:doc.data().profilePic
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
                if(doc.data().stepPic){
                    planStepPic.push(doc.data().stepPic); 
                }
            });
            this.setState({
                planSteps:data,
                planStepIDs: planStepID,
                planStepPics:planStepPic
            });
        })
    }

    updateInput(e){
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    showEditTrip(e){
        e.preventDefault();
        this.setState({
            showEditTripPage: true
        });

        firebase.firestore().collection('trips')
        .doc(pickedTripID)
        .get().then(
            doc => {
                console.log(doc.data());
                this.setState({
                    editTripName: doc.data().tripName,
                    editTripSum: doc.data().tripSum,
                    editTripStart: doc.data().tripStart,
                    editTripEnd: doc.data().tripEnd,
                })
            })
    }

    hideEditTrip(e){
        e.preventDefault();
        this.setState({
            showEditTripPage: null
        });
    }

    editTrip(e){
        e.preventDefault();
        let user = firebase.auth().currentUser;  

        firebase.firestore().collection('trips')
        .doc(pickedTripID)
        .update({
            authorUid: user.uid,
            tripName: this.state.editTripName,
            tripSum: this.state.editTripSum,
            tripStart: this.state.editTripStart,
            tripEnd: this.state.editTripEnd,
        })

        console.log('db edit trip ok'); 
        this.setState({
            showEditTripPage: null
        }); 
    }

    showAddPlanStep(e){
        e.preventDefault();
        this.setState({
            pickedAdd:'plan',
        })
        localStorage.removeItem('pic');  
    }  
    
    hideAddPlanStep(e){
        e.preventDefault();
        this.setState({
            pickedAdd: null,
        })
    }    

    showEditPlanStep(e){
        e.preventDefault();

        this.setState({
            pickedStepID: e.target.getAttribute('stepid'),
            pickedEdit:'plan',
        },() =>console.log(this.state.pickedStepID))

        firebase.firestore().collection('trips')
        .doc(pickedTripID).collection('plan').doc(e.target.getAttribute('stepid'))
        .onSnapshot(
            doc => {
                console.log(doc.data());
                this.setState({
                    editPlanStepPlace: doc.data().location,
                    editPlanStepName: doc.data().stepName,
                    editPlanStepArriveDate: doc.data().stepArrDate,
                    editPlanStepArriveTime: doc.data().stepArrTime,
                    editPlanStepDepartDate: doc.data().stepDepDate,
                    editPlanStepDepartTime: doc.data().stepDepTime,
                    editPlanStepStory: doc.data().stepStory,
                })
    
                if(doc.data().stepPic){
                    this.setState({
                        withStepPic: true,
                        editStepPic: doc.data().stepPic,
                    })
                    localStorage.setItem('pic',doc.data().stepPic)
                }
                localStorage.setItem('longitude',doc.data().longitude)
                localStorage.setItem('latitude',doc.data().latitude)
            })

            if(document.getElementById('newestTag')){
                let node = document.getElementById('newestTag');
                if(node.parentNode){
                    node.parentNode.removeChild(node);
                }
            }     
    }  

    hideEditPlanStep(e) {
		e.preventDefault();
		this.setState({
            pickedEdit: null,
        })
	}

    // updateEditStepPlaceInput(e) {
	// 	if (document.getElementById("newestTag")) {
	// 	let node = document.getElementById("newestTag");
	// 	if (node.parentNode) {
	// 		node.parentNode.removeChild(node);
	// 	}
	// 	}

	// 	this.setState({
	// 		placeText: true,
	// 		[e.target.id]: e.target.value,
	// 	});

	// 	// if(this.props.state.pickedAdd === 'plan'){
	// 	// 	this.setState({
	// 	// 		addPlanStepPlace: e.target.value,
	// 	// 	});
	// 	// }

	// 	// if(this.props.state.pickedEdit === 'plan'){
	// 	// 	this.setState({
	// 	// 		editPlanStepPlace: e.target.value,
	// 	// 	});
	// 	// }

	// 	let placeSearchText;
	// 	// if (this.state.addPlanStepPlace) {
	// 	// 	placeSearchText = this.state.addPlanStepPlace;
	// 	// }

	// 	if (this.state.editPlanStepPlace) {
	// 		placeSearchText = this.state.editPlanStepPlace;
	// 	}

	// 	fetch(
	// 	`https://api.mapbox.com/geocoding/v5/mapbox.places/${placeSearchText}.json?access_token=pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig&limit=8`
	// 	)
	// 	.then((res) => res.json())
	// 	.then(
	// 		(result) => {
	// 			let data = [];
	// 			data.push(result);

	// 			this.setState({
	// 				searchPlaceResult: data[0].features,
	// 			});
	// 		},
	// 		(error) => {
	// 			console.log(error.message);
	// 		}
	// 	);
	// }

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
    // showAddEditor(e){
    //     e.preventDefault();
    //     this.setState({
    //         addEditor: true
    //     })
    // } 
    // addEditor(e){
    //     e.preventDefault();
    //     console.log('yes');

    //     firebase.firestore().collection('users')
    //     .onSnapshot(querySnapshot => {
    //         querySnapshot.forEach(doc => {

    //             if(document.getElementById(`add-editor-input`).value === doc.data().email){
    //                 console.log(doc.data());

    //                 // this.setState({
    //                 //     searchUserName: doc.data().username,
    //                 //     searchUserUID: doc.id
    //                 // }); 
    //                 let pickedTripID = new URL(location.href).pathname.substr(1);
    //                 firebase.firestore().collection('trips')
    //                 .doc(pickedTripID)
    //                 .update({
    //                     editor: firebase.firestore.FieldValue.arrayUnion(doc.id)
    //                 })
    //                 console.log(doc.data().username);
    //             }else{
    //                 console.log('no this member exist')
    //             }    
    //         }) 
    //     });

    // }

    deletePlanStep(e){
        e.preventDefault();
        let pickedTripID = new URL(location.href).pathname.substr(1);
        let pickedStepID = e.target.getAttribute('stepid');

        firebase.firestore()
        .collection('trips').doc(pickedTripID)
        .collection('plan').doc(pickedStepID)
        .onSnapshot(doc =>{
            console.log(doc.data().latitude);
          
            let node1 = document.getElementById(doc.data().latitude);
            if(node1.parentNode){
                node1.parentNode.removeChild(node1);
            }
            console.log(pickedStepID)
            firebase.firestore()
            .collection('trips').doc(pickedTripID)
            .collection('plan').doc(pickedStepID)
            .delete().then(() =>{
                console.log('delete plan step ok')
                // location.reload();
            }).catch((err) =>{
                console.log(err.message)
            })
        })

        document.getElementById(`addPlanStepPlace`).value = '';
        document.getElementById('addPlanStepName').value = '';
    } 
   
    changeCoverPic(e){
        e.preventDefault();
        let storage = firebase.storage();
        let file = e.target.files[0];
        let storageRef = storage.ref('pics/'+file.name);
    
        storageRef.put(file).then((snapshot) => {
          console.log('Uploaded', file.name);
    
          storageRef.getDownloadURL().then(
            (url) => {
            console.log('download'+url);
      
            firebase.firestore().collection('trips').doc(pickedTripID)
            .update({
              coverPic: url
            })
    
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
      
    
    render() {
        console.log(this.state)
        
        if(this.state.deletePickedTrip === true){
            return <Redirect to={"/m"+this.props.state.userUid}/>
        }

        // if(this.state.trip.tripStart){
        //     let calTripStart= new Date(this.state.trip.tripStart);
        //     let calTripEnd = new Date(this.state.trip.tripEnd);
        //     let tripDays = parseInt(Math.abs(calTripStart - calTripEnd) / 1000 / 60 / 60 / 24);
        //     console.log(tripDays, 'days')
        // }

        //   ------      plan step box      ------       //
        let tripPlanStep = null;
        let renderPlanSteps =null;
        let tripPlanStepAddBtn =(
                <div className='trip-step-add-btn-box'>
                    <div className='trip-plan-step-no-add-btn'></div>
                </div>
            )

        
        let tripTotalPicNumber= <div className='trip-detail-number'>0</div>
        if(this.state.planStepPics && this.state.planStepPics[0]!== null ){
            tripTotalPicNumber= <div className='trip-detail-number'>{this.state.planStepPics.length}</div>
        }

       
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
                                        {/* <div className='trip-step-date'>
                                            <div className='trip-step-flag'>{n.stepArrDate}</div> */}
                                            <div className='trip-step-date'>{n.stepArrDate}</div>
                                            <div className='trip-step-time'>{n.stepArrTime}</div>
                                        {/* </div> */}
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
                
                if(this.state.trip){
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
                                <div className='trip-detail-box'>
                                    <img className='trip-detail-like' src='./imgs/white-heart.svg'/>
                                    <div className='trip-detail-number'> {this.state.trip.planLike}</div>
                                    <div className='trip-detail-p'>likes</div>
                                </div>
                                <div className='trip-detail-box'>
                                    <img className='trip-detail-calendar' src='./imgs/white-calendar.svg'/>
                                    <div className='trip-detail-number'> {this.state.tripDays}</div>
                                    <div className='trip-detail-p'>days</div>
                                </div>
                                {/* <div className='trip-detail-box'>
                                    <img className='trip-detail-earth' src='./imgs/white-earth.svg'/>
                                    <div className='trip-detail-number'> {this.state.trip.planLike}</div>
                                    <div className='trip-detail-p'>countries</div>
                                </div> */}
                                 <div className='trip-detail-box'>
                                    <img className='trip-detail-photo' src='./imgs/white-photo.svg'/>
                                    {tripTotalPicNumber}
                                    <div className='trip-detail-p'>photos</div>
                                </div>
                                <div className='trip-detail-box'>
                                    <img className='trip-detail-marker' src='./imgs/white-marker.svg'/>
                                    <div className='trip-detail-number'> {this.state.planSteps.length}</div>
                                    <div className='trip-detail-p'>steps</div>
                                </div>
                            </div>
                            <ul className='trip-steps-box'>
                                <li>
                                    <div className='trip-start'>
                                        <img className='trip-start-icon' src='./imgs/home.svg'></img> 
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
                        </div>
                    )
                }
                
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
                
                
                if(this.state.trip){
                    tripPlanStep =(
                        <div id='trip-plan-step'>
                            <div className='trip-cover'>
                                <div className='trip-title'>{this.state.trip.tripName}</div>
                                <div className='trip-summary'>{this.state.trip.tripSum}</div>
                                <img className='trip-cover-img' src={this.state.trip.coverPic}></img>
                            </div>    
                            <div className='trip-details'>
                                <div className='trip-detail-box'>
                                    <img className='trip-detail-like' src='./imgs/white-heart.svg'/>
                                    <div className='trip-detail-number'> {this.state.trip.planLike}</div>
                                    <div className='trip-detail-p'>likes</div>
                                </div>
                                <div className='trip-detail-box'>
                                    <img className='trip-detail-calendar' src='./imgs/white-calendar.svg'/>
                                    <div className='trip-detail-number'> {this.state.tripDays}</div>
                                    <div className='trip-detail-p'>days</div>
                                </div>
                                {/* <div className='trip-detail-box'>
                                    <img className='trip-detail-earth' src='./imgs/white-earth.svg'/>
                                    <div className='trip-detail-number'> {this.state.trip.planLike}</div>
                                    <div className='trip-detail-p'>countries</div>
                                </div> */}
                                 <div className='trip-detail-box'>
                                    <img className='trip-detail-photo' src='./imgs/white-photo.svg'/>
                                    {tripTotalPicNumber}
                                    <div className='trip-detail-p'>photos</div>
                                </div>
                                <div className='trip-detail-box'>
                                    <img className='trip-detail-marker' src='./imgs/white-marker.svg'/>
                                    <div className='trip-detail-number'> {this.state.planSteps.length}</div>
                                    <div className='trip-detail-p'>steps</div>
                                </div>
                            </div>
                            <ul className='trip-steps-box'>
                                <li>
                                    <div className='trip-start'>
                                        <img className='trip-start-icon' src='./imgs/home.svg'></img> 
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
                        </div>
                    )
                }
                
            }    
      
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

        let editTripSubmit = <div id='edit-trip-submit'>Save changes</div>
        if(this.state.editTripName || this.state.editTripStart || this.state.editTripEnd || this.state.editTripSum){
            editTripSubmit = <div onClick={this.editTrip.bind(this)} id='edit-trip-submit-approve'>Save changes</div>
          }
        
        // let addEditorPop = null;
        // // console.log(this.state.addEditor)
        // if(this.state.addEditor ===true){
        //     addEditorPop = <form onSubmit={this.addEditor.bind(this)}>
        //         <input onChange={this.updateInput.bind(this)} id='add-editor-input' placeholder='by email'/>
        //     </form>     
        // }

        let tripHeaderImg = (<div className='user-noimg'>
                                <img className='user-img-icon' src='./imgs/whiteprofile.svg'/>
                            </div>)
        if(this.state.authorPic){
            tripHeaderImg = <img className='trip-header-img' src={this.state.authorPic}/>
        }

        let tripHeaderName = null;
            if(this.state.trip){
                tripHeaderName = <Link to={"/m"+this.state.trip.authorUid}><div className='trip-header-name'>{this.state.authorName}</div></Link>
            }

        let tripHeaderSet = null;
        if(this.state.isauthor){
            tripHeaderSet =(
                <div onClick={this.showEditTrip.bind(this)} id='trip-header-set'>
                    <img className='trip-header-set-icon' src='./imgs/whiteset.svg'/>
                    <p>Trip settings</p>
                </div>
            )
        }

        let editTripPage = null;
        if(this.state.showEditTripPage){
            editTripPage = (
                <div id='edit-trip'>
                    <div className='add-pop'>
                        <div onClick={this.hideEditTrip.bind(this)} className='add-close'>x</div>
                        <div className='add-title'>Edit trip</div>
                        <div className='add-name'>Trip name</div>
                        <input type='text' className='each-tripName' id='editTripName' placeholder='e.g. Europe Train Tour'
                                onChange={this.updateInput.bind(this)} value={this.state.editTripName}/>
                        <div className='add-sum'>Trip summary</div>
                        <input type='text' className='each-tripSum' id='editTripSum' placeholder='e.g. First Solo Trip With Luck'
                                onChange={this.updateInput.bind(this)} value={this.state.editTripSum || ''} />        
                        <div className='add-when'>When?</div>
                        <div className='add-start'>Start date</div>
                        <input type='date' className='each-tripStart' id='editTripStart' 
                                onChange={this.updateInput.bind(this)} value={this.state.editTripStart}/>   
                        <div className='add-end'>End date</div>
                        <input type='date' className='each-tripEnd' id='editTripEnd'  min={this.state.editTripStart}
                                onChange={this.updateInput.bind(this)} value={this.state.editTripEnd || ''}/>
                        {editTripSubmit}
                        <div onClick={this.deleteTrip.bind(this)} id='delete-trip-submit'>Delete trip</div>
                    </div>
                </div>   
            )
        }
        return  <div className='plan-track-page'>
                    <Map/>

                    <div className='trip-header'>
                        {tripHeaderImg }
                        {tripHeaderName}
                        {tripHeaderSet}
                    
                        {/* <div onClick={this.showAddEditor.bind(this)} id='trip-header-coedit'>invite</div>
                        {addEditorPop} */}
                    </div>
    
                    <div className='plan-track-content'>
                        {tripPlanStep}
                    </div> 
                    
                    {editTripPage}

                    <Step state={this.state} hideAddPlanStep={this.hideAddPlanStep.bind(this)}  hideEditPlanStep={this.hideEditPlanStep.bind(this)} updateInput={this.updateInput.bind(this)}/>
                </div> 
        }
    }  

   export default TripID;