import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './member.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

class MHeader extends React.Component {
  constructor(props){
    super(props);
  }

  showSideMenu(e){
    e.preventDefault();
    document.getElementById(`side-menu`).style.display ='block';
  }

  hideSideMenu(e){
    e.preventDefault();
    document.getElementById(`side-menu`).style.display ='none';
  }

  // showAddTrip(e){
  //   e.preventDefault();
  //   document.getElementById(`add-trip`).style.display ='block';
  // }

  // hideAddTrip(e){
  //   e.preventDefault();
  //   document.getElementById(`add-trip`).style.display ='none';
  // }

  // logout(e){
  //   e.preventDefault(); 
  //   firebase.auth().signOut()
  //   .then(() => {
  //   })
  //   .catch(function(error) {
  //   });
  // } 

  // updateInput(e){
  //   this.setState({
  //       [e.target.id]: e.target.value
  //   });
  // }

  // addTrip(e){
  //   e.preventDefault();

  //   if(document.getElementById(`tripName`).value &&
  //      document.getElementById(`tripStart`).value){
  //     document.getElementById(`add-trip-submit`).disabled = false;
  //     document.getElementById(`add-trip-submit`).style.backgroundColor = '#CC3E55';

  //     console.log(this.state)
  //     let user = firebase.auth().currentUser;
  //     console.log(user.uid)    

  //     firebase.firestore().collection('trips')
  //     .doc()
  //     .set({
  //       authorUid: user.uid,
  //       planlike: 0,
  //       trackLike: 0,
  //       // surpriseLike: 0,
  //       tripName: document.getElementById(`tripName`).value,
  //       tripSum: document.getElementById(`add-sum-input`).value,
  //       tripStart: document.getElementById(`tripStart`).value,
  //       tripEnd: document.getElementById(`add-end-input`).value,
  //       createTime: new Date() 
  //     })
  //     document.getElementById(`add-trip`).style.display ='none';
  //     console.log('db add trip ok');  
  //   } 
  // }
      
  render() {
    if(this.props.state.islogin === false){
      return <Redirect to='/'/>
    }

    return<div className='header'>
            <Link to='/'><div className='logo'>needaname</div></Link>
            <input className='search'placeholder='explore...'/>
            {/* <div onClick={this.showAddTrip.bind(this)} className='add-trip'>+ Trip</div> */}
            {/* <Link to='/addTrack'><div className='add-track'>+ Track</div></Link> */}
            {/* <div className='add-surprise'>+ Surprise</div> */}
            <Link to='/member'><img className='user-img' src='./imgs/b.JPG'/></Link>
            {/* <div className='user-displayname'>username</div> */}
            <img onClick={this.showSideMenu.bind(this)} className='menu-icon' src='./imgs/menu.png'/>
              
            <div id='side-menu'>
                <div className='menu-pop'>
                  <div onClick={this.hideSideMenu.bind(this)} className='menu-close'>x</div>
                  <div className='menu-title'>My account</div>
                    <div className='menu-user-setting'>Account settings</div>
                  <div className='menu-title'>Explore travelers</div>
                    <Link to='/'><div className='menu-friend'>Friends sharing</div></Link>
                    <Link to='/'><div className='menu-fav'>Our favourite</div></Link>
                  <div className='menu-title'>Connect with us</div>
                  <div className='menu-social'>
                    <img  src="./imgs/fb.svg" />
                    <img  src="./imgs/ig.svg" />
                    {/* <img  src="public/imgs/menu.png" /> */}
                  </div>  
                  <div className='menu-title'>About SURPRISE</div>
                    <Link to='/'><div className='menu-story'>Our story</div></Link>
                  <div onClick={this.props.changeIslogin} className='menu-logout'>Logout</div>
                </div>
            </div>
          </div>
      }
   } 



export default MHeader;
