import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './eachTrip.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";


let map;
let today = new Date().toJSON().slice(0,10);

class Step extends React.Component {
  constructor(props){
    super(props);
    this.state = {
     
    };    
  }

  componentDidMount(){
    mapboxgl.accessToken = 'pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 1,
        center: [30, 50],
    });
    map.setStyle('mapbox://styles/mapbox/satellite-v9');

      let pickedTripID = new URL(location.href).pathname.substr(1);
      let geojson = {
        'type': 'FeatureCollection',
        'features': []
      };
      
      console.log(pickedTripID)
      
      firebase.firestore().collection('trips')
      .doc(pickedTripID).collection('plan')
      .orderBy('stepArrDate','asc')
      .onSnapshot(querySnapshot => {
        let data=[]; 
      
        querySnapshot.docChanges().forEach(doc =>{
          if(doc.type === 'added'){
          console.log('ppppppp',doc.doc.data())
          data.push(doc.doc.data())
          }

        })
        // querySnapshot.forEach(doc => {
        //     data.push(doc.data()); 
        // })

        this.setState({
          planSteps:data,
        }, () => {
          console.log("Steps", this.state.planSteps);
          geojson.features=[];
          let arr = this.state.planSteps;
          for(let i = 0; i<arr.length; i++){
            let item = {
              'type': 'Feature',
              'geometry': {
              'type': 'Point',
              'coordinates': [arr[i].longitude,arr[i].latitude]
              }}
            geojson.features.push(item);  
          }
        
          console.log('rrrrrrrr',geojson.features);

          geojson.features.forEach(function(marker){
            var el = document.createElement('div');
            el.className = 'stepPoint';
            el.id= marker.geometry.coordinates[1];
 
          
            el.style.backgroundColor = 'white';
            el.style.width = '16px';
            el.style.height ='16px';
            el.style.border ='5px #CC3E55 solid';
            el.style.borderRadius ='50%';
            console.log(marker.geometry.coordinates);

            if(marker.geometry.coordinates[0]){
              new mapboxgl.Marker(el)
              .setLngLat(marker.geometry.coordinates)
              .addTo(map);
            }
            
          });  
        });
      })

    console.log(geojson.features);

    // document.getElementById(`addPlanStepArriveDate`).value = today;
    // document.getElementById(`addPlanStepDepartDate`).value = today;
    // console.log(this.props.state.trip.tripStart)

    // if(this.props.state.trip.tripStart){
    //  console.log('kkkkkkk')
    // //  document.getElementById(`addPlanStepArriveDate`).value = this.props.state.trip.tripStart;
    // }

    


  //   let geojson = {
  //     'type': 'FeatureCollection',
  //     'features': [
  //       {
  //       'type': 'Feature',
  //       // 'properties': {
  //       // 'message': 'Foo',
  //       // 'iconSize': [60, 60]
  //       // },
  //       'geometry': {
  //       'type': 'Point',
  //       'coordinates': [e.target.getAttribute('longitude'),e.target.getAttribute('latitude')]
  //       }
  //       },
  //       // {
  //       // 'type': 'Feature',
  //       // 'geometry': {
  //       // 'type': 'Point',
  //       // 'coordinates': [-61.2158203125, -15.97189158092897]
  //       // }
  //       // },
  //       // {
  //       // 'type': 'Feature',
  //       // 'geometry': {
  //       // 'type': 'Point',
  //       // 'coordinates': [-63.29223632812499, -18.28151823530889]
  //       // }
  //       // }
  //     ]
  //   };

  }

  updateInput(e){
    this.setState({
        [e.target.id]: e.target.value
    });
  }

  addPlanStep(e){
    e.preventDefault();

    let pickedTripID = new URL(location.href).pathname.substr(1);

    let stepPic= null;
    if(localStorage.getItem('pic')){
      stepPic= localStorage.getItem('pic');
    }
    // console.log(stepPic)

    let longitude ='';
    let latitude = '';
    if(localStorage.getItem('longitude')){
      longitude= localStorage.getItem('longitude');
      latitude= localStorage.getItem('latitude');
    }

    // if (document.getElementById(`addPlanStepPlace`).value &&
    //     document.getElementById(`addPlanStepArriveDate`).value 
        // &&document.getElementById(`add-plan-step-arrive-time`).value 
      //  ){
        // document.getElementById(`add-plan-step-submit`).style.backgroundColor = '#CC3E55';
        // document.getElementById(`add-plan-step-submit`).disabled = false;
      

        firebase.firestore().collection('trips').doc(pickedTripID)
        .collection('plan').doc()
        .set({
          location: document.getElementById(`addPlanStepPlace`).value,
          stepName:  document.getElementById(`addPlanStepName`).value,
          stepArrDate: document.getElementById(`addPlanStepArriveDate`).value,
          stepArrTime: document.getElementById(`addPlanStepArriveTime`).value,
          stepDepDate: document.getElementById(`addPlanStepDepartDate`).value,
          stepDepTime: document.getElementById(`addPlanStepDepartTime`).value,
          stepStory: document.getElementById(`add-plan-step-story`).value,
          stepPic: stepPic,
          // stepLike:0,
          longitude: longitude,
          latitude: latitude,
        })
        console.log('db plan step ok');
        localStorage.removeItem('pic');  
        localStorage.removeItem('longitude');  
        localStorage.removeItem('latitude');  
        document.getElementById(`add-plan-step`).style.display ='none';

        document.getElementById(`addPlanStepPlace`).value = '';
        document.getElementById('addPlanStepName').value = '';
        document.getElementById(`add-plan-step-story`).value='';
        
        if( document.getElementById(`step-pic`)){
          document.getElementById(`step-pic`).src='';
        }

        let node = document.getElementById('newestTag');
        if(node.parentNode){
            node.parentNode.removeChild(node);
        }
    // } 
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
          AddStepPic: true,
        });

        document.getElementById('step-pic').src = url;
        // document.getElementById('set-cover-pic').backgroundColor = 'red';
  
        // firebase.firestore().collection('trips').doc(pickedTripID)
        // .update({
        //   coverPic: url
        // })

        // console.log(this.props.state.trip.coverPic)

      }).catch((error) => {
        console.log('download fail'+error.message)
      });
    });
  }

  editPlanStepPic(e){
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
          AddStepPic: true,
        });

        document.getElementById('edit-step-pic').src = url;
        // document.getElementById('set-cover-pic').backgroundColor = 'red';
  
        // firebase.firestore().collection('trips').doc(pickedTripID)
        // .update({
        //   coverPic: url
        // })

        // console.log(this.props.state.trip.coverPic)
      }).catch((error) => {
        console.log('download fail'+error.message)
      });
    });
  }

  setCoverPic(e){
    e.preventDefault();
    // let pickedTripID = new URL(location.href).pathname.substr(1);
    
    // let coverPic= localStorage.getItem('pic');

    // firebase.firestore().collection('trips').doc(pickedTripID)
    // .update({
    //   coverPic: coverPic
    // })
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


  editPlanStep(e){
    e.preventDefault();

    let pickedTripID = new URL(location.href).pathname.substr(1);
    let stepPic='';
    if(localStorage.getItem('pic')){
      stepPic= localStorage.getItem('pic');
    }

    let longitude;
    let latitude;

    firebase.firestore().collection('trips').doc(pickedTripID)
    .collection('plan').doc(this.props.state.pickedStepID)
    .get().then(querySnapshot =>{
            
        console.log('old',querySnapshot.data().latitude);
        longitude= querySnapshot.data().longitude;
        latitude= querySnapshot.data().latitude;

        if(document.getElementById(querySnapshot.data().latitude)){
          let node = document.getElementById(querySnapshot.data().latitude);
          if(node.parentNode){
              node.parentNode.removeChild(node);
          }
        } 
        console.log('old4',latitude);

        if(localStorage.getItem('longitude')){
          longitude= localStorage.getItem('longitude');
          latitude= localStorage.getItem('latitude');
        }

        firebase.firestore().collection('trips').doc(pickedTripID)
        .collection('plan').doc(this.props.state.pickedStepID)
        .update({
            location: document.getElementById(`editPlanStepPlace`).value,
            stepName:  document.getElementById(`editPlanStepName`).value,
            stepArrDate: document.getElementById(`editPlanStepArriveDate`).value,
            stepArrTime: document.getElementById(`editPlanStepArriveTime`).value,
            stepDepDate: document.getElementById(`editPlanStepDepartDate`).value,
            stepDepTime: document.getElementById(`editPlanStepDepartTime`).value,
            stepStory: document.getElementById(`edit-plan-step-story`).value,
            stepPic: stepPic,
            longitude: longitude,
            latitude: latitude,    
        })
        console.log('db edit plan step ok');

        // geojson.features.forEach(function(marker){
          var el = document.createElement('div');
          el.className = 'marker';
          el.id= latitude;

          el.style.backgroundColor = '#CC3E55';
          el.style.width = '24px';
          el.style.height ='24px';
          el.style.border ='3px white solid';
          el.style.borderRadius ='50%';
          // console.log(marker.geometry.coordinates);

          // if(marker.geometry.coordinates[0]){
            new mapboxgl.Marker(el)
            .setLngLat([longitude,latitude])
            .addTo(map);
          // }
          
        // }); 


        localStorage.removeItem('pic'); 
        localStorage.removeItem('longitude');  
        localStorage.removeItem('latitude');  
        document.getElementById(`edit-plan-step`).style.display ='none';

        document.getElementById(`editPlanStepPlace`).value = '';
        document.getElementById('editPlanStepName').value = '';
        document.getElementById(`addPlanStepPlace`).value = '';
        document.getElementById('addPlanStepName').value = '';
        // if(document.getElementById('edit-step-pic')){
          this.setState({
            AddStepPic: null,
          });
          console.log(this.state.AddStepPic);
        // }
        // } 
        if(document.getElementById('newestTag')){
          let node = document.getElementById('newestTag');
          if(node.parentNode){
              node.parentNode.removeChild(node);
          }
        } 

    });


 
  
    // if (document.getElementById(`editPlanStepPlace`).value &&
    //     document.getElementById(`editPlanStepArriveDate`).value 
    //     // &&document.getElementById(`edit-plan-step-arrive-time`).value 
    //   ){
        // document.getElementById(`edit-plan-step-submit`).style.backgroundColor = '#CC3E55';
        // document.getElementById(`edit-plan-step-submit`).disabled = false;
           
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
  //   }).catch((error) => {
  //   });
  // }

  updatePlaceInput(e){
    if(document.getElementById('newestTag')){
      let node = document.getElementById('newestTag');
      if(node.parentNode){
          node.parentNode.removeChild(node);
      }
    } 

    this.setState({
      placeText: e.target.value,
    });
    console.log(this.state.placeText);

    let placeSearchText;
    console.log(document.getElementById(`addPlanStepPlace`).value)

    if(document.getElementById(`addPlanStepPlace`).value){
      placeSearchText = document.getElementById(`addPlanStepPlace`).value;
    }

    // if(document.getElementById(`add-track-step-place`).value){
    //   placeSearchText = document.getElementById(`add-track-step-place`).value;
    // }

    if(document.getElementById(`editPlanStepPlace`).value){
      placeSearchText = document.getElementById(`editPlanStepPlace`).value;
    }

    // if(document.getElementById(`edit-track-step-place`).value){
    //   placeSearchText = document.getElementById(`edit-track-step-place`).value;
    // }


    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${placeSearchText}.json?access_token=pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig&limit=8`)
    .then(res => res.json())
    .then(
      (result) => {
        // console.log(result)
        let data=[];       
        data.push(result);
        console.log(data)

        this.setState({
          searchPlaceResult: data[0].features
        });
        console.log(data[0].features)

        // for( let i=0; i< data[0].features.length; i++){
        //   console.log(data[0].features[i].context)
        // }
      },
    
      (error) => {
        console.log(error.message)
      }
    )
  }

  pickStepPlace(e){
    e.preventDefault();
    console.log(e.target.getAttribute('longitude'));
    console.log(e.target.getAttribute('latitude'));

    // mapboxgl.accessToken = 'pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig';
    // var map = new mapboxgl.Map({
    //     container: 'map',
    //     style: 'mapbox://styles/mapbox/streets-v11',
    //     zoom: 7,
    //     center: [122, 24.5]
    // });
    // map.setStyle('mapbox://styles/mapbox/satellite-v9')

    map.flyTo({
      center: [
        e.target.getAttribute('longitude'),e.target.getAttribute('latitude')
      ],
      zoom: 16,
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });

    localStorage.setItem('longitude',e.target.getAttribute('longitude'));
    localStorage.setItem('latitude',e.target.getAttribute('latitude'));

    let geojson = {
      'type': 'FeatureCollection',
      'features': [
        {
        'type': 'Feature',
        'geometry': {
        'type': 'Point',
        'coordinates': [e.target.getAttribute('longitude'),e.target.getAttribute('latitude')]
        }
        },
      ]
    };

      geojson.features.forEach(function(marker){
        var el = document.createElement('img');
        el.className = 'marker';
        el.id = 'newestTag'
       
        el.src = './imgs/redbgmaptag.svg';
        el.style.zIndex='2';
        // el.style.backgroundColor = '#CC3E55';
        el.style.width = '70px';
        el.style.height ='70px';
        el.style.borderRadius ='50%';
        // el.style.border ='3px white solid';
        
        if(marker.geometry.coordinates[0]){
          new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .addTo(map);
        }
       
      });

    if(this.props.state.pickedAdd === 'plan'){
      document.getElementById(`addPlanStepPlace`).value = e.target.getAttribute('place');
      document.getElementById('addPlanStepName').value = e.target.getAttribute('place');
    }
    // if(this.props.state.pickedAdd === 'track'){
    // document.getElementById(`add-track-step-place`).value = e.target.getAttribute('place');
    // document.getElementById('add-track-step-name').value = e.target.getAttribute('place');
    // }

    if(this.props.state.pickedEdit === 'plan'){
      document.getElementById(`editPlanStepPlace`).value = e.target.getAttribute('place');
      document.getElementById('editPlanStepName').value = e.target.getAttribute('place');
    }
    // if(this.props.state.pickedEdit === 'track'){
    //   document.getElementById(`edit-track-step-place`).value = e.target.getAttribute('place');
    //   document.getElementById('edit-track-step-name').value = e.target.getAttribute('place');
    // }
    
    this.setState({
      placeText: null,
      addPlanStepPlace: e.target.getAttribute('place'),
      editPlanStepPlace: e.target.getAttribute('place'),
    });
  }

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
    console.log(this.props.state)
    console.log(this.state)

    let searchPlaceBox = null;
    let searchPlacePage =null;
    let key=0;

    if(this.state.searchPlaceResult){
      searchPlaceBox = this.state.searchPlaceResult.map((n)=>{
        return  <div key={key++} className='search-plan-place-box'>   
                  <div onClick={this.pickStepPlace.bind(this)} className='search-plan-placeName' place={n.text} longitude={n.center[0]} latitude={n.center[1]}>{n.place_name}</div>
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

    let addStepPic = null;
    if(this.state.AddStepPic){
      addStepPic = (
        <div><img id='step-pic'/>
        {/* <div id='setPlanCoverPic'>set to plan cover photo</div> */}
        {/* <div onClick={this.setCoverPic.bind(this)} id='set-cover-pic'>set to cover photo</div> */}
        </div>  
      )  
    }
    let editStepPic = null;
    if(this.state.AddStepPic || this.props.state.withStepPic){
      editStepPic = (
        <div><img id='edit-step-pic'/>
        {/* <div id='setPlanCoverPic'>set to plan cover photo</div> */}
        {/* <div onClick={this.setCoverPic.bind(this)} id='set-cover-pic'>set to cover photo</div> */}
        </div>  
      )  
    }
      
  //  console.log(this.state.addplanStepArriveDate);
  //  console.log(this.props.state.trip.tripStart)
  //  if(this.props.state.trip.tripStart && document.getElementById(`addPlanStepArriveDate`)){
  //   console.log('kkkkkkk')
  //   document.getElementById(`addPlanStepArriveDate`).value = this.props.state.trip.tripStart;
  //  }

        
    // if(this.state.addplanStepArriveDate && this.state.addplanStepArriveDate !== this.props.state.trip.tripStart){
    //   console.log('ooooooook')
    //   document.getElementById(`addPlanStepArriveDate`).value = this.state.addplanStepArriveDate;
    //   document.getElementById(`addPlanStepDepartDate`).value = this.props.state.trip.tripEnd;
    // }

    let addStepSubmit = <div className='add-step-submit' id='add-plan-step-submit'>Add step</div>
    if(this.state.addPlanStepPlace && this.state.addPlanStepArriveDate){
        addStepSubmit = <div className='add-step-submit' onClick={this.addPlanStep.bind(this)} id='add-plan-step-submit-approve'>Add step</div>
    }

    let editStepSubmit = <div className='add-step-submit' onClick={this.editPlanStep.bind(this)} id='edit-plan-step-submit-approve'>Save changes</div>
    if(this.state.editPlanStepPlace || this.state.editPlanStepArriveDate){
        editStepSubmit = <div className='add-step-submit' onClick={this.editPlanStep.bind(this)} id='edit-plan-step-submit-approve'>Save changes</div>
    }

    // console.log(this.state.addPlanStepArriveTime)
    // if(this.state.addPlanStepArriveTime){
    //   console.log('why')
    //   document.getElementById('addPlanStepArriveTime').value= this.state.addPlanStepArriveTime;
    // }
  
    return(
        <div>
            <div id='add-plan-step'>
                <div className='add-step-pop'>
                    <div onClick={this.hideAddPlanStep.bind(this)} className='add-step-close'>x</div>
                    <div className='add-step-title'>New step</div>
                    <div className='add-step-container'>
                        <div className='add-step-p-box'>
                            <div className='add-step-p'>Location</div>
                            <div className='add-step-p'>Step name</div>
                            <div className='add-step-p'>Arrival</div>
                            <div className='add-step-p'>Departure</div>
                            <div className='add-step-p'>Your story</div> 
                            <div className='add-step-p-photo'>Add photo</div>
                        </div>
                        <div className='add-step-input-box'>
                            <input onChange={this.updatePlaceInput.bind(this)} type='text' className='add-step-place' id='addPlanStepPlace'/> 
                            {searchPlacePage}
                            <input type='text' className='add-step-name' id='addPlanStepName' placeholder='e.g. Europe Train Tour'/>
                            <input type='date' className='add-step-arrive-date' id='addPlanStepArriveDate' 
                                    onChange={this.updateInput.bind(this)} min={this.props.state.trip.tripStart} max={this.props.state.trip.tripEnd}/>
                            <input type='time' name="time" className='add-step-arrive-time' id='addPlanStepArriveTime'  onChange={this.updateInput.bind(this)}/>
                            <input type='date' className='add-step-depart-date' id='addPlanStepDepartDate' 
                                    onChange={this.updateInput.bind(this)} min={this.state.addPlanStepArriveDate} max={this.props.state.trip.tripEnd}/>
                            <input type='time' name="time" className='add-step-depart-time' id='addPlanStepDepartTime'  onChange={this.updateInput.bind(this)}/>
                            <textarea className='add-step-story' id='add-plan-step-story'></textarea>
                            <div className='add-step-pic-box'>
                              {addStepPic}
                              <label className='step-pic-label'>
                                  <input onChange={this.AddPlanStepPic.bind(this)} className='trip-cover-change-pic' id="uploadPicInput" type="file"/>
                                  <img className='step-upload-pic-icon' src='./imgs/bluecamera.svg'/>
                              </label>
                                {/* <img id='planStepPic'/> */}
                            </div>
                            {/* <div className='add-step-type'>
                                <img className='add-step-type-story' src="public/imgs/menu.png" />
                                <img className='add-step-type-eat' src="public/imgs/menu.png" />
                                <img className='add-step-type-event' src="public/imgs/menu.png" />
                                <img className='add-step-type-traffic' src="public/imgs/menu.png" />
                                <img className='add-step-type-stay' src="public/imgs/menu.png" />
                            </div> */}
                                {/* <div className='add-step-cancel'>Cancel</div>
                                <img className='add-step-remove' src='public/imgs/menu.png'></img> */}
                        </div>

                    </div>
                    
                    {addStepSubmit}
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
                    <div className='add-step-title'>Edit step</div>
                        <div className='add-step-container'>
                            <div className='add-step-p-box'>
                                <div className='add-step-p'>Location</div>
                                <div className='add-step-p'>Step name</div>
                                <div className='add-step-p'>Arrival</div>
                                <div className='add-step-p'>Departure</div>
                                <div className='add-step-p'>Your story</div> 
                                <div className='add-step-p-photo'>Change photo</div>
                            </div>
                            <div className='add-step-input-box'>
                                <input onChange={this.updatePlaceInput.bind(this)} type='text' className='add-step-place' id='editPlanStepPlace'/> 
                                {searchPlacePage}
                                <input type='text' onChange={this.updateInput.bind(this)} className='add-step-name' id='editPlanStepName' placeholder='e.g. Europe Train Tour'/>
                                <input type='date' className='add-step-arrive-date' id='editPlanStepArriveDate' 
                                        onChange={this.updateInput.bind(this)} min={this.props.state.trip.tripStart} max={this.props.state.trip.tripEnd}/>
                                <input type='time' className='add-step-arrive-time' id='editPlanStepArriveTime'  onChange={this.updateInput.bind(this)}/>
                                <input type='date' className='add-step-depart-date' id='editPlanStepDepartDate' 
                                        onChange={this.updateInput.bind(this)} min={this.state.editPlanStepArriveDate} max={this.props.state.trip.tripEnd}/>
                                <input type='time' className='add-step-depart-time' id='editPlanStepDepartTime'  onChange={this.updateInput.bind(this)}/>
                                <textarea onChange={this.updateInput.bind(this)} className='add-step-story' id='edit-plan-step-story'></textarea>
                                <div className='add-step-pic-box'>
                                  {editStepPic}
                                  <label className='step-pic-label'>
                                      <input onChange={this.editPlanStepPic.bind(this)} className='trip-cover-change-pic' id="uploadPicInput" type="file"/>
                                      <img className='step-upload-pic-icon' src='./imgs/bluecamera.svg'/>
                                  </label>
                                    {/* <img id='planStepPic'/> */}
                                </div>
                            </div>
                        </div>
                        {editStepSubmit}       
                </div>
                 
                        {/* <div className='add-step-cancel'>Cancel</div> */}
                        {/* <img className='add-step-remove' src='public/imgs/menu.png'/> */}
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
