import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import "../../css/eachTrip.css";

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import Map from "../map";
import TripHeaderAuthorInfo from "./tripHeaderAuthorInfo";
import LikeStep from "./likeStep";
import AddStepPic from "./addStepPic";


let map;
let pickedTripID = new URL(location.href).pathname.substr(1);

class TripID extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            trip:[],
            planSteps:[],
            planStepIDs:[],
          
            editTripSum: '',
            editTripEnd: '',
            editStepPic:'',

            addPlanStepPlace:'',
            addPlanStepName: '',
            addPlanStepArriveDate: '',
			addPlanStepArriveTime: '',
			addPlanStepDepartDate: '',
			addPlanStepDepartTime: '',
            addPlanStepStory: '',  
        };        
    }

    componentDidMount() {
        mapboxgl.accessToken =
		"pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig";
		map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/satellite-v9",
			zoom: 1,
            center: [30, 50],
            // transition: {
            //     "duration": 300,
            //     "delay": 0.5
            // }
		});
		
		let geojson = {
			type: "FeatureCollection",
			features: [],
        };
        
        let pickedTripID = new URL(location.href).pathname.substr(1);

        firebase
        .firestore()
        .collection('trips')
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
        
        firebase
        .firestore()
        .collection('trips')
        .doc(pickedTripID)
        .collection('plan')
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

        firebase
        .firestore()
		.collection("trips")
		.doc(pickedTripID)
		.collection("plan")
		.orderBy("stepArrDate", "asc")
		.onSnapshot((querySnapshot) => {
			let data = [];
			querySnapshot.docChanges().forEach((doc) => {
				if (doc.type === "added") {
					data.push(doc.doc.data());
				}
			});

			this.setState(
			{
				planStepNewPin: data,
			},
			() => {
				geojson.features = [];
				let arr = this.state.planStepNewPin;
				for (let i = 0; i < arr.length; i++) {
					let item = {
						type: "Feature",
						geometry: {
						type: "Point",
						coordinates: [arr[i].longitude, arr[i].latitude],
						},
					};
				geojson.features.push(item);
				}

				geojson.features.forEach(function (marker) {
					let el = document.createElement("div");
					el.className = "stepPoint";
					el.id = marker.geometry.coordinates[1];

					el.style.backgroundColor = "white";
					el.style.width = "16px";
					el.style.height = "16px";
					el.style.border = "5px #CC3E55 solid";
					el.style.borderRadius = "50%";

					if (marker.geometry.coordinates[0]) {
						new mapboxgl.Marker(el)
						.setLngLat(marker.geometry.coordinates)
						.addTo(map);
					}
				});
			}
			);
		});
    }

    updateInput(e){
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    //     ----------------  Edit & Delete Trip  ----------------     //    
    showEditTrip(e){
        e.preventDefault();
        this.setState({
            showEditTripPage: true
        });
        let pickedTripID = new URL(location.href).pathname.substr(1);

        firebase
        .firestore()
        .collection('trips')
        .doc(pickedTripID)
        .get().then(
            doc => {
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
        let pickedTripID = new URL(location.href).pathname.substr(1);

        firebase
        .firestore()
        .collection('trips')
        .doc(pickedTripID)
        .update({
            authorUid: user.uid,
            tripName: this.state.editTripName,
            tripSum: this.state.editTripSum,
            tripStart: this.state.editTripStart,
            tripEnd: this.state.editTripEnd,
        })

        // console.log('db edit trip ok'); 
        this.setState({
            showEditTripPage: null,
        }); 
    }

    deleteTrip(e){
        e.preventDefault(); 
        // alert('Warning! all the steps including text, photos, locations for this trip will be deleted FOREVER!')
        let pickedTripID = new URL(location.href).pathname.substr(1);

        firebase
        .firestore()
        .collection('trips')
        .doc(pickedTripID)
        .delete()
        .then(() =>{
            // console.log('delete trip ok')
        })
        this.setState({
            deletePickedTrip:true
        })
    }

    //     ----------------  Search & Pick Place  ----------------     //    
    updateAddPlaceInput(e) {
		if (document.getElementById("newestTag")) {
            let node = document.getElementById("newestTag");
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
		}

		this.setState({
			placeText: true,
			[e.target.id]: e.target.value,
		});

		// let placeSearchText;
		// if (this.state.addPlanStepPlace) {
		// 	placeSearchText = this.state.addPlanStepPlace;
		// }

		// if (this.state.editPlanStepPlace) {
		// 	placeSearchText = this.state.editPlanStepPlace;
		// }

		fetch(
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.addPlanStepPlace}.json?access_token=pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig&limit=8`
		)
		.then((res) => res.json())
		.then(
			(result) => {
				let data = [];
				data.push(result);

				this.setState({
					searchPlaceResult: data[0].features,
				});
			},
			(error) => {
				console.log(error.message);
			}
		);
    }

    updateEditPlaceInput(e) {
		if (document.getElementById("newestTag")) {
            let node = document.getElementById("newestTag");
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
		}

		this.setState({
			placeText: true,
			[e.target.id]: e.target.value,
		});

		fetch(
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.editPlanStepPlace}.json?access_token=pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig&limit=8`
		)
		.then((res) => res.json())
		.then(
			(result) => {
				let data = [];
				data.push(result);

				this.setState({
					searchPlaceResult: data[0].features,
				});
			},
			(error) => {
				console.log(error.message);
			}
		);
    }

    pickStepPlace(e) {
		e.preventDefault();

		map.flyTo({
		center: [
			e.target.getAttribute("longitude"),
			e.target.getAttribute("latitude"),
		],
		zoom: 16,
		essential: true, 
		});

		localStorage.setItem("longitude", e.target.getAttribute("longitude"));
		localStorage.setItem("latitude", e.target.getAttribute("latitude"));

		let geojson = {
		type: "FeatureCollection",
		features: [
			{
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [
				e.target.getAttribute("longitude"),
				e.target.getAttribute("latitude"),
				],
			},
			},
		],
		};

		geojson.features.forEach(function (marker) {
		var el = document.createElement("img");
		el.className = "marker";
		el.id = "newestTag";

		el.src = "./imgs/redbgmaptag.svg";
		el.style.zIndex = "2";
		el.style.width = "54px";
		el.style.height = "54px";
		el.style.borderRadius = "50%";

		if (marker.geometry.coordinates[0]) {
			new mapboxgl.Marker(el)
			.setLngLat(marker.geometry.coordinates)
			.addTo(map);
		}
		});

		if (this.state.pickedAdd === "plan") {
			this.setState({
				addPlanStepPlace: e.target.getAttribute("place"),
				addPlanStepName: e.target.getAttribute("place"),
			});
		}

		if (this.state.pickedEdit === "plan") {
			this.setState({
				editPlanStepPlace: e.target.getAttribute("place"),
				editPlanStepName: e.target.getAttribute("place"),
			});
		}
		
		this.setState({
			hideSearchPlacePage: true,
		});
	}

    //     ----------------  Add Step  ----------------     //   
    showAddPlanStep(e){
        e.preventDefault();
        this.setState({
            pickedAdd:'plan',
            addPlanStepPlace:'',
            addPlanStepName:'',
        })
        localStorage.removeItem('pic');  
    }  
    
    hideAddPlanStep(e){
        e.preventDefault();
        this.setState({
            pickedAdd: null,
        })
    }  
    
    addPlanStep(e) {
        e.preventDefault();
        let pickedTripID = new URL(location.href).pathname.substr(1);

		let stepPic = null;
		if (localStorage.getItem("pic")) {
			stepPic = localStorage.getItem("pic");
		}

		let longitude = "";
		let latitude = "";
		if (localStorage.getItem("longitude")) {
			longitude = localStorage.getItem("longitude");
			latitude = localStorage.getItem("latitude");
		}

        firebase
        .firestore()
		.collection("trips")
		.doc(pickedTripID)
		.collection("plan")
		.doc()
		.set({
			location: this.state.addPlanStepPlace,
			stepName: this.state.addPlanStepName,
			stepArrDate: this.state.addPlanStepArriveDate,
			stepArrTime: this.state.addPlanStepArriveTime,
			stepDepDate: this.state.addPlanStepDepartDate,
			stepDepTime: this.state.addPlanStepDepartTime,
			stepStory: this.state.addPlanStepStory,
			stepPic: stepPic,
			longitude: longitude,
			latitude: latitude,
		});
		// console.log("db plan step ok");
		localStorage.removeItem("pic");
		localStorage.removeItem("longitude");
        localStorage.removeItem("latitude");
        
		this.setState({
			addPlanStepPlace: '',
			addPlanStepName: '',
            addPlanStepStory: '',
            pickedAdd: null,
		});

		if (this.state.addStepPic) {
			this.setState({
				addStepPic: null,
			});
		}

		let node = document.getElementById("newestTag");
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
    }

    //     ----------------  Edit & Delete Step  ----------------     // 
    showEditPlanStep(e){
        e.preventDefault();

        this.setState({
            pickedStepID: e.target.getAttribute('stepid'),
            pickedEdit:'plan',
        },() =>console.log('pickedStep ok'))

        let pickedTripID = new URL(location.href).pathname.substr(1);

        firebase
        .firestore()
        .collection('trips')
        .doc(pickedTripID)
        .collection('plan')
        .doc(e.target.getAttribute('stepid'))
        .onSnapshot(
            doc => {
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
    
    editPlanStep(e) {
        e.preventDefault();
        let pickedTripID = new URL(location.href).pathname.substr(1);
        
		let longitude;
		let latitude;

        firebase
        .firestore()
		.collection("trips")
		.doc(pickedTripID)
		.collection("plan")
		.doc(this.state.pickedStepID)
		.get()
		.then((querySnapshot) => {
			longitude = querySnapshot.data().longitude;
			latitude = querySnapshot.data().latitude;

			if (document.getElementById(querySnapshot.data().latitude)) {
			let node = document.getElementById(querySnapshot.data().latitude);
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
			}

			if (localStorage.getItem("longitude")) {
				longitude = localStorage.getItem("longitude");
				latitude = localStorage.getItem("latitude");
			}

			firebase.firestore()
			.collection("trips")
			.doc(pickedTripID)
			.collection("plan")
			.doc(this.state.pickedStepID)
			.update({
				location: this.state.editPlanStepPlace,
				stepName: this.state.editPlanStepName,
				stepArrDate: this.state.editPlanStepArriveDate,
				stepArrTime: this.state.editPlanStepArriveTime,
				stepDepDate: this.state.editPlanStepDepartDate,
				stepDepTime: this.state.editPlanStepDepartTime,
				stepStory: this.state.editPlanStepStory,
				stepPic:  this.state.editStepPic,
				longitude: longitude,
				latitude: latitude,
			});
			console.log("db edit plan step ok");

			let el = document.createElement("div");
			el.className = "marker";
			el.id = latitude;

			el.style.backgroundColor = "#CC3E55";
			el.style.width = "24px";
			el.style.height = "24px";
			el.style.border = "3px white solid";
			el.style.borderRadius = "50%";

			new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map);

			localStorage.removeItem("longitude");
			localStorage.removeItem("latitude");

			this.setState({
                editPlanStepPlace:'',
                editPlanStepName:'',
                editStepPic:'',
                addPlanStepPlace:'',
                addPlanStepName:'',
                AddStepPic: null,
                pickedEdit: null,
			});
		
			if (document.getElementById("newestTag")) {
			let node = document.getElementById("newestTag");
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
			}
		});
    }

    deletePlanStep(e){
        e.preventDefault();
        let pickedTripID = new URL(location.href).pathname.substr(1);
        let pickedStepID = e.target.getAttribute('stepid');

        firebase.firestore()
        .collection('trips').doc(pickedTripID)
        .collection('plan').doc(pickedStepID)
        .onSnapshot(doc =>{
            let node1 = document.getElementById(doc.data().latitude);
            if(node1){
                if(node1.parentNode){
                    node1.parentNode.removeChild(node1);
                }
            }
         
            firebase.firestore()
            .collection('trips').doc(pickedTripID)
            .collection('plan').doc(pickedStepID)
            .delete().then(() =>{
                console.log('delete plan step ok')
            }).catch((err) =>{
                console.log(err.message)
            })
        })
        this.setState({
            addPlanStepPlace:'',
            addPlanStepName:'',
        });
    } 


    //     ----------------  Other Features  ----------------     // 
    changeCoverPic(e){
        e.preventDefault();
        let storage = firebase.storage();
        let file = e.target.files[0];
        let storageRef = storage.ref('pics/'+file.name);
    
        storageRef.put(file).then((snapshot) => {
        //   console.log('Uploaded', file.name);
    
          storageRef.getDownloadURL().then(
            (url) => {
            // console.log('download'+url);
            let pickedTripID = new URL(location.href).pathname.substr(1);

            firebase.firestore().collection('trips').doc(pickedTripID)
            .update({
              coverPic: url
            })
    
          }).catch((error) => {
            console.log('download fail'+error.message)
          });
        });
    }

	editPlanStepPic(e) {
		e.preventDefault();
		let storage = firebase.storage();
		let file = e.target.files[0];
		let storageRef = storage.ref("pics/" + file.name);

		storageRef.put(file).then((snapshot) => {
			// console.log("Uploaded", file.name);

			storageRef
			.getDownloadURL()
			.then((url) => {
				// console.log("download" + url);

				this.setState({
                    addStepPic: true,
                    editStepPic: url,
				});
			})
			.catch((error) => {
				console.log("download fail" + error.message);
			});
		});
    }
    
    // showAddEditor(e){
    //     e.preventDefault();
    //     this.setState({
    //         addEditor: true
    //     })
    // } 
    // addEditor(e){
    //     e.preventDefault();
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
    

    render() {
        // console.log(this.state)
        // console.log(this.props.state);
        
        if(this.state.deletePickedTrip === true){
            return <Redirect to={"/m"+this.props.state.userUid}/>
        }

    //     ----------------  Step Box  ----------------     //  
        let tripPlanStep = null;
        let renderPlanSteps =null;
        let stepLastAddBtn = null;

        let tripPlanStepAddBtn =(
                <div className='trip-step-add-btn-box'>
                    <div className='trip-plan-step-no-add-btn'></div>
                </div>
            )

        let tripTotalPicNumber= <div className='trip-detail-number'>0</div>
        if(this.state.planStepPics && this.state.planStepPics[0]!== null ){
            tripTotalPicNumber= <div className='trip-detail-number'>{this.state.planStepPics.length}</div>
        }

        let eachTripCoverInfo;
        let eachTripDetails;
        let eachTripStart;
        let eachTripEnd;

        if(this.state.trip){
            eachTripCoverInfo =(
                <>
                <div className='trip-title'>{this.state.trip.tripName}</div>
                <div className='trip-summary'>{this.state.trip.tripSum}</div>
                <img className='trip-cover-img' src={this.state.trip.coverPic}></img>
                </>
            )
            
            eachTripDetails =(
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
            )

            eachTripStart =(
                <li>
                    <div className='trip-start'>
                        <img className='trip-start-icon' src='./imgs/home.svg'></img> 
                        <div className='trip-start-end-p'>Trip Start</div>  
                        <div className='trip-start-end-date'>{this.state.trip.tripStart}</div> 
                    </div>
                </li>
            )

            eachTripEnd =(
                <>
                    <img className='trip-end-icon' src='./imgs/flagc-256.png'></img>
                    <div className='trip-start-end-p'>Trip Finish</div> 
                    <div className='trip-start-end-date'>{this.state.trip.tripEnd}</div>      
                </>    
            )
        } 

        if(this.state.isauthor 
            // || this.state.isEditor
        ){
            tripPlanStepAddBtn =(<div className='trip-step-add-btn-box'>
                                    <div onClick={this.showAddPlanStep.bind(this)} className='trip-step-add-btn'>+</div>
                                </div>)

            if(this.state.planStepIDs){
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
                                        <LikeStep state={this.state} stepid={this.state.planStepIDs[index]}/>
                                        <div onClick={this.showEditPlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='plan-step-like' id='trip-plan-step-edit'>
                                            <img className='plan-step-edit-icon' stepid={this.state.planStepIDs[index]} src='./imgs/editpen1.svg'/>
                                            <p stepid={this.state.planStepIDs[index]}>Edit step</p>
                                        </div>
                                        <div onClick={this.deletePlanStep.bind(this)} stepid={this.state.planStepIDs[index]} className='trip-step-edit' id='trip-plan-step-delete'>
                                            <img className='plan-step-delete-icon' stepid={this.state.planStepIDs[index]} src='./imgs/bluebin.svg'/>
                                        </div>
                                    </div>
                                </div>
                            </li>
                }) 
            }


            stepLastAddBtn =(
                <div className='step-last-add-btn-box'>
                    <div className='step-last-add-blue-btn-line' />
                    <div onClick={this.showAddPlanStep.bind(this)} className='step-last-add-blue-btn'>+</div>
                </div>
            )
            
            if(this.state.trip){
                tripPlanStep =(
                    <div id='trip-plan-step'>
                        <div className='trip-cover'>
                            {eachTripCoverInfo}
                            <label className='upload-pic-label'>
                                <input onChange={this.changeCoverPic.bind(this)} className='trip-cover-change-pic' id="uploadPicInput" type="file"/>
                                <img className='upload-pic-icon' src='./imgs/bluecamera.svg'/>
                            </label>
                        </div>    
                        {eachTripDetails}
                        <ul className='trip-steps-box'>
                            {eachTripStart}
                            {renderPlanSteps}
                            {/* {tripPlanStepAddBtn} */}
                            {stepLastAddBtn}
                    
                            <div onClick={this.showAddPlanStep.bind(this)} className='trip-step-add-last-box'>
                                <div className='trip-step-add-last-decoration'></div>
                                <div className='trip-step-add-last-line'>
                                    <div className='trip-step-add-last-btn'>+</div>
                                    <div className='trip-step-add-last-p'>Add a step</div>
                                </div>
                            </div>
                            <li className='author-trip-end-box'>
                                <div className='author-trip-end-box-line'/>
                                <div className='author-trip-end'>
                                    {eachTripEnd}
                                </div>
                            </li> 
                        </ul> 
                    </div>
                )
            }
            
        }else{
            if(this.state.planStepIDs){
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
                                    <LikeStep state={this.state} stepid={this.state.planStepIDs[index]}/>
                                    </div>
                                </div>
                            </li>
                })  
            }
            if(this.state.trip){
                tripPlanStep =(
                    <div id='trip-plan-step'>
                        <div className='trip-cover'>
                            {eachTripCoverInfo}
                        </div>    
                        {eachTripDetails}
                        <ul className='trip-steps-box'>
                            {eachTripStart}
                            {renderPlanSteps}

                            <li className='trip-end-box'>
                                <div className='trip-end'>
                                {eachTripEnd}
                                </div>
                            </li> 
                        </ul> 
                    </div>
                )
            }    
        }    

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

        let searchPlaceBox = null;
        let searchPlacePage = null;
        let key = 0;

        if (this.state.searchPlaceResult) {
        searchPlaceBox = this.state.searchPlaceResult.map((n) => {
            return (
            <div key={key++} className="search-plan-place-box">
                <div
                onClick={this.pickStepPlace.bind(this)}
                className="search-plan-placeName"
                place={n.text}
                longitude={n.center[0]}
                latitude={n.center[1]}
                >
                {n.place_name}
                </div>
            </div>
            );
        });
        }
    

        if (this.state.hideSearchPlacePage) {
            searchPlacePage = null;
        } else if (this.state.placeText) {
            searchPlacePage = <div id="search-plan-place-pop">{searchPlaceBox}</div>;
        }

        let editStepPic = null;
        if (this.state.addStepPic || this.state.withStepPic) {
        editStepPic = (
            <div>
            <img id="editStepPic" src={this.state.editStepPic}/>
            </div>
        );
        }

        let addStepSubmit = (
            <div className="add-step-submit" id="add-plan-step-submit">
                Add step
            </div>
        );
        if (this.state.addPlanStepPlace!=='' && this.state.addPlanStepArriveDate!=='') {
            addStepSubmit = (
                <div
                className="add-step-submit"
                onClick={this.addPlanStep.bind(this)}
                id="add-plan-step-submit-approve"
                >
                Add step
                </div>
            );
        }

        let editStepSubmit = (
        <div
            className="add-step-submit"
            onClick={this.editPlanStep.bind(this)}
            id="edit-plan-step-submit-approve"
        >
            Save changes
        </div>
        );
        if (this.state.editPlanStepPlace || this.state.editPlanStepArriveDate) {
        editStepSubmit = (
            <div
            className="add-step-submit"
            onClick={this.editPlanStep.bind(this)}
            id="edit-plan-step-submit-approve"
            >
            Save changes
            </div>
        );
        }
        
        let addPlanStepPage = null;
        if(this.state.pickedAdd === 'plan'){
            addPlanStepPage =(
                <div id="add-plan-step">
                    <div className="add-step-pop">
                        <div
                        onClick={this.hideAddPlanStep.bind(this)} 
                        className="add-step-close"
                        >
                        x
                        </div>
                        <div className="add-step-title">New step</div>
                        <div className="add-step-container">
                            <div className="add-step-p-box">
                                <div className="add-step-p">Location</div>
                                <div className="add-step-p">Step name</div>
                                <div className="add-step-p">Arrival</div>
                                <div className="add-step-p">Departure</div>
                                <div className="add-step-p">Your story</div>
                                <div className="add-step-p-photo">Add photo</div>
                            </div>
                            <div className="add-step-input-box">
                                <input
                                onChange={this.updateAddPlaceInput.bind(this)}
                                type="text"
                                className="add-step-place"
                                id="addPlanStepPlace"
                                value={this.state.addPlanStepPlace}
                                />
                                {searchPlacePage}
                                <input
                                type="text"
                                className="add-step-name"
                                id="addPlanStepName"
                                onChange={this.updateInput.bind(this)}
                                placeholder="e.g. Europe Train Tour"
                                value={this.state.addPlanStepName}
                                />
                                <input
                                type="date"
                                className="add-step-arrive-date"
                                id="addPlanStepArriveDate"
                                onChange={this.updateInput.bind(this)}
                                min={this.state.trip.tripStart}
                                max={this.state.trip.tripEnd}
                                />
                                <input
                                type="time"
                                name="time"
                                className="add-step-arrive-time"
                                id="addPlanStepArriveTime"
                                onChange={this.updateInput.bind(this)}
                                />
                                <input
                                type="date"
                                className="add-step-depart-date"
                                id="addPlanStepDepartDate"
                                onChange={this.updateInput.bind(this)}
                                min={this.state.addPlanStepArriveDate}
                                max={this.state.trip.tripEnd}
                                />
                                <input
                                type="time"
                                name="time"
                                className="add-step-depart-time"
                                id="addPlanStepDepartTime"
                                onChange={this.updateInput.bind(this)}
                                />
                                <textarea
                                className="add-step-story"
                                id="addPlanStepStory"
                                onChange={this.updateInput.bind(this)}
                                ></textarea>
                                <div className="add-step-pic-box">
                                <AddStepPic/>
                                </div>
                            </div>
                        </div>

                        {addStepSubmit}
                    </div>
                </div>
            )
        }

        let editPlanStepPage = null;
        if(this.state.pickedEdit === 'plan'){
            editPlanStepPage =(
                <div id="edit-plan-step">
                <div className="add-step-pop">
                <div
                    onClick={this.hideEditPlanStep.bind(this)} 
                    className="add-step-close"
                >
                    x
                </div>
                <div className="add-step-title">Edit step</div>
                <div className="add-step-container">
                    <div className="add-step-p-box">
                    <div className="add-step-p">Location</div>
                    <div className="add-step-p">Step name</div>
                    <div className="add-step-p">Arrival</div>
                    <div className="add-step-p">Departure</div>
                    <div className="add-step-p">Your story</div>
                    <div className="add-step-p-photo">Change photo</div>
                    </div>
                    <div className="add-step-input-box">
                    <input
                        onChange={this.updateEditPlaceInput.bind(this)}
                        type="text"
                        className="add-step-place"
                        id="editPlanStepPlace"
                        value={this.state.editPlanStepPlace}
                    />
                    {searchPlacePage}
                    <input
                        type="text"
                        onChange={this.updateInput.bind(this)}
                        className="add-step-name"
                        id="editPlanStepName"
                        placeholder="e.g. Europe Train Tour"
                        value={this.state.editPlanStepName}
                    />
                    <input
                        type="date"
                        className="add-step-arrive-date"
                        id="editPlanStepArriveDate"
                        onChange={this.updateInput.bind(this)}
                        min={this.state.trip.tripStart}
                        max={this.state.trip.tripEnd}
                        value={this.state.editPlanStepArriveDate}
                    />
                    <input
                        type="time"
                        className="add-step-arrive-time"
                        id="editPlanStepArriveTime"
                        onChange={this.updateInput.bind(this)}
                        value={this.state.editPlanStepArriveTime}
                    />
                    <input
                        type="date"
                        className="add-step-depart-date"
                        id="editPlanStepDepartDate"
                        onChange={this.updateInput.bind(this)}
                        min={this.state.editPlanStepArriveDate}
                        max={this.state.trip.tripEnd}
                        value={this.state.editPlanStepDepartDate}
                    />
                    <input
                        type="time"
                        className="add-step-depart-time"
                        id="editPlanStepDepartTime"
                        onChange={this.updateInput.bind(this)}
                        value={this.state.editPlanStepDepartTime}
                    />
                    <textarea
                        className="add-step-story"
                        id="editPlanStepStory"
                        onChange={this.updateInput.bind(this)}
                        value={this.state.editPlanStepStory}
                    />
                    <div className="add-step-pic-box">
                        {editStepPic}
                        <label className="step-pic-label">
                        <input
                            onChange={this.editPlanStepPic.bind(this)}
                            className="trip-cover-change-pic"
                            id="uploadPicInput"
                            type="file"
                        />
                        <img
                            className="step-upload-pic-icon"
                            src="./imgs/bluecamera.svg"
                        />
                        </label>
                    </div>
                    </div>
                </div>
                {editStepSubmit}
                </div>
            </div>
            )
            }

        return  <div className='plan-track-page'>
                    <Map/>

                    <div className='trip-header'>
                        <TripHeaderAuthorInfo/>
                        {tripHeaderSet}
                    
                        {/* <div onClick={this.showAddEditor.bind(this)} id='trip-header-coedit'>invite</div>
                        {addEditorPop} */}
                    </div>
    
                    <div className='plan-track-content'>
                        {tripPlanStep}
                    </div> 
                    
                    {editTripPage}

                    {addPlanStepPage}
		            {editPlanStepPage}
                </div> 
        }
    }  

   export default TripID;