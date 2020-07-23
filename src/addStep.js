import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './eachTrip.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

class Step extends React.Component {
  constructor(props){
    super(props);
    this.state = {
     
    };    
  }

  componentDidMount(){
  //   function getLong() {
  //     var xhr = new XMLHttpRequest();
  //     xhr.open(
  //       "GET",
  //       "https://api.mapbox.com/geocoding/v5/mapbox.places/big%20ben%20london.json?access_token=pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig&limit=10"
  //     );

  //     xhr.onload = function() {
  //       var response = JSON.parse(this.responseText);
  //       console.log(response)
  //       // console.log(response.features[0].center[0],response.features[0].center[1]);
        
  //     };
  //     xhr.send();
  // }
  //   getLong();

  // mapboxgl.accessToken = 'pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig';
  // var map = new mapboxgl.Map({
  //     container: 'map',
  //     style: 'mapbox://styles/mapbox/streets-v11',
  //     zoom: 7,
  //     center: [122, 24.5]
  // });

    
    
  }

  addPlanStep(e){
    e.preventDefault();

    let pickedTripID = new URL(location.href).pathname.substr(1);

    let stepPic='';
    if(localStorage.getItem('pic')){
      stepPic= localStorage.getItem('pic');
    }
    console.log(stepPic)

    if (document.getElementById(`add-plan-step-place`).value &&
        document.getElementById(`add-plan-step-arrive-date`).value 
        // &&document.getElementById(`add-plan-step-arrive-time`).value 
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
          stepPic: stepPic,
          stepLike:0
        })
        console.log('db plan step ok');
        localStorage.removeItem('pic')  
        document.getElementById(`add-plan-step`).style.display ='none';

        document.getElementById(`add-plan-step-place`).value = '';
        document.getElementById('add-plan-step-name').value = '';
    } 
  }

  // addTrackStep(e){
  //   e.preventDefault();

  //   let pickedTripID = new URL(location.href).pathname.substr(1);

  //   let stepPic='';
  //   if(localStorage.getItem('pic')){
  //     stepPic= localStorage.getItem('pic');
  //   }
  //   console.log(stepPic)

  //   if (document.getElementById(`add-track-step-place`).value &&
  //       document.getElementById(`add-track-step-arrive-date`).value 
  //       // &&document.getElementById(`add-track-step-arrive-time`).value 
  //      ){
  //       document.getElementById(`add-track-step-submit`).style.backgroundColor = '#CC3E55';
  //       document.getElementById(`add-track-step-submit`).disabled = false;
      

  //     firebase.firestore().collection('trips').doc(pickedTripID)
  //     .collection('track').doc()
  //     .set({
  //       location: document.getElementById(`add-track-step-place`).value,
  //       stepName:  document.getElementById(`add-track-step-name`).value,
  //       stepArrDate: document.getElementById(`add-track-step-arrive-date`).value,
  //       stepArrTime: document.getElementById(`add-track-step-arrive-time`).value,
  //       stepDepDate: document.getElementById(`add-track-step-depart-date`).value,
  //       stepDepTime: document.getElementById(`add-track-step-depart-time`).value,
  //       stepStory: document.getElementById(`add-track-step-story`).value,
  //       stepPic: stepPic,
  //       stepLike:0
  //     })
  //     console.log('db track step ok');
  //     localStorage.removeItem('pic') 
  //     document.getElementById(`add-track-step`).style.display ='none';
      
  //     document.getElementById(`add-track-step-place`).value = '';
  //     document.getElementById('add-track-step-name').value = '';
  //   } 
  // }
  
  hideAddPlanStep(e){
    e.preventDefault();
    document.getElementById(`add-plan-step`).style.display ='none';
  }  
  // hideAddTrackStep(e){
  //   e.preventDefault();
  //   document.getElementById(`add-track-step`).style.display ='none';
  // }  
  
  AddPlanStepPic(e){
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

        localStorage.setItem('pic',url);

        this.setState({
          AddPlanStepPic: true,
        });
  
        // firebase.firestore().collection('trips').doc(pickedTripID)
        // .collection('plan').doc()
        // .set({
        //   stepPic: url
        // })
      }).catch((error) => {
        console.log('download fail'+error.message)
      });
    });
  }

  // AddTrackStepPic(e){
  //   e.preventDefault();
  //   let storage = firebase.storage();
  //   let file = e.target.files[0];
  //   let storageRef = storage.ref('pics/'+file.name);

  //   let pickedTripID = new URL(location.href).pathname.substr(1);

  //   storageRef.put(file).then((snapshot) => {
  //     console.log('Uploaded', file.name);

  //     storageRef.getDownloadURL().then(
  //       (url) => {
  //       console.log('download'+url);

  //       localStorage.setItem('pic',url);
  
  //       // firebase.firestore().collection('trips').doc(pickedTripID)
  //       // .collection('plan').doc()
  //       // .set({
  //       //   stepPic: url
  //       // })
  //     }).catch((error) => {
  //       console.log('download fail'+error.message)
  //     });
  //   });
  // }

