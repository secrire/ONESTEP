/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import {
  BrowserRouter as Router, Route, Link, Redirect,
} from 'react-router-dom';
import '../../css/style.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// import Search from "../search";

const Header = (props) => {
  const {
    changeUserInput, userData, islogin, userUid,
  } = props;
  const [showSignupPage, setShowSignupPage] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showLoginFailMsg, setShowLoginFailMsg] = useState(false);
  const {
    username, email, password, logEmail, logPassword,
  } = userData;

  const clickLogin = (e) => {
    e.preventDefault();
    setShowLoginPage(true);
    setShowLoginFailMsg(null);
  };

  const loginToSignup = (e) => {
    e.preventDefault();
    setShowSignupPage(true);
    setShowLoginPage(false);
  };

  const signupToLogin = (e) => {
    e.preventDefault();
    setShowSignupPage(false);
    setShowLoginPage(true);
  };

  /*          --------------   S I G N    U P       --------------      */
  const signUpByFb = (e) => {
    e.preventDefault();

    const provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const token = result.credential.accessToken;
        const { user } = result;
        // console.log(`fb sign up`,user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const signUpByEmail = (e) => {
    e.preventDefault();

    firebase
      .auth()
      .createUserWithEmailAndPassword(
        email,
        password,
      )
      .then(() => {
        console.log('email create member ok');
      })
      .catch((err) => {
        console.log(err.message);
        alert('Sign Up failed, please check the info again. Thank you');
      });
  };

  /*          --------------   L O G I N       --------------      */
  const loginByFb = (e) => {
    e.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const token = result.credential.accessToken;
        const { user } = result;
        // console.log(`fb login`, user, token);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const loginByEmail = (e) => {
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(
        logEmail,
        logPassword,
      )
      .then(() => {
        console.log('email log in ok');
      })
      .catch((err) => {
        console.log(err.message);
        setShowLoginFailMsg(true);
      });
  };

  const loginByTestAccount = (e) => {
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(
        'test@g.com',
        '111111',
      )
      .then(() => {
        console.log('test account log in ok');
      })
      .catch((err) => {
        console.log(err.message);
        setShowLoginFailMsg(true);
      });
  };

  if (islogin) {
    return <Redirect to={`/m${userUid}`} />;
  }

  const signupSubmit = (
    <div onClick={() => signUpByEmail()} className={showSignupPage && username && email && password ? 'signup-submit-approve' : 'signup-submit'}>
      Create new account
    </div>
  );

  const signupPage = showSignupPage ? (
    <div id="signup-page">
      <div className="signup-pop">
        <div
          onClick={() => setShowSignupPage(false)}
          className="signup-close"
        >
          x
        </div>
        <div className="signup-title">New account</div>
        <div className="signup-fb-btn" onClick={() => signUpByFb()}>
          Create new account with Facebook
        </div>
        <div className="signup-fb-note">
          We will never post to Facebook without your permission.
        </div>
        <div className="signup-or">or</div>
        <input
          type="text"
          className="signup-name"
          id="username"
          placeholder="Username"
          onChange={changeUserInput(username, e)}
          value={username}
        />
        <input
          type="email"
          className="signup-email"
          id="email"
          placeholder="Email"
          onChange={changeUserInput(email, e)}
          value={email}
        />
        <input
          type="password"
          className="signup-psw"
          id="password"
          placeholder="Password: at least 6 characters"
          onChange={changeUserInput(password, e)}
          value={password}
        />
        {signupSubmit}
        <div className="test-account" onClick={() => loginByTestAccount()}>Test account Log in</div>
        <div className="signup-to-login">
          <p>Already have an account?</p>
          <div onClick={() => signupToLogin()}>Log in</div>
        </div>
      </div>
    </div>
  ) : null;

  const loginFailMsg = showLoginFailMsg ? (
    <div id="login-fail-msg">
      Sorry, your username or password is wrong.
    </div>
  ) : null;

  const loginPage = showLoginPage ? (
    <div id="login-page">
      <div className="login-pop">
        <div
          onClick={() => showLoginPage(false)}
          className="signup-close"
        >
          x
        </div>
        <div className="signup-title">Log in to ONESTEP</div>
        <div className="signup-fb-btn" onClick={() => loginByFb()}>
          Log in with Facebook
        </div>
        <div className="signup-fb-note">
          We will never post to Facebook without your permission.
        </div>
        <div className="signup-or">or</div>
        <input
          type="text"
          onChange={changeUserInput(logEmail, e)}
          value={logEmail}
          id="logEmail"
          className="login-username"
          placeholder="Email"
        />
        <input
          type="password"
          onChange={changeUserInput(logPassword, e)}
          value={logPassword}
          id="logPassword"
          className="login-psw"
          placeholder="Password"
        />
        {loginFailMsg}
        <div onClick={() => loginByEmail()} className="login-submit">
          Log in
        </div>
        <div className="test-account" onClick={() => loginByTestAccount()}>Test account Log in</div>
        <div className="signup-to-login">
          <p>New to ONESTEP?</p>
          <div onClick={() => loginToSignup()}>
            Create an account
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div id="header">

        {/* <Search /> */}
        <div className="logo">O N E S T E P</div>
        <div className="login-signup-box">
          <div onClick={() => clickLogin()} className="login">
            Login
          </div>
          <div className="login-signup-line">/</div>
          <div onClick={() => setShowSignupPage(true)} className="signup">
            Register
          </div>
        </div>

        {signupPage}
        {loginPage}

      </div>
    </>
  );
};

export default Header;
