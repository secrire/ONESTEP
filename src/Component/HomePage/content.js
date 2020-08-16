import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "../../css/style.css";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

class Content extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userTrips: [],
			favTripIDs: [],
		};
	}

	componentDidMount() {
		firebase
			.firestore()
			.collection("trips")
			.orderBy("planLike", "desc")
			.limit(4)
			.onSnapshot((querySnapshot) => {
				let data = [];
				let favTripID = [];
				let authorUid = [];
				querySnapshot.forEach((doc) => {
				data.push(doc.data());
					favTripID.push(doc.id);
					authorUid.push(doc.data().authorUid);
				});
				this.setState(
				{
					userTrips: data,
					favTripIDs: favTripID,
					authorUids: authorUid,
				},
				() => {
					let authorName = [];
					let authorPic = [];
					for (let i = 0; i < this.state.authorUids.length; i++) {
						firebase
							.firestore()
							.collection("users")
							.onSnapshot((querySnapshot) => {
								querySnapshot.forEach((doc) => {
									if (this.state.authorUids[i] === doc.id) {
									authorName.push(doc.data().username);
									authorPic.push(doc.data().profilePic);
									}
								});
								this.setState({
									authorNames: authorName,
									authorPics: authorPic,
								});
							});
					}
				}
				);
			});
	}

	render() {
		let renderPopTrips;
		let favUserImg;

		if (this.state.authorPics) {
			renderPopTrips = this.state.userTrips.map((n, index) => {
				if (this.state.authorPics[index]) {
					favUserImg = (
						<img className="fav-user-pic" src={this.state.authorPics[index]} />
					);
				} else {
					favUserImg = (
						<div className="fav-user-noimg">
						<img
						className="fav-user-img-icon"
						src="./imgs/whiteprofile.svg"
						/>
						</div>
					);
				}
				return (
					<li key={this.state.favTripIDs[index]} className="fav">
						<figure className="fav-main">
							<Link to={"/" + this.state.favTripIDs[index]}>
								<div className="fav-hover-layer">
									<p>SEE TRIP</p>
									<img src="./imgs/bluearrow.svg" />
								</div>
							</Link>
							<Link to={"/" + this.state.favTripIDs[index]}>
								<div className="fav-main">
									<img className="fav-img" src={n.coverPic} />
								</div>
							</Link>
						</figure>
						<div className="fav-info">
							<div className="fav-info-decoration" />
							<div className="fav-who">
								{favUserImg}
								<div className="fav-name">{this.state.authorNames[index]}</div>
							</div>
							<div className="fav-trip-name">{n.tripName}</div>
							<div className="fav-content">{n.tripSum}</div>
						</div>
					</li>
				);
			});
		}

		return (
			<div className="content">
				<div className="favs-title">POPULAR TRIPS</div>
				<div className="favs-title-des">Selected by the number of likes</div>
				<div className="favs-title-line"></div>
				<div className="favs">

				{renderPopTrips}
		
				</div>

				<div className="index-first-step-box">
					<img id="index-first-step-img" src="./imgs/a.jpg" />
					<div className="index-first-step-layer" />
					<div className="index-first-step-p">TAKE YOUR FIRST ONE STEP</div>
					{/* <div onClick={this.props.showSignupPage}  className='index-first-step-btn'>Register to create an account</div>  */}
				</div>

				<div className="footer">
					<div className="footer-content">
						<div className="footer-box">
							<p className="footer-title">About</p>
							<Link to="/">
								<div className="footer-a">Our story</div>
							</Link>
							<Link to="/">
								<div className="footer-a">Cookie policy</div>
							</Link>
						</div>
						<div className="footer-feed">
							<p className="footer-title">We love feedback</p>
							<div className="footer-feed-p">
								ONESTEP is developed in Taiwan by passionate traveler. We always
								want to make it better. Please{" "}
								<a
								className="footer-feed-a"
								href="mailto:allie.shwu@gmail.com?subject=hey amazing ONESTEP team"
								>
								drop us some feedback
								</a>{" "}
								if you like :)
							</div>
						</div>
						<div className="footer-social">
							<img src="./imgs/fb.svg" />
							<img src="./imgs/ig.svg" />
						</div>
						<p className="copyright">&copy; ONESTEP 2020 </p>

					</div>
				</div>
			</div>
		)
    }
}

export default Content;
