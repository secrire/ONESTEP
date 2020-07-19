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
    this.state ={
      currentUserName: null
    };
  }
  componentDidMount() {
    let urlUserUID = new URL(location.href).pathname.substr(2);

    let user = firebase.auth().currentUser;
    if(user){

      firebase.firestore().collection('users')
      .where('email','==',user.email)
      .get()
      .then(querySnapshot => {
          querySnapshot.forEach(doc => {
              console.log(doc.data().username)
              this.setState({
                  currentUserName: doc.data().username
              });   
          }) 
      });
    }  
  }    


  showSideMenu(e){
    e.preventDefault();
    document.getElementById(`side-menu`).style.display ='block';
  }

  hideSideMenu(e){
    e.preventDefault();
    document.getElementById(`side-menu`).style.display ='none';
  }

  // logout(e){
  //   e.preventDefault(); 
  //   firebase.auth().signOut()
  //   .then(() => {
  //   })
  //   .catch(function(error) {
  //   });
  // } 


  render() {
    if(this.props.state.islogin === false){
      return <Redirect exact to='/'/>
    }

    return<div className='MHeader'>
            <div className='mheader-logo'><Link className='mheader-logo' exact to='/'>A N A M E</Link></div>
            {/* <div onClick={this.showAddTrip.bind(this)} className='add-trip'>+ Trip</div> */}
            {/* <Link to='/addTrack'><div className='add-track'>+ Track</div></Link> */}
            {/* <div className='add-surprise'>+ Surprise</div> */}

            <input className='mheader-search'placeholder='Search'/>
            <img className='mheader-search-icon' src='./imgs/search.svg'/>
            <Link to={"/m"+this.props.state.userUid}>
              <div className='mheader-userinfo'>
                <img className='user-img' src='./imgs/b.JPG'/>
                {/* <div className='user-displayname'>{this.state.currentUserName}</div> */}
              </div>
            </Link>
            <img onClick={this.showSideMenu.bind(this)} className='menu-icon' src='./imgs/menu.png'/>


            {/*  ------ side menu -----  */}
            <div id='side-menu'>
                <div className='menu-pop'>
                  <div onClick={this.hideSideMenu.bind(this)} className='menu-close'>x</div>
                  <div className='menu-title'>My account</div>
                    <div className='menu-user-setting'>Account settings</div>
                  <div className='menu-title'>Explore trips</div>
                    <Link to='/'><div className='menu-friend'>Popular trips</div></Link>
                    <Link to='/'><div className='menu-fav'>Our favourite</div></Link>
                  <div className='menu-title'>Connect with us</div>
                  <div className='menu-social'>
                    <img  src="./imgs/fb.svg" />
                    <img  src="./imgs/ig.svg" />
                    {/* <img  src="public/imgs/menu.png" /> */}
                  </div>  
                  <div className='menu-title'>About ANAME</div>
                    <Link to='/'><div className='menu-story'>Our story</div></Link>
                    <Link to='/'><div className='menu-cookie'>Cookie policy</div></Link>
                  <div onClick={this.props.changeIslogin} className='menu-logout'>Logout</div>
                </div>
            </div>
          </div>
      }
   } 



export default MHeader;
