import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import "../../css/style.css";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// import Search from "../search";

class Header extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	showSignupPage(e) {
		e.preventDefault();
		this.setState({
			showSignupPage: true,
		});
	}

	showLoginPage(e) {
		e.preventDefault();
		this.setState({
			showLoginPage: true,
			showLoginFailMsg: null,
		});
	}

	loginToSignup(e) {
		e.preventDefault();
		this.setState({
			showSignupPage: true,
			showLoginPage: false,
		});
	}

	signupToLogin(e) {
		e.preventDefault();
		this.setState({
			showSignupPage: false,
			showLoginPage: true,
		});
	}

	/*          --------------   S I G N    U P       --------------      */
	FBsignUp(e) {
		e.preventDefault();

		let provider = new firebase.auth.FacebookAuthProvider();
		firebase
		.auth()
		.signInWithPopup(provider)
		.then((result) => {
			let token = result.credential.accessToken;
			let user = result.user;

			console.log(`fb sign up`,user);
		})
		.catch((error) => {
			console.log(error.message);
		});
	}

	emailSignUp(e) {
		e.preventDefault();

		firebase
			.auth()
			.createUserWithEmailAndPassword(
			this.props.state.email,
			this.props.state.password
			)
			.then(() => {
				console.log("email create member ok");
			})
			.catch((err) => {
				console.log(err.message);
				alert('Sign Up failed, please check the info again. Thank you');
			});
	}

	hideSignupPage(e) {
		e.preventDefault();
		this.setState({
			showSignupPage: false,
		});
	}

	/*          --------------   L O G I N       --------------      */
	FBlogin(e) {
		e.preventDefault();
		let provider = new firebase.auth.FacebookAuthProvider();

		firebase
			.auth()
			.signInWithPopup(provider)
			.then((result) => {
				let token = result.credential.accessToken;
				let user = result.user;
				console.log(`fb login`, user, token);
			})
			.catch((error) => {
				console.log(error.message);
			});
	}

	emailLogIn(e) {
		e.preventDefault();

		firebase
			.auth()
			.signInWithEmailAndPassword(
			this.props.state.logEmail,
			this.props.state.logPassword
			)
			.then(() => {
				console.log('email log in ok');
			})
			.catch((err) => {
				console.log(err.message);
				this.setState({
					showLoginFailMsg: true,
				});
			});
	}

	testAccountLogIn(e) {
		e.preventDefault();

		firebase
			.auth()
			.signInWithEmailAndPassword(
			'test@g.com',
			'111111'
			)
			.then(() => {
				console.log('test account log in ok');
			})
			.catch((err) => {
				console.log(err.message);
				this.setState({
					showLoginFailMsg: true,
				});
			});
	}

	hideLoginPage(e) {
		e.preventDefault();
		this.setState({
			showLoginPage: false,
		});
	}

	render() {
		if (this.props.state.islogin === true) {
			return <Redirect to={"/m" + this.props.state.userUid} />
		}

		let signupPage = null;
		let signupSubmit = (
			<div onClick={this.emailSignUp.bind(this)} className="signup-submit">
			Create new account
			</div>
		);

		if (this.state.showSignupPage === true) {
			if (
				this.props.state.username &&
				this.props.state.email &&
				this.props.state.password
			) {
				signupSubmit = (
					<div
						onClick={this.emailSignUp.bind(this)}
						className="signup-submit-approve"
					>
					Create new account
					</div>
				);
			}

			signupPage = (
				<div id="signup-page">
				<div className="signup-pop">
					<div
					onClick={this.hideSignupPage.bind(this)}
					className="signup-close"
					>
					x
					</div>
					<div className="signup-title">New account</div>
					<div className="signup-fb-btn" onClick={this.FBsignUp.bind(this)}>
					Create new account with Facebook
					</div>
					<div className="signup-fb-note">
					We'll never post to Facebook without your permission.
					</div>
					<div className="signup-or">or</div>
					<input
						type="text"
						className="signup-name"
						id="username"
						placeholder="Username"
						onChange={this.props.updateInput}
					/>
					<input
						type="email"
						className="signup-email"
						id="email"
						placeholder="Email"
						onChange={this.props.updateInput}
					/>
					<input
						type="password"
						className="signup-psw"
						id="password"
						placeholder="Password: at least 6 characters"
						onChange={this.props.updateInput}
					/>
					{signupSubmit}
					<div className='test-account' onClick={this.testAccountLogIn.bind(this)} >Test account Log in</div> 
					<div className="signup-to-login">
					<p>Already have an account?</p>
					<div onClick={this.signupToLogin.bind(this)}>Log in</div>
					</div>
				</div>
				</div>
			);				
		}

		let loginPage = null;
		let loginFailMsg = null;
		if(this.state.showLoginFailMsg){
			loginFailMsg = (
				<div id="login-fail-msg">
				Sorry, your username or password is wrong.
				</div>
			)
		}

		if (this.state.showLoginPage === true) {
			loginPage = (
				<div id="login-page">
					<div className="login-pop">
						<div
						onClick={this.hideLoginPage.bind(this)}
						className="signup-close"
						>
						x
						</div>
						<div className="signup-title">Log in to ONESTEP</div>
						<div className="signup-fb-btn" onClick={this.FBlogin.bind(this)}>
						Log in with Facebook
						</div>
						<div className="signup-fb-note">
						We'll never post to Facebook without your permission.
						</div>
						<div className="signup-or">or</div>
						<input
							type="text"
							onChange={this.props.updateInput}
							id="logEmail"
							className="login-username"
							placeholder="Email"
						/>
						<input
							type="password"
							onChange={this.props.updateInput}
							id="logPassword"
							className="login-psw"
							placeholder="Password"
						/>
						{loginFailMsg}
						<div onClick={this.emailLogIn.bind(this)} className="login-submit">
						Log in
						</div>
						<div className='test-account' onClick={this.testAccountLogIn.bind(this)} >Test account Log in</div> 
						<div className="signup-to-login">
							<p>New to ONESTEP?</p>
							<div onClick={this.loginToSignup.bind(this)}>
							Create an account
							</div>
						</div>
					</div>
				</div>
			);
		}

		return (
			<>
				<div id="header">

				{/* <Search /> */}
				<div className="logo">O N E S T E P</div>
				<div className="login-signup-box">
					<div onClick={this.showLoginPage.bind(this)} className="login">
					Login
					</div>
					<div className="login-signup-line">/</div>
					<div onClick={this.showSignupPage.bind(this)} className="signup">
					Register
					</div>
				</div>

				{signupPage}
				{loginPage}

				</div>
			</>
		);
	}
}

export default Header;