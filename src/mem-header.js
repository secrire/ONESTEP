import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './member.css';
import './style.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

import Search from "./search";
import Profile from "./profile";



class MHeader extends React.Component {
  constructor(props){
    super(props);
    this.state ={

    };
  }
  componentDidMount() {
    let urlUserUID = new URL(location.href).pathname.substr(2);

    let user = firebase.auth().currentUser;
    if(user){
      firebase.firestore().collection('users')
      // .where('email','==',user.email)
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          if(doc.data().email.toLowerCase() === user.email){
            this.setState({
              currentUser: doc.data(),
            }); 
            console.log(this.state.currentUser) 
          }
        }) 
      });
    }else{
      console.log('not a member!!!');
      let noUserSearchIcon = document.getElementById('search-icon');
        
      noUserSearchIcon.style.cssText += "right: 30px; " ;

      // document.getElementById("mheader-userinfo").style.cssText += 'display:none;';
      // document.getElementById("menu-icon").style.cssText += 'display:none;';
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

  showProfilePage(e){
    e.preventDefault();
    // this.setState({
    //   showProfilePage: true
    // });
    document.getElementById(`side-menu`).style.display ='none';
    document.getElementById('profile-page').style.display ='block';
  }


  render() {
    if(this.props.state.islogin === false){
      return <Redirect exact to='/'/>
    }
    let mheaderUserinfo = null;
    let menuIcon = null;
    let userImg = null;
    if(this.state.currentUser){
      if(this.state.currentUser.profilePic){
        userImg = (<img className='user-img' src={this.state.currentUser.profilePic}/>)
      }else{
        userImg = ( <div className='user-noimg'>
                      <img className='user-img-icon' src='./imgs/whiteprofile.svg'/>
                    </div>
        )      
      }
      mheaderUserinfo =(<Link to={"/m"+this.props.state.userUid} id='mheader-userinfo'>
                          <div className='mheader-userinfo'>
                            {userImg}
                            <div className='user-displayname'>{this.state.currentUser.username}</div>
                          </div>
                        </Link>)
      menuIcon = <img onClick={this.showSideMenu.bind(this)} id='menu-icon' src='./imgs/menu.png'/>
    }

    

    return<div className='MHeader'>
            <div className='mheader-logo'><Link className='mheader-logo' exact to='/'>O N E S T E P</Link></div>
            {/* <div onClick={this.showAddTrip.bind(this)} className='add-trip'>+ Trip</div> */}
            {/* <Link to='/addTrack'><div className='add-track'>+ Track</div></Link> */}
            {/* <div className='add-surprise'>+ Surprise</div> */}

            {/* <input className='mheader-search'placeholder='Search'/>
            <img className='mheader-search-icon' src='./imgs/search.svg'/> */}
            <Search/>
            {mheaderUserinfo}
            {menuIcon}
            {/* <img onClick={this.showSideMenu.bind(this)} id='menu-icon' src='./imgs/menu.png'/> */}


            {/*  ------ side menu -----  */}
            <div id='side-menu'>
                <div className='menu-pop'>
                  <div onClick={this.hideSideMenu.bind(this)} className='menu-close'>x</div>
                  <div className='menu-title'>My account</div>
                    <div onClick={this.showProfilePage.bind(this)} className='menu-user-setting'>Profile settings</div>
                  <div className='menu-title'>Explore trips</div>
                    <Link to='/'><div className='menu-friend'>Popular trips</div></Link>
                    <Link to='/'><div className='menu-fav'>Our favourite</div></Link>
                  <div className='menu-title'>Connect with us</div>
                  <div className='menu-social'>
                    <img  src="./imgs/fb.svg" />
                    <img  src="./imgs/ig.svg" />
                    {/* <img  src="public/imgs/menu.png" /> */}
                  </div>  
                  <div className='menu-title'>About ONESTEP</div>
                    <Link to='/'><div className='menu-story'>Our story</div></Link>
                    <Link to='/'><div className='menu-cookie'>Cookie policy</div></Link>
                  <div onClick={this.props.changeIslogin} className='menu-logout'>Logout</div>
                </div>
            </div>

            <Profile state={this.state}/>
          </div>
      }
   } 



export default MHeader;
