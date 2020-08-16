import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import '../../css/eachTrip.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";


class TripHeaderAuthorInfo extends React.Component{
    constructor(props){
      super(props);
        this.state = {

        };
    }
    
    componentDidMount(){
        let pickedTripID = new URL(location.href).pathname.substr(1);

        firebase
            .firestore()
            .collection('trips')
            .doc(pickedTripID)
            .get().then(querySnapshot => {
                this.setState({
                    authorUid: querySnapshot.data().authorUid,
                }, () => {
                    firebase
                        .firestore()
                        .collection('users')
                        .onSnapshot(querySnapshot =>{
                            querySnapshot.forEach(doc => {
                                if(doc.id === this.state.authorUid){
                                    this.setState({
                                        authorName: doc.data().username,
                                        authorPic: doc.data().profilePic
                                    });
                                }
                            })    
                        });
                }
                )
            });
    }
    
    render(){
        let tripHeaderImg = (<div className='user-noimg'>
                                <img className='user-img-icon' src='./imgs/whiteprofile.svg'/>
                            </div>)
        if(this.state.authorPic){
            tripHeaderImg = <img className='trip-header-img' src={this.state.authorPic}/>
        }

        let tripHeaderName = null;
        if(this.state.authorName){
            tripHeaderName = <Link to={"/m"+this.state.authorUid}><div className='trip-header-name'>{this.state.authorName}</div></Link>
        }
		
		return  (
            <>
                {tripHeaderImg}
                {tripHeaderName}
            </>
		)
  	}
}
  

export default TripHeaderAuthorInfo;