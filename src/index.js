/* eslint-disable react/no-unused-state */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import './css/style.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import Header from './Component/HomePage/header';
import Banner from './Component/HomePage/banner';
import Content from './Component/HomePage/content';
import MHeader from './Component/member-header';
import MContent from './Component/member-content';
import TripID from './Component/EachTrip/eachTrip';

// -----  firebase set ----- //
const firebaseConfig = {
  apiKey: 'AIzaSyBBu-u6M_H7Prgya9WhkJ9AP0V7-0I_Ras',
  authDomain: 'surprise-85f1d.firebaseapp.com',
  databaseURL: 'https://surprise-85f1d.firebaseio.com',
  projectId: 'surprise-85f1d',
  storageBucket: 'surprise-85f1d.appspot.com',
  messagingSenderId: '432141103535',
  appId: '1:432141103535:web:30273aea341edd9958ff5a',
};

firebase.initializeApp(firebaseConfig);

const App = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    logEmail: '',
    logPassword: '',
  });
  // const [username, setUsername] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [logEmail, setLogEmail] = useState('');
  // const [logPassword, setLogPassword] = useState('');
  const [tripIDs, setTripIDs] = useState([]);
  const [islogin, setIslogin] = useState(null);
  const [userUid, setUserUid] = useState('');
  const [totalUserUIDs, setTotalUserUIDs] = useState([]);

  const {
    username, email, password, logEmail, logPassword,
  } = userData;

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     username: '',
  //     email: '',
  //     password: '',
  //     logEmail: '',
  //     logPassword: '',
  //     tripIDs: [],
  //     islogin: null,
  //     userUid: '',
  //     totalUserUIDs: [],
  //   };
  // }
  const changeUserInput = (key, e) => {
    console.log('changeUserInput', key, e.target.value);
    setUserData({ ...userData, key: e.target.value });
  };

  const changeIslogin = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // console.log('logout ok');
        setIslogin(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const tripRoute = [];
  if (tripIDs !== []) {
    for (let i = 0; i < tripIDs.length; i++) {
      tripRoute.push(
        <Route exact path={`/${tripIDs[i]}`}>
          <MHeader
            changeIslogin={changeIslogin}
            // state={this.state}
          />
          <TripID />
        </Route>,
      );
    }
  }
  const totalUserUIDsRoute = [];
  if (totalUserUIDs !== []) {
    for (let i = 0; i < totalUserUIDs.length; i++) {
      if (totalUserUIDs[i] !== userUid) {
        totalUserUIDsRoute.push(
          <Route exact path={`/m${totalUserUIDs[i]}`}>
            <MHeader
              changeIslogin={changeIslogin}
              // state={this.state}
            />
            <MContent />
          </Route>,
        );
      }
    }
  }

  useEffect(() => {
    firebase
      .firestore()
      .collection('users')
      .onSnapshot((querySnapshot) => {
        const totalUserUID = [];
        querySnapshot.forEach((doc) => {
          totalUserUID.push(doc.id);
        });
        setTotalUserUIDs(totalUserUID);
      });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
      // console.log("Sign In", user);

        setIslogin(true);
        setUserUid(user.uid);

        if (logEmail === '' && email !== '') {
          firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .set({
              username,
              email,
              logEmail,
            });
        } else if (user.photoURL) {
          firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .set({
              username: user.displayName,
              email: user.email,
              logEmail,
            });
        } else {
          firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
              logEmail,
            });
        }
      } else {
        console.log('No user is signed in.', user);
      }
    });

    firebase
      .firestore()
      .collection('trips')
      .orderBy('createTime', 'desc')
      .onSnapshot((querySnapshot) => {
        const tripID = [];
        querySnapshot.forEach((doc) => {
          tripID.push(doc.id);
        });

        setTripIDs(tripID);
      });
  }, []);

  // componentDidMount() {
  //   firebase
  //     .firestore()
  //     .collection('users')
  //     .onSnapshot((querySnapshot) => {
  //       const totalUserUID = [];
  //       querySnapshot.forEach((doc) => {
  //         totalUserUID.push(doc.id);
  //       });
  //       this.setState({
  //         totalUserUIDs: totalUserUID,
  //       });
  //     });

  //   firebase.auth().onAuthStateChanged((user) => {
  //     const {
  //       username, email, password, logEmail, logPassword, tripIDs, islogin, userUid, totalUserUIDs,
  //     } = this.state;
  //     if (user) {
  //       // console.log("Sign In", user);

  //       this.setState({
  //         islogin: true,
  //         userUid: user.uid,
  //       });

  //       if (logEmail === '' && email !== '') {
  //         firebase
  //           .firestore()
  //           .collection('users')
  //           .doc(firebase.auth().currentUser.uid)
  //           .set({
  //             username,
  //             email,
  //             logEmail,
  //           });
  //       } else if (user.photoURL) {
  //         firebase
  //           .firestore()
  //           .collection('users')
  //           .doc(firebase.auth().currentUser.uid)
  //           .set({
  //             username: user.displayName,
  //             email: user.email,
  //             logEmail,
  //           });
  //       } else {
  //         firebase
  //           .firestore()
  //           .collection('users')
  //           .doc(firebase.auth().currentUser.uid)
  //           .update({
  //             logEmail,
  //           });
  //       }
  //     } else {
  //       console.log('No user is signed in.', user);
  //     }
  //   });

  //   firebase
  //     .firestore()
  //     .collection('trips')
  //     .orderBy('createTime', 'desc')
  //     .onSnapshot((querySnapshot) => {
  //       const tripID = [];
  //       querySnapshot.forEach((doc) => {
  //         tripID.push(doc.id);
  //       });
  //       this.setState({
  //         tripIDs: tripID,
  //       });
  //     });
  // }

  return (
    <Router>
      <div>
        <Route exact path="/">
          <Header
            userData={userData}
            changeUserInput={changeUserInput}
            islogin={islogin}
            userUid={userUid}
            // state={this.state}
          />
          <Banner />
          <Content />
        </Route>

        <Route exact path={`/m${userUid}`}>
          <MHeader
            changeIslogin={changeIslogin}
            islogin={islogin}
            userUid={userUid}
            // state={this.state}
          />
          <MContent />
        </Route>
        {tripRoute}
        {totalUserUIDsRoute}
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
