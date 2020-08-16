import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import "../css/member.css";
import "../css/style.css";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// import Search from "./search";
import Profile from "./profile";

class MHeader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		let user = firebase.auth().currentUser;
		if (user) {
		firebase
			.firestore()
			.collection("users")
			.onSnapshot((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					if (doc.data().email.toLowerCase() === user.email) {
						this.setState({
							currentUser: doc.data(),
						});
					}
				});
			});
		} else {
			console.log("not a member!!!");
		}
	}

	showSideMenu(e) {
		e.preventDefault();
		this.setState({
			showSideMenuPage: true,
		});
	}

	hideSideMenu(e) {
		e.preventDefault();
		this.setState({
			showSideMenuPage: null,
		});
	}

	showProfilePage(e) {
		e.preventDefault();
		this.setState({
			showProfilePage: true,
			showSideMenuPage: null,
		});
	}

	hideProfilePage(e) {
		e.preventDefault();
		this.setState({
			showProfilePage: null,
		});
	}

	render() {
		if (this.props.state.islogin === false) {
		return <Redirect exact to="/" />;
		}

		let mheaderUserinfo = null;
		let menuIcon = null;
		let userImg = null;
		if (this.state.currentUser) {
			if (this.state.currentUser.profilePic) {
				userImg = (
					<img className="user-img" src={this.state.currentUser.profilePic} />
				);
			} else {
				userImg = (
					<div className="user-noimg">
						<img className="user-img-icon" src="./imgs/whiteprofile.svg" />
					</div>
				);
			}
			mheaderUserinfo = (
				<Link to={"/m" + this.props.state.userUid} id="mheader-userinfo">
					<div className="mheader-userinfo">
						{userImg}
						<div className="user-displayname">{this.state.currentUser.username}</div>
					</div>
				</Link>
			);
			menuIcon = (
				<img
				onClick={this.showSideMenu.bind(this)}
				id="menu-icon"
				src="./imgs/menu.png"
				/>
			);
		}

		let sideMenuPage = null;
		if (this.state.showSideMenuPage) {
			sideMenuPage = (
				<div id="side-menu">
					<div className="menu-pop">
						<div onClick={this.hideSideMenu.bind(this)} className="menu-close">
						x
						</div>
						<div className="menu-title">My account</div>
						<div
						onClick={this.showProfilePage.bind(this)}
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
							<img src="./imgs/fb.svg" />
							<img src="./imgs/ig.svg" />
						</div>
						<div className="menu-title">About ONESTEP</div>
						<Link to="/">
							<div className="menu-story">Our story</div>
						</Link>
						<Link to="/">
							<div className="menu-cookie">Cookie policy</div>
						</Link>
						<div onClick={this.props.changeIslogin} className="menu-logout">
						Logout
						</div>
					</div>
				</div>
			);
		}

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
				state={this.state}
				hideProfilePage={this.hideProfilePage.bind(this)}
				/>
			</div>
		);
	}
}

export default MHeader;