//   showEditPlanStep(e){
//     e.preventDefault();
//     document.getElementById(`edit-plan-step`).style.display ='block';
//     console.log(e.target.getAttribute('stepid'))

//     this.setState({
//         pickedStepID: e.target.getAttribute('stepid')
//     },() =>console.log(this.state.pickedStepID))

//     let pickedTripID = new URL(location.href).pathname.substr(1);

//     firebase.firestore().collection('trips')
//     .doc(pickedTripID).collection('plan').doc(e.target.getAttribute('stepid'))
//     .get().then(
//         doc => {
//             console.log(doc.data());
//             document.getElementById(`edit-plan-step-place`).value = doc.data().location;
//             document.getElementById(`edit-plan-step-name`).value = doc.data().stepName;
//             document.getElementById(`edit-plan-step-arrive-date`).value = doc.data().stepArrDate;
//             document.getElementById(`edit-plan-step-arrive-time`).value = doc.data().stepArrTime;
//             document.getElementById(`edit-plan-step-depart-date`).value = doc.data().stepDepDate;
//             document.getElementById(`edit-plan-step-depart-time`).value = doc.data().stepDepTime;
//             document.getElementById(`edit-plan-step-story`).value = doc.data().stepStory;
//         })
// }  

// showEditTrackStep(e){
//   e.preventDefault();
//   document.getElementById(`edit-track-step`).style.display ='block';
//   console.log(e.target.getAttribute('stepid'))

//   this.setState({
//       pickedStepID: e.target.getAttribute('stepid')
//   },() =>console.log(this.state.pickedStepID)) 
  
  
//   let pickedTripID = new URL(location.href).pathname.substr(1);

//   firebase.firestore().collection('trips')
//   .doc(pickedTripID).collection('track').doc(e.target.getAttribute('stepid'))
//   .get().then(
//       doc => {
//           console.log(doc.data());
//           document.getElementById(`edit-track-step-place`).value = doc.data().location;
//           document.getElementById(`edit-track-step-name`).value = doc.data().stepName;
//           document.getElementById(`edit-track-step-arrive-date`).value = doc.data().stepArrDate;
//           document.getElementById(`edit-track-step-arrive-time`).value = doc.data().stepArrTime;
//           document.getElementById(`edit-track-step-depart-date`).value = doc.data().stepDepDate;
//           document.getElementById(`edit-track-step-depart-time`).value = doc.data().stepDepTime;
//           document.getElementById(`edit-track-step-story`).value = doc.data().stepStory;
//       })
// }  


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
        .collection('plan').doc(this.props.state.pickedStepID)
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

        document.getElementById(`edit-plan-step-place`).value = '';
        document.getElementById('edit-plan-step-name').value = '';
        } 
  }
  // editTrackStep(e){
  //   e.preventDefault();

  //   let pickedTripID = new URL(location.href).pathname.substr(1);

  //   if (document.getElementById(`edit-track-step-place`).value &&
  //       document.getElementById(`edit-track-step-arrive-date`).value 
  //     ){
  //       document.getElementById(`edit-track-step-submit`).style.backgroundColor = '#CC3E55';
  //       document.getElementById(`edit-track-step-submit`).disabled = false;
      

  //     firebase.firestore().collection('trips').doc(pickedTripID)
  //     .collection('track').doc(this.props.state.pickedStepID)
  //     .update({
  //       location: document.getElementById(`edit-track-step-place`).value,
  //       stepName:  document.getElementById(`edit-track-step-name`).value,
  //       stepArrDate: document.getElementById(`edit-track-step-arrive-date`).value,
  //       stepArrTime: document.getElementById(`edit-track-step-arrive-time`).value,
  //       stepDepDate: document.getElementById(`edit-track-step-depart-date`).value,
  //       stepDepTime: document.getElementById(`edit-track-step-depart-time`).value,
  //       stepStory: document.getElementById(`edit-track-step-story`).value,
  //       // stepPic: stepPic
  //     })
  //     console.log('db edit track step ok');
  //     document.getElementById(`edit-track-step`).style.display ='none'; 

  //     document.getElementById(`edit-track-step-place`).value = '';
  //     document.getElementById('edit-track-step-name').value = '';
  //   } 
  // }

