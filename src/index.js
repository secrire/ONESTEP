import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import "./css/style.css";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import Header from "./Component/HomePage/header";
import Banner from "./Component/HomePage/banner";
import Content from "./Component/HomePage/content";
import MHeader from "./Component/member-header";
import MContent from "./Component/member-content";
import TripID from "./Component/EachTrip/eachTrip";


// -----  firebase set ----- //
const firebaseConfig = {
  apiKey: "AIzaSyBBu-u6M_H7Prgya9WhkJ9AP0V7-0I_Ras",
  authDomain: "surprise-85f1d.firebaseapp.com",
  databaseURL: "https://surprise-85f1d.firebaseio.com",
  projectId: "surprise-85f1d",
  storageBucket: "surprise-85f1d.appspot.com",
  messagingSenderId: "432141103535",
  appId: "1:432141103535:web:30273aea341edd9958ff5a",
};

firebase.initializeApp(firebaseConfig);



class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
		username: "",
		email: "",
		password: "",
		logEmail: "",
		logPassword: "",
		tripIDs: [],
		islogin: null,
		userUid: "",
		totalUserUIDs: [],
    };
  }

componentDidMount() {
    firebase
		.firestore()
		.collection("users")
		.onSnapshot((querySnapshot) => {
			let totalUserUID = [];
			querySnapshot.forEach((doc) => {
				totalUserUID.push(doc.id);
			});
			this.setState({
				totalUserUIDs: totalUserUID,
			});
      	});

    firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			// console.log("Sign In", user);

			this.setState({
				islogin: true,
				userUid: user.uid,
			});

			if (this.state.logEmail === "" && this.state.email !== "") {
			firebase
				.firestore()
				.collection("users")
				.doc(firebase.auth().currentUser.uid)
				.set({
					username: this.state.username,
					email: this.state.email,
					logEmail: this.state.logEmail,
				});
			} else if (user.photoURL) {
			firebase
				.firestore()
				.collection("users")
				.doc(firebase.auth().currentUser.uid)
				.set({
					username: user.displayName,
					email: user.email,
					logEmail: this.state.logEmail,
				});
			} else {
			firebase
				.firestore()
				.collection("users")
				.doc(firebase.auth().currentUser.uid)
				.update({
					logEmail: this.state.logEmail,
				});
			}
		} else {
			console.log(`No user is signed in.`, user);
		}
    });

    firebase
		.firestore()
		.collection("trips")
		.orderBy("createTime", "desc")
		.onSnapshot((querySnapshot) => {
			let tripID = [];
			querySnapshot.forEach((doc) => {
				tripID.push(doc.id);
			});
			this.setState({
				tripIDs: tripID,
			});
		});
}

updateInput(e) {
    this.setState({
      	[e.target.id]: e.target.value,
    });
}

  changeIslogin() {
    firebase
		.auth()
		.signOut()
		.then(() => {
			console.log("logout ok");

			this.setState({
				islogin: false,
			});
		})
		.catch(function (error) {
			console.log(error.message);
		});
  }

  render() {
    let tripRoute = [];
    if (this.state.tripIDs !== []) {
		for (let i = 0; i < this.state.tripIDs.length; i++) {
			tripRoute.push(
				<Route exact path={"/" + this.state.tripIDs[i]}>
					<MHeader
					changeIslogin={this.changeIslogin.bind(this)}
					state={this.state}
					/>
					<TripID state={this.state} />
				</Route>
			);
		}
    }
    let totalUserUIDsRoute = [];
    if (this.state.totalUserUIDs !== []) {
		for (let i = 0; i < this.state.totalUserUIDs.length; i++) {
			if (this.state.totalUserUIDs[i] !== this.state.userUid) {
			totalUserUIDsRoute.push(
				<Route exact path={"/m" + this.state.totalUserUIDs[i]}>
					<MHeader
						changeIslogin={this.changeIslogin.bind(this)}
						state={this.state}
					/>
					<MContent state={this.state} />
				</Route>
			);
			}
		}
	}
	
    return (
      <Router>
        <div>
			<Route exact path="/">
				<Header
				updateInput={this.updateInput.bind(this)}
				state={this.state}
				/>
				<Banner />
				<Content />
			</Route>

			<Route exact path={"/m" + this.state.userUid}>
				<MHeader
				changeIslogin={this.changeIslogin.bind(this)}
				state={this.state}
				/>
				<MContent state={this.state} />
			</Route>
			{tripRoute}
			{totalUserUIDsRoute}
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));

