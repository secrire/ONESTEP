import React, { useState, useEffect } from 'react';
import '../css/member.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import Map from './map';

let map;
const today = new Date().toJSON().slice(0, 10);
const urlUserUID = new URL(location.href).pathname.substr(2);

const MContent = (props) => {
  const [userTrips, setUserTrips] = useState([]);
  const [tripIDs, setTripIDs] = useState([]);
  const [addTripName, setAddTripName] = useState('');
  const [addTripSum, setAddTripSum] = useState('');
  const [addTripStart, setAddTripStart] = useState(today);
  const [addTripEnd, setAddTripEnd] = useState(today);
  const [showAddTripPage, setShowAddTripPage] = useState(false);
  const [newTripID, setNewTripID] = useState(null);
  const [isAuthor, setIsAuthor] = useState(null);
  const [tripAuthor, setTripAuthor] = useState(null);
  const [currentUserTotalSteps,setCurrentUserTotalSteps] = useState(null);

  // showAddTrip(e){
  //     e.preventDefault();
  //     this.setState({
  //         showAddTripPage: true
  //     });
  // }

  const addTrip = (e) => {};
  // e.preventDefault();
  // const user = firebase.auth().currentUser;

  // firebase
  //     .firestore()
  //     .collection('trips')
  //     .doc()
  //     .set({
  //         authorUid: user.uid,
  //         planLike: 0,
  //         tripName: addTripName,
  //         tripSum: addTripSum,
  //         tripStart: addTripStart,
  //         tripEnd: addTripEnd,
  //         createTime: new Date(),
  //     })

  //     setShowAddTripPage(false);

  // // this.setState({
  // //     addNewTrip: true
  // // }, () =>{
  // //     firebase
  // //         .firestore()
  // //         .collection('trips')
  // //         .orderBy('createTime','desc')
  // //         .limit(1)
  // //         .onSnapshot(querySnapshot => {
  // //             let newTripID='';
  // //             querySnapshot.forEach(doc => {
  // //                 newTripID = doc.id;
  // //             })
  // //             this.setState({
  // //                 newTripID: newTripID
  // //             });
  // //         })
  // // });

  // setAddNewTrip(true);

  //     firebase
  //         .firestore()
  //         .collection('trips')
  //         .orderBy('createTime','desc')
  //         .limit(1)
  //         .onSnapshot(querySnapshot => {
  //             let tempNewTripID='';
  //             querySnapshot.forEach(doc => {
  //                 tempNewTripID = doc.id;
  //             })
  //             setNewTripID(tempNewTripID);
  //         })
  // };

  //     if(addNewTrip && newTripID){
  //         return <Redirect to={'/'+newTripID}/>
  //     }

  let addTripBtn = null;
  if (isAuthor) {
    if (userTrips.length === 0) {
      addTripBtn = (
        <div className="add-first-trip-box">
          <div className="add-first-trip-p">
            Start your travel adventures now by adding a past, current or future trip.
          </div>
          <div onClick={() => setShowAddTrip(true)} id="add-first-trip-btn">Add a trip</div>
        </div>
      );
    } else {
      addTripBtn = <div onClick={() => setShowAddTrip(true)} id="add-trip-btn">Add a past, current, or future trip</div>;
    }
  }

    const renderUserTrips = userTrips.map((n, index)=>{
        const cardImg = n.coverPic ? <img className='card-img' src={n.coverPic}/>:  <div className='card-no-img'/>;

        const calTripStart= new Date(n.tripStart);
        const calTripEnd = new Date(n.tripEnd);
        const tripDays = parseInt(Math.abs(calTripStart - calTripEnd) / 1000 / 60 / 60 / 24);
        const tripMonth = calTripStart.toString().substring(4,7);
        const tripYear = calTripStart.toString().substring(11,15);

        

        return  (
            <li key={n}>
                <Link to={"/"+tripIDs[index]}>
                    <div className='card'>
                        <div className='card-title'>{n.tripName}</div>
                        <div className='card-title-arrow'>></div>
                        <div className='card-main-container'>
                            <div className='card-main'>
                                <div className='card-main-line1'>{tripYear}</div>
                                <div className='card-main-line2'>{tripMonth}</div>
                            </div>
                            <div className='card-main'>
                                <div className='card-main-line1'>{tripDays}</div>
                                <div className='card-main-line2'>days</div>
                            </div>
                        </div>
                        {cardImg}
                    </div>
                </Link>
            </li>
        )
    });

  const userCardImg = tripAuthor && tripAuthor.profilePic ? <img className="user-card-img" src={tripAuthor.profilePic} /> :
    (
      <div className="user-card-noimg">
        <img className="user-card-img" src="./imgs/whiteprofile.svg" />
      </div>
    );

  const tripAuthorInfo = tripAuthor ? (
    <div className="trip-author-info">
      {userCardImg}
      <div id="user-card-name">{tripAuthor.username}</div>
      {tripAuthor.place && <div id="user-card-city">{tripAuthor.place}</div>}
      {tripAuthor.about && <div id="user-card-about">{tripAuthor.about}</div>}
    </div>
  ) : null;

  const addTripSubmit = addTripName && addTripStart ? <div onClick={() => addTrip()} id="add-trip-submit-approve">Add trip</div> : <div id="add-trip-submit" aria-disabled="true">Add trip</div>;

  const addTripPage = showAddTripPage ? (
    <div id="add-trip">
      <div className="add-pop">
        <div onClick={() => setShowAddTripPage(false)} className="add-close">x</div>
        <div className="add-title">New trip</div>
        <div className="add-name">Trip name</div>
        <input
          type="text"
          className="each-tripName"
          id="addTripName"
          placeholder="e.g. Europe Train Tour"
          onChange={(e) => setAddTripName(e.target.value)}
          value={addTripName || ''}
        />
        <div className="add-sum">Trip summary</div>
        <input
          type="text"
          className="each-tripSum"
          id="addTripSum"
          placeholder="e.g. First Solo Trip With Luck"
          o
          onChange={(e) => setAddTripSum(e.target.value)}
          value={addTripSum || ''}
        />
        <div className="add-when">When?</div>
        <div className="add-start">Start date</div>
        <input
          type="date"
          className="each-tripStart"
          id="addTripStart"
          onChange={(e) => setAddTripStart(e.target.value)}
          value={addTripStart}
        />
        <div className="add-end">End date</div>
        <input
          type="date"
          className="each-tripEnd"
          id="addTripEnd"
          min={addTripStart}
          onChange={(e) => setAddTripEnd(e.target.value)}
          value={addTripEnd}
        />
        {addTripSubmit}
      </div>
    </div>
  ) : null;

//   useEffect(() => {
//     const user = firebase.auth().currentUser;
//     const urlUserUID = new URL(location.href).pathname.substr(2);

//     mapboxgl.accessToken = 'pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig';
//     map = new mapboxgl.Map({
//         container: 'map',
//         style: 'mapbox://styles/mapbox/satellite-v9',
//         zoom: 2,
//         center: [10, 30],
//     });

//     const geojson = {
//         'type': 'FeatureCollection',
//         'features': []
//     };

//     firebase
//         .firestore()
//         .collection('trips')
//         .orderBy('createTime','desc')
//         .onSnapshot(querySnapshot => {
//             const data=[];
//             const tempTripID=[];
//             querySnapshot.forEach(doc => {
//                 if(urlUserUID === doc.data().authorUid){
//                     data.push(doc.data());
//                     tempTripID.push(doc.id);
//                 }
//             })
//             setUserTrips(data);
//             setTripIds(tempTripID);
//             // this.setState({
//             //     userTrips: data,
//             //     tripIDs: tempTripID
//             // },() =>{
//                 let tempCurrentUserTotalSteps=[];
//                 for(let k= 0; k<tripIDs.length; k++){
//                     firebase
//                         .firestore()
//                         .collection('trips')
//                         .doc(tripIDs[k])
//                         .collection('plan')
//                         .onSnapshot(querySnapshot => {
//                             querySnapshot.forEach(doc => {
//                                 tempCurrentUserTotalSteps.push(doc.data());
//                             })

//                             this.setState({
//                                 currentUserTotalSteps: tempCurrentUserTotalSteps,
//                             }, () => {
//                                 geojson.features=[];
//                                 let arr = currentUserTotalSteps;
//                                 for(let i = 0; i<arr.length; i++){
//                                     let item = {
//                                         'type': 'Feature',
//                                         'geometry': {
//                                         'type': 'Point',
//                                         'coordinates': [arr[i].longitude,arr[i].latitude]
//                                         }}
//                                     geojson.features.push(item);
//                                 }

//                                 geojson.features.forEach(function(marker){
//                                     let el = document.createElement('img');

//                                     el.className = 'totalStepPoint';
//                                     el.src = './imgs/redbgpin.svg';
//                                     //   el.style.backgroundColor = '#CC3E55';
//                                     el.style.width = '24px';
//                                     el.style.height ='24px';
//                                     //   el.style.border ='3px white solid';
//                                     el.style.boxShadow = 'rgb(253, 253, 254) 0px 0px 3px 1px';
//                                     el.style.borderRadius ='50%';
//                                     // console.log(marker.geometry.coordinates);

//                                     if(marker.geometry.coordinates[0]){
//                                         new mapboxgl.Marker(el)
//                                         .setLngLat(marker.geometry.coordinates)
//                                         .addTo(map);
//                                     }
//                                 });
//                             });
//                     })
//                 }
//             });
//     })

//     firebase.firestore().collection('users')
//     .onSnapshot(querySnapshot =>{
//         querySnapshot.forEach(doc => {
//             if(doc.id === urlUserUID){
//                     setTripAuthor(doc.data())
//             }
//         })
//     });

//     if(this.props.state.userUid === urlUserUID ){
//             setIsAuthor(true);
//     }
//         // var layerList = document.getElementById('menu');
//         // var inputs = layerList.getElementsByTagName('input');

//         // function switchLayer(layer) {
//         //     var layerId = layer.target.id;
//         //     map.setStyle('mapbox://styles/mapbox/' + layerId);
//         // }

//         // for (var i = 0; i < inputs.length; i++) {
//         //     inputs[i].onclick = switchLayer;
//         // }
// }, []);

  return (
    <div className="MContent">
      <Map />

      <div className="user-total-trip">
        <div className="user-card">
          {tripAuthorInfo}
          <div className="user-card-statis">
            <div className="user-card-trip">
              {userTrips.length}
              {' '}
              trips
            </div>
          </div>
        </div>
        <div className="user-title">Trips</div>
        {addTripBtn}

        <ul className="cards">
          {renderUserTrips}
        </ul>
      </div>
      {addTripPage}
    </div>
  );
};

export default MContent;