// deletePlanStep(e){
//   e.preventDefault();
  
//   let pickedTripID = new URL(location.href).pathname.substr(1);
//   this.setState({
//       pickedStepID: e.target.getAttribute('stepid')
//   },() =>console.log(this.state.pickedStepID))    

//   firebase.firestore()
//   .collection('trips').doc(pickedTripID)
//   .collection('plan').doc(this.state.pickedStepID)
//   .delete().then(() =>{
//       console.log('delete plan step ok')
//   }).catch((err) =>{
//       console.log(err.message)
//   })
// } 
// deleteTrackStep(e){
//   e.preventDefault();
  
//   let pickedTripID = new URL(location.href).pathname.substr(1);

//   this.setState({
//       pickedStepID: e.target.getAttribute('stepid')
//   },() =>console.log(this.state.pickedStepID))    

//   firebase.firestore()
//   .collection('trips').doc(pickedTripID)
//   .collection('track').doc(this.state.pickedStepID)
//   .delete().then(() =>{
//       console.log('delete track step ok')
//   }).catch((err) =>{
//       console.log(err.message)
//   })
// } 

  hideEditPlanStep(e){
    e.preventDefault();
    document.getElementById(`edit-plan-step`).style.display ='none';
  }  
  // hideEditTrackStep(e){
  //   e.preventDefault();
  //   document.getElementById(`edit-track-step`).style.display ='none';
  // } 

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

  // uploadTrackPic(e){
  //   e.preventDefault();
  //   let storage = firebase.storage();
  //   let file = e.target.files[0];
  //   let storageRef = storage.ref('pics/'+file.name);

  //   let pickedTripID = new URL(location.href).pathname.substr(1);

  //   storageRef.put(file).then((snapshot) => {
  //     console.log('Uploaded', file.name);

  //     storageRef.getDownloadURL().then(
  //       (url) => {
  //       console.log('download'+url);

  //       firebase.firestore().collection('trips').doc(pickedTripID)
  //       .collection('track').doc(this.state.pickedStepID)
  //       .update({
  //         stepPic: url
  //       })
  //     }).catch((error) => {
  //       console.log('download fail'+error.message)
  //     });
  //   });
  // }

  // downloadPic(e){
  //   e.preventDefault();
  //   let storage = firebase.storage();
  //   var storageRef = storage.ref('pics/');
  //   storageRef.child('q.png').getDownloadURL().then((url) => {
  //     console.log('download'+url);
  //     document.getElementById('pic').src = url;
  //   }).catch((error) => {
  //   });
  // }

  updatePlaceInput(e){
    this.setState({
      placeText: e.target.value,
    });
    console.log(this.state.placeText);

    let placeSearchText;

    if(document.getElementById(`add-plan-step-place`).value){
      placeSearchText = document.getElementById(`add-plan-step-place`).value;
    }

    // if(document.getElementById(`add-track-step-place`).value){
    //   placeSearchText = document.getElementById(`add-track-step-place`).value;
    // }

    if(document.getElementById(`edit-plan-step-place`).value){
      placeSearchText = document.getElementById(`edit-plan-step-place`).value;
    }

    // if(document.getElementById(`edit-track-step-place`).value){
    //   placeSearchText = document.getElementById(`edit-track-step-place`).value;
    // }


    // var xhr = new XMLHttpRequest();
    // xhr.open(
    //   "GET",
    //   `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeSearchText}.json?access_token=pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig&limit=5`
    // );

    // xhr.onload = function() {
    //   var response = JSON.parse(this.responseText);
    //   console.log(response)
    //   // console.log(response.features[0].center[0],response.features[0].center[1]);
    //   let data=[];       
    //   data.push(response);
    //   console.log(data)

    //   this.setState({
    //     placeSearchResult: data
    //   });
    //   console.log(this.state.placeSearchResult)
    // };
    // xhr.send();

  //   fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${placeSearchText}.json?access_token=pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig&limit=5`)
  //   .then(res => res.json())
  //   .then(
  //     (result) => {
  //       console.log(result)
  //       let data=[];       
  //       data.push(result);
  //       console.log(data)

  //       this.setState({
  //         searchPlaceResult: data[0].features
  //       });
  //       console.log(this.state.searchPlaceResult)
  //     },
    
  //     (error) => {
  //       console.log(error.message)
  //     }
  //   )
  }

  pickStepPlace(e){
    e.preventDefault();
    console.log(e.target.getAttribute('place'));
    console.log(this.props.state.pickedEdit);

    if(this.props.state.pickedAdd === 'plan'){
      document.getElementById(`add-plan-step-place`).value = e.target.getAttribute('place');
      document.getElementById('add-plan-step-name').value = e.target.getAttribute('place');
    }
    if(this.props.state.pickedAdd === 'track'){
    document.getElementById(`add-track-step-place`).value = e.target.getAttribute('place');
    document.getElementById('add-track-step-name').value = e.target.getAttribute('place');
    }


    if(this.props.state.pickedEdit === 'plan'){
      document.getElementById(`edit-plan-step-place`).value = e.target.getAttribute('place');
      document.getElementById('edit-plan-step-name').value = e.target.getAttribute('place');
    }
    if(this.props.state.pickedEdit === 'track'){
      document.getElementById(`edit-track-step-place`).value = e.target.getAttribute('place');
      document.getElementById('edit-track-step-name').value = e.target.getAttribute('place');
    }
    
    this.setState({
      placeText: null,
    });
  };

  // pickTrackPlace(e){
  //   e.preventDefault();
  //   console.log(e.target.getAttribute('place'))

  //   document.getElementById(`add-plan-track-place`).value = e.target.getAttribute('place');
  //   document.getElementById('add-plan-track-name').value = e.target.getAttribute('place');

  //   this.setState({
  //     placeText: null,
  //   });
  // }  

  render() {
    let searchPlaceBox = null;
    let searchPlacePage =null;
    let key=0;

      if(this.state.searchPlaceResult){
        searchPlaceBox = this.state.searchPlaceResult.map((n)=>{
          return  <div key={key++} className='search-plan-place-box'>   
                    <div onClick={this.pickStepPlace.bind(this)} className='search-plan-placeName' place={n.text}>{n.place_name}</div>
                    {/* <div className='card-time'>{n.}</div> */}
                  </div>
        })
      }

      if(this.state.placeText){
        searchPlacePage = (
            <div id='search-plan-place-pop'>
                  {searchPlaceBox} 
            </div>
        )
      }else{
          searchPlacePage = null;
      }

      let planStepPic = null;
      if(this.state.AddPlanStepPic){
        planStepPic = (
          <div><img id='planStepPic'/>
          {/* <div id='setPlanCoverPic'>set to plan cover photo</div> */}
          <div id='setTripCoverPic'>set to trip cover photo</div>
          </div>
          
        )  
      }

    return(
        <div>
            <div id='add-plan-step'>
                <div className='add-step-pop'>
                    <div onClick={this.hideAddPlanStep.bind(this)} className='add-step-close'>x</div>
                    <div className='add-step-title'>New step of Plan</div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Location</div>
                        <input onChange={this.updatePlaceInput.bind(this)} type='text' className='add-step-place' id='add-plan-step-place'/>
                    </div>
                    {searchPlacePage}
                    <div className='add-step-list'>
                        <div className='add-step-p'>Step name</div>
                        <input type='text' className='add-step-name' id='add-plan-step-name' placeholder='e.g. Europe Train Tour'/>
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Arrival</div>
                        <input type='date' className='add-step-arrive-date' id='add-plan-step-arrive-date' />
                        {/* min={this.props.state.trip.tripStart} max={this.props.state.trip.tripEnd} */}
                        <input type='time' className='add-step-arrive-time' id='add-plan-step-arrive-time'/>
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Departure</div>
                        <input type='date' className='add-step-depart-date' id='add-plan-step-depart-date' />
                        {/* min={this.props.state.trip.tripStart} max={this.props.state.trip.tripEnd} */}
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
                            <input onChange={this.AddPlanStepPic.bind(this)} id="uploadPicInput" type="file"></input>
                            {/* <img id='planStepPic'/> */}
                            {planStepPic}
                        </div>
                    </div>    
                    <div className='add-step-list'> 
                        <div className='add-step-submit' onClick={this.addPlanStep.bind(this)} id='add-plan-step-submit' aria-disabled='true'>Add step</div>
                        {/* <div className='add-step-cancel'>Cancel</div>
                        <img className='add-step-remove' src='public/imgs/menu.png'></img> */}
                    </div>
                </div>
            </div>

            {/* <div id='add-track-step'>
                <div className='add-step-pop'>
                    <div onClick={this.hideAddTrackStep.bind(this)} className='add-step-close'>x</div>
                    <div className='add-step-title'>New step of Track</div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Location</div>
                        <input onChange={this.updatePlaceInput.bind(this)} type='text' className='add-step-place' id='add-track-step-place'/>
                    </div>
                    {searchPlacePage}
                    <div className='add-step-list'>
                        <div className='add-step-p'>Step name</div>
                        <input type='text' className='add-step-name' id='add-track-step-name' placeholder='e.g. Europe Train Tour'/>
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Arrival</div>
                        <input type='date' className='add-step-arrive-date' id='add-track-step-arrive-date' />

                        <input type='time' className='add-step-arrive-time' id='add-track-step-arrive-time'/>
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Departure</div>
                        <input type='date' className='add-step-depart-date' id='add-track-step-depart-date' />
          
                        <input type='time' className='add-step-depart-time' id='add-track-step-depart-time'/>
                    </div>     
                    <div className='add-step-list'>
                        <div className='add-step-p'>Your story</div>    
                        <textarea className='add-step-story' id='add-track-step-story'></textarea>
                    </div>    
                    <div className='add-step-list'>
                        <div className='add-step-p'>Add your photos</div>
                        <div className='add-step-pic-box'>
                            <input  id="uploadPicInput" type="file"></input>
                            <img id='pic'/>
                        </div>
                    </div>    
                    <div className='add-step-list'> 
                        <div className='add-step-submit' onClick={this.addTrackStep.bind(this)} id='add-track-step-submit' aria-disabled='true'>Add step</div>
                    </div>
                </div>
            </div> */}



            {/* -----   edit step   ----- */}
            <div id='edit-plan-step'>
                <div className='add-step-pop'>
                    <div onClick={this.hideEditPlanStep.bind(this)} className='add-step-close'>x</div>
                    <div className='add-step-title'>Edit step of Plan</div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Location</div>
                        <input onChange={this.updatePlaceInput.bind(this)} type='text' className='add-step-place' id='edit-plan-step-place'/>
                    </div>
                    {searchPlacePage}
                    <div className='add-step-list'>
                        <div className='add-step-p'>Step name</div>
                        <input type='text' className='add-step-name' id='edit-plan-step-name' placeholder='e.g. Europe Train Tour'/>
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Arrival</div>
                        <input type='date' className='add-step-arrive-date' id='edit-plan-step-arrive-date' />
                        <input type='time' className='add-step-arrive-time' id='edit-plan-step-arrive-time'/>
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Departure</div>
                        <input type='date' className='add-step-depart-date' id='edit-plan-step-depart-date' />
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

            {/* <div id='edit-track-step'>
                <div className='add-step-pop'>
                    <div onClick={this.hideEditTrackStep.bind(this)} className='add-step-close'>x</div>
                    <div className='add-step-title'>Edit step of Track</div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Location</div>
                        <input onChange={this.updatePlaceInput.bind(this)} type='text' className='add-step-place' id='edit-track-step-place'/>
                    </div>
                    {searchPlacePage}
                    <div className='add-step-list'>
                        <div className='add-step-p'>Step name</div>
                        <input type='text' className='add-step-name' id='edit-track-step-name' placeholder='e.g. Europe Train Tour'/>
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Arrival</div>
                        <input type='date' className='add-step-arrive-date' id='edit-track-step-arrive-date' />
                        <input type='time' className='add-step-arrive-time' id='edit-track-step-arrive-time'/>
                    </div>
                    <div className='add-step-list'>
                        <div className='add-step-p'>Departure</div>
                        <input type='date' className='add-step-depart-date' id='edit-track-step-depart-date' />
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
            </div> */}

        </div>  
    )
  }
} 

export default Step;
