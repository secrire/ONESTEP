/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import '../css/eachTrip.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// let urlUserUID = new URL(location.href).pathname.substr(2);
const Profile = (props) => {
  const {
    currentUser, showProfilePage, hideProfilePage,
  } = props;
  const [profilePlace, setProfilePlace] = useState('');
  const [profileAbout, setProfileAbout] = useState('');
  const [profileUsername, setProfileUsername] = useState(null);
  // const [currentUser, setCurrentUser] = useState(null);
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [showSearchProfilePlaceResult, setShowSearchProfilePlaceResult] = useState(false);
  const [searchProfilePlace, setSearchProfilePlace] = useState([]);
  const [isAddProfilePic, setIsAddProfilePic] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  //   const updateInput = (e) => {
  //     this.setState({
  //       [e.target.id]: e.target.value,
  //     });
  //   }

  const updateProfilePlaceInput = (e) => {
    setProfilePlace(e.target.value);
    setShowSearchProfilePlaceResult(true);

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${profilePlace}.json?access_token=pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig&limit=8`)
      .then((res) => res.json())
      .then(
        (result) => {
          const data = [];
          data.push(result);

          const tempSearchProfilePlace = [];
          for (let i = 0; i < data[0].features.length; i++) {
            if (data[0].features[i].place_type[0] === 'region' || data[0].features[i].place_type[0] === 'country' || data[0].features[i].place_type[0] === 'place') {
              tempSearchProfilePlace.push(data[0].features[i]);
              setSearchProfilePlace(tempSearchProfilePlace);
            }
          }
        },
        (error) => {
          console.log(error.message);
        },
      );
  };

  const pickStepPlace = (e) => {
    e.preventDefault();
    setShowSearchProfilePlaceResult(false);
    const tempProfilePlace = e.target.getAttribute('place');
    setProfilePlace(tempProfilePlace);
  };

  const uploadProfilePic = (e) => {
    e.preventDefault();
    const storage = firebase.storage();
    const file = e.target.files[0];
    const storageRef = storage.ref(`pics/${file.name}`);

    storageRef.put(file).then((snapshot) => {
    //   console.log('Uploaded', file.name);
      storageRef.getDownloadURL()
        .then((url) => {
          // console.log('download'+url);
          setIsAddProfilePic(true);
          setProfilePic(url);
        }).catch((error) => {
          console.log(`download fail${error.message}`);
        });
    });
  };

  const editProfile = (e) => {
    e.preventDefault();

    if (profilePic) {
      firebase
        .firestore()
        .collection('users')
        .doc(currentUserUid)
        .update({
          profilePic,
        });
    }

    if (profileUsername) {
      firebase
        .firestore()
        .collection('users')
        .doc(currentUserUid)
        .update({
          username: profileUsername,
          place: profilePlace,
          about: profileAbout,
        });
    }

    // console.log('db edit profile ok');
    hideProfilePage();
  };

  let renderProfilePic;
  if (currentUser) {
    if (currentUser.profilePic || isAddProfilePic) {
      renderProfilePic = (<img id="profile-pic" src={profilePic} alt="" />);
    } else {
      renderProfilePic = (
        <div className="profile-nopic">
          <img className="profile-pic-icon" src="./imgs/whiteprofile.svg" alt="" />
        </div>
      );
    }
  }

  let profileSetSubmit = <div className="profile-set-submit">Save changes</div>;
  if (isAddProfilePic || profileUsername || profilePlace || profileAbout) {
    profileSetSubmit = <div onClick={() => editProfile()} className="profile-set-submit-approve">Save changes</div>;
  }

  const searchPlaceBox = searchProfilePlace ? searchProfilePlace.map((n) => (
    <div key={n} className="search-plan-place-box">
      <div onClick={this.pickStepPlace.bind(this)} className="search-plan-placeName" place={n.place_name} longitude={n.center[0]} latitude={n.center[1]}>
        {n.place_name}
      </div>
    </div>
  )) : null;

  const searchPlacePage = showSearchProfilePlaceResult ? (
    <div id="profile-search-place-pop">
      {searchPlaceBox}
    </div>
  ) : null;

  const profilePage = showProfilePage ? (
    <div id="profile-page">
      <div className="profile-pop">
        <div onClick={() => hideProfilePage()} className="profile-close">x</div>
        <div className="profile-pop-title">Profile settings</div>
        <div className="profile-container">
          <div className="profile-title-box">
            <div className="profile-title">Picture</div>
            <div className="profile-title">Username</div>
            <div className="profile-title">City</div>
            <div className="profile-title">About</div>
          </div>
          <div className="profile-input-box">
            <div className="profile-pic-box">
              {renderProfilePic}
              <label className="profile-pic-label">
                {' '}
                Upload a photo
                <input onChange={uploadProfilePic()} className="trip-cover-change-pic" id="uploadPicInput" type="file" />
              </label>
            </div>
            <input onChange={(e) => setProfileUsername(e.target.value)} type="text" className="profile-input" id="profileUsername" value={profileUsername} />
            <input onChange={() => updateProfilePlaceInput()} type="text" className="profile-input" id="profilePlace" value={profilePlace} />
            {searchPlacePage}
            <textarea onChange={(e) => setProfileAbout(e.target.value)} type="text" className="profile-about" id="profileAbout" placeholder="Description of yourself" value={profileAbout} />
          </div>
        </div>
        {profileSetSubmit}
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
              // setCurrentUser(doc.data());
              setCurrentUserUid(doc.id);
              setProfileUsername(doc.data().username);
              if (doc.data().profilePic) {
                setProfilePic(doc.data().profilePic);
              }
              if (doc.data().place) {
                setProfilePlace(doc.data().place);
              }
              if (doc.data().about) {
                setProfileAbout(doc.data().about);
              }
            }
          });
        });
    } else {
      console.log('not a member!!!');
    }
  }, []);

  return (
    <>
      {profilePage}
    </>
  );
};

export default Profile;
