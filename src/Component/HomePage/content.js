import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import '../../css/style.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const Content = () => {
  const [userTrips, setUserTrips] = useState([]);
  const [favTripIDs, setFavTripIDs] = useState([]);
  const [authorUids, setAuthorUids] = useState(null);
  const [authorNames, setAuthorNames] = useState(null);
  const [authorPics, setAuthorPics] = useState(null);

  useEffect(() => {
    firebase
      .firestore()
      .collection('trips')
      .orderBy('planLike', 'desc')
      .limit(4)
      .onSnapshot((querySnapshot) => {
        const data = [];
        const favTripID = [];
        const authorUid = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
          favTripID.push(doc.id);
          authorUid.push(doc.data().authorUid);
        });

        setUserTrips(data);
        setFavTripIDs(favTripID);
        setAuthorUids(authorUid);
        // this.setState(
        //   {
        //     userTrips: data,
        //     favTripIDs: favTripID,
        //     authorUids: authorUid,
        //   },
        //   () => {
        //     const authorName = [];
        //     const authorPic = [];
        //     for (let i = 0; i < this.state.authorUids.length; i++) {
        //       firebase
        //         .firestore()
        //         .collection('users')
        //         .onSnapshot((querySnapshot) => {
        //           querySnapshot.forEach((doc) => {
        //             if (this.state.authorUids[i] === doc.id) {
        //               authorName.push(doc.data().username);
        //               authorPic.push(doc.data().profilePic);
        //             }
        //           });
        //           this.setState({
        //             authorNames: authorName,
        //             authorPics: authorPic,
        //           });
        //         });
        //     }
        //   },
        // );
      });
  }, []);

  useEffect(() => {
    const authorName = [];
    const authorPic = [];
    if (authorUids) {
      for (let i = 0; i < authorUids.length; i++) {
        firebase
          .firestore()
          .collection('users')
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (authorUids[i] === doc.id) {
                authorName.push(doc.data().username);
                authorPic.push(doc.data().profilePic);
              }
            });
            setAuthorNames(authorName);
            setAuthorPics(authorPic);
          });
      }
    }
  }, [userTrips, favTripIDs, authorUids]);

  let renderPopTrips;
  let favUserImg;

  if (authorPics) {
    renderPopTrips = userTrips.map((n, index) => {
      if (authorPics[index]) {
        favUserImg = (
          <img className="fav-user-pic" src={authorPics[index]} alt="" />
        );
      } else {
        favUserImg = (
          <div className="fav-user-noimg">
            <img
              className="fav-user-img-icon"
              src="./imgs/whiteprofile.svg"
              alt=""
            />
          </div>
        );
      }
      return (
        <li key={favTripIDs[index]} className="fav">
          <figure className="fav-main">
            <Link to={`/${favTripIDs[index]}`}>
              <div className="fav-hover-layer">
                <p>SEE TRIP</p>
                <img src="./imgs/bluearrow.svg" alt="" />
              </div>
            </Link>
            <Link to={`/${favTripIDs[index]}`}>
              <div className="fav-main">
                <img className="fav-img" src={n.coverPic} alt="" />
              </div>
            </Link>
          </figure>
          <div className="fav-info">
            <div className="fav-info-decoration" />
            <div className="fav-who">
              {favUserImg}
              <div className="fav-name">{authorNames[index]}</div>
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
      <div className="favs-title-line" />
      <div className="favs">

        {renderPopTrips}

      </div>

      <div className="index-first-step-box">
        <img id="index-first-step-img" src="./imgs/a.jpg" alt="" />
        <div className="index-first-step-layer" />
        <div className="index-first-step-p">TAKE YOUR FIRST ONE STEP</div>
        {/* <div onClick={showSignupPage}  className='index-first-step-btn'>Register to create an account</div>  */}
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
              want to make it better. Please
              {' '}
              <a
                className="footer-feed-a"
                href="mailto:allie.shwu@gmail.com?subject=hey amazing ONESTEP team"
              >
                drop us some feedback
              </a>
              {' '}
              if you like :)
            </div>
          </div>
          <div className="footer-social">
            <img src="./imgs/fb.svg" alt="" />
            <img src="./imgs/ig.svg" alt="" />
          </div>
          <p className="copyright">&copy; ONESTEP 2020 </p>

        </div>
      </div>
    </div>
  );
};

export default Content;
