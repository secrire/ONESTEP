import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import '../../css/eachTrip.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";


class AddStepPic extends React.Component{
    constructor(props){
      super(props);
        this.state = {

        };
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
                    isAddStepPic: true,
                    addStepPic: url
				});
			})
			.catch((error) => {
				console.log("download fail" + error.message);
			});
		});
	}
    
    render(){
        console.log(this.state);

        let addStepPic = null;
        if (this.state.isAddStepPic) {
          addStepPic = (
            <div>
              <img id="step-pic" src={this.state.addStepPic}/>
            </div>
          );
        }
        
		return  (
            <>
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
            </>
		)
  	}
}
  

export default AddStepPic;