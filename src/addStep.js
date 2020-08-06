import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./css/eachTrip.css";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

let map;
let today = new Date().toJSON().slice(0, 10);
let pickedTripID = new URL(location.href).pathname.substr(1);

class Step extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			addPlanStepName: '',
			addPlanStepArriveTime: '',
			addPlanStepDepartDate: '',
			addPlanStepDepartTime: '',
			addPlanStepStory: '',
		};
	}

	componentDidMount() {
		let pickedTripID = new URL(location.href).pathname.substr(1);
		
		mapboxgl.accessToken =
		"pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig";
		map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/satellite-v9",
			zoom: 1,
			center: [30, 50],
		});
		
		let geojson = {
			type: "FeatureCollection",
			features: [],
		};

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
				planSteps: data,
			},
			() => {
				geojson.features = [];
				let arr = this.state.planSteps;
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
					var el = document.createElement("div");
					el.className = "stepPoint";
					el.id = marker.geometry.coordinates[1];

					el.style.backgroundColor = "white";
					el.style.width = "16px";
					el.style.height = "16px";
					el.style.border = "5px #CC3E55 solid";
					el.style.borderRadius = "50%";
					console.log(marker.geometry.coordinates);

					if (marker.geometry.coordinates[0]) {
						new mapboxgl.Marker(el)
						.setLngLat(marker.geometry.coordinates)
						.addTo(map);
					}
				});
			}
			);
		});
		console.log(geojson.features);

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

	updateInput(e) {
		this.setState({
			[e.target.id]: e.target.value,
		});
	}

	updatePlaceInput(e) {
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

		// if(this.props.state.pickedAdd === 'plan'){
		// 	this.setState({
		// 		addPlanStepPlace: e.target.value,
		// 	});
		// }

		// if(this.props.state.pickedEdit === 'plan'){
		// 	this.setState({
		// 		editPlanStepPlace: e.target.value,
		// 	});
		// }

		let placeSearchText;
		if (this.state.addPlanStepPlace) {
			placeSearchText = this.state.addPlanStepPlace;
		}

		if (this.state.editPlanStepPlace) {
			placeSearchText = this.state.editPlanStepPlace;
		}

		fetch(
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${placeSearchText}.json?access_token=pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig&limit=8`
		)
		.then((res) => res.json())
		.then(
			(result) => {
				let data = [];
				data.push(result);
				console.log(data);

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
		console.log(e.target.getAttribute("longitude"));
		console.log(e.target.getAttribute("latitude"));

		map.flyTo({
		center: [
			e.target.getAttribute("longitude"),
			e.target.getAttribute("latitude"),
		],
		zoom: 16,
		essential: true, // this animation is considered essential with respect to prefers-reduced-motion
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
		// el.style.backgroundColor = '#CC3E55';
		el.style.width = "70px";
		el.style.height = "70px";
		el.style.borderRadius = "50%";
		// el.style.border ='3px white solid';

		if (marker.geometry.coordinates[0]) {
			new mapboxgl.Marker(el)
			.setLngLat(marker.geometry.coordinates)
			.addTo(map);
		}
		});

		if (this.props.state.pickedAdd === "plan") {
			this.setState({
				addPlanStepPlace: e.target.getAttribute("place"),
				addPlanStepName: e.target.getAttribute("place"),
			});
		}

		if (this.props.state.pickedEdit === "plan") {
			this.setState({
				editPlanStepPlace: e.target.getAttribute("place"),
				editPlanStepName: e.target.getAttribute("place"),
			});
		// document.getElementById(
		// 	`editPlanStepPlace`
		// ).value = e.target.getAttribute("place");
		// document.getElementById("editPlanStepName").value = e.target.getAttribute(
		// 	"place"
		// );
		}
		this.setState({
		placeText: null,
		
		// addPlanStepPlace: e.target.getAttribute("place"),
		// editPlanStepPlace: e.target.getAttribute("place"),
		});
	}

	AddPlanStepPic(e) {
		e.preventDefault();
		let storage = firebase.storage();
		let file = e.target.files[0];
		let storageRef = storage.ref("pics/" + file.name);

		storageRef.put(file).then((snapshot) => {
			console.log("Uploaded", file.name);

			storageRef
			.getDownloadURL()
			.then((url) => {
				console.log("download" + url);

				localStorage.setItem("pic", url);

				this.setState({
					AddStepPic: true,
				});

				document.getElementById("step-pic").src = url;

				// firebase.firestore().collection('trips').doc(pickedTripID)
				// .update({
				//   coverPic: url
				// })
			})
			.catch((error) => {
				console.log("download fail" + error.message);
			});
		});
	}

	editPlanStepPic(e) {
		e.preventDefault();
		let storage = firebase.storage();
		let file = e.target.files[0];
		let storageRef = storage.ref("pics/" + file.name);

		storageRef.put(file).then((snapshot) => {
			console.log("Uploaded", file.name);

			storageRef
			.getDownloadURL()
			.then((url) => {
				console.log("download" + url);

				localStorage.setItem("pic", url);

				this.setState({
					AddStepPic: true,
				});

				document.getElementById("edit-step-pic").src = url;
			})
			.catch((error) => {
				console.log("download fail" + error.message);
			});
		});
	}

	addPlanStep(e) {
		e.preventDefault();

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
			// stepLike:0,
			longitude: longitude,
			latitude: latitude,
		});
		console.log("db plan step ok");
		localStorage.removeItem("pic");
		localStorage.removeItem("longitude");
		localStorage.removeItem("latitude");

		// document.getElementById(`add-plan-step`).style.display = "none";
		this.setState({
			addPlanStepPlace: '',
			addPlanStepName: '',
			addPlanStepStory: '',
		});

		if (this.state.AddStepPic) {
			this.setState({
				AddStepPic: null,
			});
		}

		let node = document.getElementById("newestTag");
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}


	editPlanStep(e) {
		e.preventDefault();

		let stepPic = "";
		if (localStorage.getItem("pic")) {
			stepPic = localStorage.getItem("pic");
		}

		let longitude;
		let latitude;

		firebase
		.firestore()
		.collection("trips")
		.doc(pickedTripID)
		.collection("plan")
		.doc(this.props.state.pickedStepID)
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

			firebase
			.firestore()
			.collection("trips")
			.doc(pickedTripID)
			.collection("plan")
			.doc(this.props.state.pickedStepID)
			.update({
				location: this.state.editPlanStepPlace,
				stepName: document.getElementById(`editPlanStepName`).value,
				stepArrDate: document.getElementById(`editPlanStepArriveDate`)
				.value,
				stepArrTime: document.getElementById(`editPlanStepArriveTime`)
				.value,
				stepDepDate: document.getElementById(`editPlanStepDepartDate`)
				.value,
				stepDepTime: document.getElementById(`editPlanStepDepartTime`)
				.value,
				stepStory: document.getElementById(`editPlanStepStory`).value,
				stepPic: stepPic,
				longitude: longitude,
				latitude: latitude,
			});
			console.log("db edit plan step ok");


			var el = document.createElement("div");
			el.className = "marker";
			el.id = latitude;

			el.style.backgroundColor = "#CC3E55";
			el.style.width = "24px";
			el.style.height = "24px";
			el.style.border = "3px white solid";
			el.style.borderRadius = "50%";
			// console.log(marker.geometry.coordinates);

			new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map);

			localStorage.removeItem("pic");
			localStorage.removeItem("longitude");
			localStorage.removeItem("latitude");
			document.getElementById(`edit-plan-step`).style.display = "none";

			document.getElementById(`editPlanStepPlace`).value = "";
			document.getElementById("editPlanStepName").value = "";
			document.getElementById(`addPlanStepPlace`).value = "";
			document.getElementById("addPlanStepName").value = "";
			// if(document.getElementById('edit-step-pic')){
			this.setState({
				AddStepPic: null,
			});
			console.log(this.state.AddStepPic);
			// }
			// }
			if (document.getElementById("newestTag")) {
			let node = document.getElementById("newestTag");
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
			}
		});
	}

	uploadPlanPic(e) {
		e.preventDefault();
		let storage = firebase.storage();
		let file = e.target.files[0];
		let storageRef = storage.ref("pics/" + file.name);

		storageRef.put(file).then((snapshot) => {
			console.log("Uploaded", file.name);

			storageRef
			.getDownloadURL()
			.then((url) => {
				console.log("download" + url);

				firebase
				.firestore()
				.collection("trips")
				.doc(pickedTripID)
				.collection("plan")
				.doc(this.state.pickedStepID)
				.update({
					stepPic: url,
				});
			})
			.catch((error) => {
				console.log("download fail" + error.message);
			});
		});
	}

	

  render() {
    console.log(this.props.state);
	console.log(this.state);

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
	
	// if (this.props.state.searchPlaceResult) {
	// 	searchPlaceBox = this.props.state.searchPlaceResult.map((n) => {
	// 	  return (
	// 		<div key={key++} className="search-plan-place-box">
	// 		  <div
	// 			onClick={this.pickStepPlace.bind(this)}
	// 			className="search-plan-placeName"
	// 			place={n.text}
	// 			longitude={n.center[0]}
	// 			latitude={n.center[1]}
	// 		  >
	// 			{n.place_name}
	// 		  </div>
	// 		</div>
	// 	  );
	// 	});
	//   }
  

    if (this.state.placeText) {
      searchPlacePage = <div id="search-plan-place-pop">{searchPlaceBox}</div>;
    } else {
      searchPlacePage = null;
    }

    let addStepPic = null;
    if (this.state.AddStepPic) {
      addStepPic = (
        <div>
          <img id="step-pic" />
        </div>
      );
    }
    let editStepPic = null;
    if (this.state.AddStepPic || this.props.state.withStepPic) {
      editStepPic = (
        <div>
          <img id="editStepPic" src={this.props.state.editStepPic}/>
        </div>
      );
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

    let addStepSubmit = (
      <div className="add-step-submit" id="add-plan-step-submit">
        Add step
      </div>
    );
    if (this.state.addPlanStepPlace && this.state.addPlanStepArriveDate) {
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
	if(this.props.state.pickedAdd === 'plan'){
		addPlanStepPage =(
			<div id="add-plan-step">
				<div className="add-step-pop">
					<div
					onClick={this.props.hideAddPlanStep} 
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
						onChange={this.updatePlaceInput.bind(this)}
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
						min={this.props.state.trip.tripStart}
						max={this.props.state.trip.tripEnd}
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
						max={this.props.state.trip.tripEnd}
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
						></textarea>
						<div className="add-step-pic-box">
						{addStepPic}
						<label className="step-pic-label">
							<input
							onChange={this.AddPlanStepPic.bind(this)}
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
						{/* <img
						className="add-step-remove"
						src="public/imgs/menu.png"
						></img>{" "}
						*/} 
					</div>
					</div>

					{addStepSubmit}
				</div>
			</div>
		)
	}

	let editPlanStepPage = null;
	if(this.props.state.pickedEdit === 'plan'){
		editPlanStepPage =(
			<div id="edit-plan-step">
			<div className="add-step-pop">
			  <div
				onClick={this.props.hideEditPlanStep} 
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
					onChange={this.updatePlaceInput.bind(this)}
					type="text"
					className="add-step-place"
					id="editPlanStepPlace"
					value={this.state.editPlanStepPlace}
				  />
				  {searchPlacePage}
				  <input
					type="text"
					onChange={this.props.updateInput} 
					className="add-step-name"
					id="editPlanStepName"
					placeholder="e.g. Europe Train Tour"
					value={this.props.state.editPlanStepName}
				  />
				  <input
					type="date"
					className="add-step-arrive-date"
					id="editPlanStepArriveDate"
					onChange={this.props.updateInput} 
					min={this.props.state.trip.tripStart}
					max={this.props.state.trip.tripEnd}
					value={this.props.state.editPlanStepArriveDate}
				  />
				  <input
					type="time"
					className="add-step-arrive-time"
					id="editPlanStepArriveTime"
					onChange={this.props.updateInput} 
					value={this.props.state.editPlanStepArriveTime}
				  />
				  <input
					type="date"
					className="add-step-depart-date"
					id="editPlanStepDepartDate"
					onChange={this.props.updateInput} 
					min={this.state.editPlanStepArriveDate}
					max={this.props.state.trip.tripEnd}
					value={this.props.state.editPlanStepDepartDate}
				  />
				  <input
					type="time"
					className="add-step-depart-time"
					id="editPlanStepDepartTime"
					onChange={this.props.updateInput} 
					value={this.props.state.editPlanStepDepartTime}
				  />
				  <textarea
					onChange={this.props.updateInput} 
					className="add-step-story"
					id="editPlanStepStory"
					value={this.props.state.editPlanStepStory}
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
  
			{/* <div className='add-step-cancel'>Cancel</div> */}
			{/* <img className='add-step-remove' src='public/imgs/menu.png'/> */}
		  </div>
		)
	}

    return (
      <div>
        
		{addPlanStepPage}

		{editPlanStepPage}
        
      </div>
    );
  }
}

export default Step;
