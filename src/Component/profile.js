import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import '../css/eachTrip.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

// let urlUserUID = new URL(location.href).pathname.substr(2);

class Profile extends React.Component {
    constructor(props){
        super(props);

        this.state ={
            profilePlace:'',
            profileAbout:'',
        };
    }

    componentDidMount() {
        let user = firebase.auth().currentUser;
        if(user){
            firebase
                .firestore()
                .collection('users')
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        if(doc.data().email.toLowerCase() === user.email){
                            this.setState({
                                currentUser: doc.data(),
                                currentUserUid: doc.id,
                                profileUsername: doc.data().username
                            }); 
                            if(doc.data().profilePic){
                                this.setState({
                                    profilePic: doc.data().profilePic
                                }); 
                            }    
                            if(doc.data().place){
                                this.setState({
                                    profilePlace: doc.data().place
                                }); 
                            }
                            if(doc.data().about){
                                this.setState({
                                    profileAbout: doc.data().about
                                }); 
                            }      
                        }   
                    })
                });
        }else{
            console.log('not a member!!!')
        } 
    }
    
    updateInput(e){
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    updateProfilePlaceInput(e){  
        this.setState({
            profilePlace: e.target.value,
            showSearchProfilePlaceResult: true
        });
    
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.profilePlace}.json?access_token=pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig&limit=8`)
        .then(res => res.json())
        .then(
        (result) => {
            let data = [];       
            data.push(result);

            let searchProfilePlace = [];
            for( let i=0; i< data[0].features.length; i++ ){
                if(data[0].features[i].place_type[0]=== 'region' || data[0].features[i].place_type[0]=== 'country' || data[0].features[i].place_type[0]=== 'place'){
                    searchProfilePlace.push(data[0].features[i]);
                    this.setState({
                        searchProfilePlace: searchProfilePlace
                    });
                }
            }
        },
        (error) => {
            console.log(error.message)
        }
        )
    }

    pickStepPlace(e){
        e.preventDefault();

        this.setState({
            showSearchProfilePlaceResult: null,
            profilePlace: e.target.getAttribute('place'),
        });
    }

    uploadProfilePic(e){
        e.preventDefault();
        let storage = firebase.storage();
        let file = e.target.files[0];
        let storageRef = storage.ref('pics/'+file.name);

        storageRef.put(file).then((snapshot) => {
            console.log('Uploaded', file.name);
        
            storageRef.getDownloadURL()
            .then((url) => {
                    console.log('download'+url);
            
                    this.setState({
                        isAddProfilePic: true,
                        profilePic: url,
                    });
            }).catch((error) => {
                console.log('download fail'+error.message);
            });
        });
    }
    
    editProfile(e){
        e.preventDefault();

        let profilePic='';
        if(this.state.profilePic){
            profilePic = this.state.profilePic;
            firebase
                .firestore()
                .collection('users')
                .doc(this.state.currentUserUid)
                .update({
                    profilePic: profilePic
                })
        }

        if(this.state.profileUsername){
            firebase
                .firestore()
                .collection('users')
                .doc(this.state.currentUserUid)
                .update({
                    username: this.state.profileUsername,
                    place: this.state.profilePlace,
                    about: this.state.profileAbout,
                })
        }
    
        console.log('db edit profile ok');
        this.props.hideProfilePage(e);
    }


    render() {
        let profilePic;
        if(this.props.state.currentUser){
            if(this.props.state.currentUser.profilePic || this.state.isAddProfilePic){
                profilePic = (<img id='profile-pic' src={this.state.profilePic}/>)
            }else{
                profilePic = ( <div className='profile-nopic'>
                                  <img className='profile-pic-icon' src='./imgs/whiteprofile.svg' />
                               </div>
                )      
            }
        }

        let profileSetSubmit = <div className='profile-set-submit'>Save changes</div>
        if(this.state.isAddProfilePic || this.state.profileUsername || this.state.profilePlace || this.state.profileAbout){
            profileSetSubmit = <div onClick={this.editProfile.bind(this)} className='profile-set-submit-approve'>Save changes</div>
        }

        let searchPlaceBox = null;
        let searchPlacePage =null;
        let key=0;

        if(this.state.searchProfilePlace){
        searchPlaceBox = this.state.searchProfilePlace.map((n)=>{
            return  <div key={key++} className='search-plan-place-box'>   
                        <div onClick={this.pickStepPlace.bind(this)} className='search-plan-placeName' place={n.place_name} longitude={n.center[0]} latitude={n.center[1]}>{n.place_name}
                        </div>
                    </div>
        })
        }

        if(this.state.showSearchProfilePlaceResult){
            searchPlacePage = (
                <div id='profile-search-place-pop'>
                {searchPlaceBox} 
                </div>
            )
        }else{
            searchPlacePage = null;
        }

        let profilePage = null;
        if(this.props.state.showProfilePage){
            profilePage =(
                <div id='profile-page'>
                    <div className='profile-pop'>
                        <div onClick={this.props.hideProfilePage} className='profile-close'>x</div>
                        <div className='profile-pop-title'>Profile settings</div>
                        <div className='profile-container'>
                            <div className='profile-title-box'>
                                <div className='profile-title'>Picture</div>
                                <div className='profile-title'>Username</div>
                                <div className='profile-title'>City</div>
                                <div className='profile-title'>About</div>
                            </div>
                            <div className='profile-input-box'>
                                <div className='profile-pic-box'>
                                    {profilePic}
                                    <label className='profile-pic-label'> Upload a photo
                                        <input onChange={this.uploadProfilePic.bind(this)} className='trip-cover-change-pic' id="uploadPicInput" type="file"/>
                                    </label>
                                </div>
                                <input onChange={this.updateInput.bind(this)} type='text' className='profile-input' id='profileUsername' value={this.state.profileUsername}/>
                                <input onChange={this.updateProfilePlaceInput.bind(this)} type='text' className='profile-input' id='profilePlace' value={this.state.profilePlace}/>
                                {searchPlacePage}
                                <textarea onChange={this.updateInput.bind(this)} type='text' className='profile-about' id='profileAbout' placeholder='Description of yourself' value={this.state.profileAbout}/>
                            </div>
                        </div>  
                        {profileSetSubmit}       
                    </div>
                </div>
            )
        }

        return(  
            <>
                {profilePage}
            </>
        )
    }
} 



export default Profile;
