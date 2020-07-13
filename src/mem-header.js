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
    this.state = {
      tripName:'',
      tripSum: '',
      tripStart: '',
      tripEnd: '',
      islogin: true
    };
  }

  showSideMenu(e){
    e.preventDefault();
    document.getElementById(`side-menu`).style.display ='block';
  }

  hideSideMenu(e){
    e.preventDefault();
    document.getElementById(`side-menu`).style.display ='none';
  }

  showAddTrip(e){
    e.preventDefault();
    document.getElementById(`add-trip`).style.display ='block';
  }

  hideAddTrip(e){
    e.preventDefault();
    document.getElementById(`add-trip`).style.display ='none';
  }

  logout(e){
    e.preventDefault();
    firebase.auth().signOut()
    .then(() => {
      console.log('logout ok');

      this.setState({
        islogin: false
      });
    })
    .catch(function(error) {
      console.log(error.message)
    });
  } 


  addTrip(e){
    e.preventDefault();

    if(document.getElementById(`add-name-input`).value &&
       document.getElementById(`add-start-input`).value){
      document.getElementById(`add-trip-submit`).disabled = false;
      document.getElementById(`add-trip-submit`).style.backgroundColor = '#CC3E55';
      
      this.setState({
        tripName: document.getElementById(`add-name-input`).value,
        tripSum: document.getElementById(`add-sum-input`).value,
        tripStart: document.getElementById(`add-start-input`).value,
        tripEnd: document.getElementById(`add-end-input`).value 
      });

      let user = firebase.auth().currentUser;
      console.log(user.uid)    

      firebase.firestore().collection('trips')
      .doc()
      .set({
        authorUid: user.uid,
        planlike: 0,
        trackLike: 0,
        surpriseLike: 0,
        tripName: document.getElementById(`add-name-input`).value,
        tripSum: document.getElementById(`add-sum-input`).value,
        tripStart: document.getElementById(`add-start-input`).value,
        tripEnd: document.getElementById(`add-end-input`).value,
        createTime: new Date() 
      })
      document.getElementById(`add-trip`).style.display ='none';
      console.log('db add trip ok');  
    } 
  }
      
  render() {
    if(this.state.islogin === false){
      return <Redirect exact to='/'/>
    }

    return<div className='header'>
            <Link to='/'><div className='logo'>needaname</div></Link>
            <input className='search'placeholder='explore...'/>
            <div onClick={this.showAddTrip.bind(this)} className='add-trip'>+ Trip</div>
            {/* <Link to='/addTrack'><div className='add-track'>+ Track</div></Link> */}
            {/* <div className='add-surprise'>+ Surprise</div> */}
            <Link to='/member'><img className='user-img' src='./imgs/b.JPG'/></Link>
            {/* <div className='user-displayname'>username</div> */}
            <img onClick={this.showSideMenu.bind(this)} className='menu-icon' src='./imgs/menu.png'></img>

            <div id='add-trip'>
                  <div className='add-pop'>
                  <div onClick={this.hideAddTrip.bind(this)} className='add-close'>x</div>
                  <div className='add-title'>New trip</div>
                  <div className='add-name'>Trip name</div>
                  <input type='text' id='add-name-input' placeholder='e.g. Europe Train Tour'
                          // onChange={this.updateInput.bind(this)}
                          ></input>
                  <div className='add-sum'>Trip summary</div>
                  <input type='text' id='add-sum-input' placeholder='e.g. First Solo Trip With Luck'
                          // onChange={this.updateInput.bind(this)}
                          // value={this.state.username}
                          ></input>
                  <div className='add-when'>When?</div>
                  {/* <form action="/action_page.php"> */}
                    {/* <label htmlFor="birthday">Birthday:</label>
                    <input type="date" id="birthday" name="birthday"/>
                    <input type="submit"/> */}
                  {/* </form> */}
                  <div className='add-start'>Start date</div>
                  <input type='date' id='add-start-input' placeholder='5 July 2020'
                          // onChange={this.updateInput.bind(this)}
                          // value={this.state.username}
                          ></input>   
                  <div className='add-end'>End date</div>
                  <input type='date' id='add-end-input' placeholder='I have no idea'
                          // onChange={this.updateInput.bind(this)}
                          // value={this.state.username}
                          ></input>  
                  {/* <div className='who-can-see'>Who can see my trip</div>                */}
                  <div onClick={this.addTrip.bind(this)} id='add-trip-submit' aria-disabled='true'>Add trip</div>
                  </div>
            </div>


              

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
                  <div onClick={this.logout.bind(this)} className='menu-logout'>Logout</div>
                </div>
            </div>
          </div>
      }
   } 



export default MHeader;
