/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, Route, Link, Redirect,
} from 'react-router-dom';
import '../css/member.css';
import '../css/style.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// import Search from "./search";
import Profile from './profile';

const MHeader = (props) => {
  const {
    changeIslogin, islogin, userUid,
	  } = props;
  const [showSideMenuPage, setShowSideMenuPage] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const clickProfileSetting = (e) => {
    e.preventDefault();
    setShowProfilePage(true);
    setShowSideMenuPage(false);
  };

  if (!islogin) {
    return <Redirect exact to="/" />;
  }

  let mheaderUserinfo = null;
  let menuIcon = null;
  let userImg = null;
  if (currentUser) {
    if (currentUser.profilePic) {
      userImg = (
        <img className="user-img" src={currentUser.profilePic} alt="user" />
      );
    } else {
      userImg = (
        <div className="user-noimg">
          <img className="user-img-icon" src="./imgs/whiteprofile.svg" alt="" />
        </div>
      );
    }
    mheaderUserinfo = (
      <Link to={`/m${userUid}`} id="mheader-userinfo">
        <div className="mheader-userinfo">
          {userImg}
          <div className="user-displayname">{currentUser.username}</div>
        </div>
      </Link>
    );
    menuIcon = (
      <img
        onClick={() => setShowSideMenuPage(true)}
        id="menu-icon"
        src="./imgs/menu.png"
        alt=""
      />
    );
  }

  const sideMenuPage = showSideMenuPage ? (
    <div id="side-menu">
      <div className="menu-pop">
        <div onClick={() => setShowSideMenuPage(false)} className="menu-close">
          x
        </div>
        <div className="menu-title">My account</div>
        <div
          onClick={() => clickProfileSetting()}
          className="menu-user-setting"
        >
          Profile settings
        </div>
        <div className="menu-title">Explore trips</div>
        <Link to="/">
          <div className="menu-friend">Popular trips</div>
        </Link>
        <Link to="/">
          <div className="menu-fav">Our favourite</div>
        </Link>
        <div className="menu-title">Connect with us</div>
        <div className="menu-social">
          <img src="./imgs/fb.svg" alt="" />
          <img src="./imgs/ig.svg" alt="" />
        </div>
        {/* <div className="menu-title">About ONESTEP</div>
			<Link to="/">
				<div className="menu-story">Our story</div>
			</Link>
			<Link to="/">
				<div className="menu-cookie">Cookie policy</div>
			</Link> */}
        <div onClick={() => changeIslogin()} className="menu-logout">
          Logout
        </div>
      </div>
    </div>
  ) : null;

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase
        .firestore()
        .collection('users')
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.data().email.toLowerCase() === user.email) {
              setCurrentUser(doc.data());
            }
          });
        });
    } else {
      console.log('not a member!!!');
    }
  }, []);

  return (
    <div className="MHeader">
      <div className="mheader-logo">
        <Link className="mheader-logo" exact to="/">
          O N E S T E P
        </Link>
      </div>

      {/* <Search /> */}
      {mheaderUserinfo}
      {menuIcon}
      {sideMenuPage}

      <Profile
        currentUser={currentUser}
        showProfilePage={showProfilePage}
        hideProfilePage={setShowProfilePage(false)}
      />
    </div>
  );
};

export default MHeader;
