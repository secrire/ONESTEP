import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './eachTrip.css';
// import './style.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";


class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state ={
        
        };
    }
    componentDidMount() {
        let urlUserUID = new URL(location.href).pathname.substr(2);

        let user = firebase.auth().currentUser;
        console.log('ffffffffff',user)
        if(user){
            firebase.firestore().collection('users')
            .where('email','==',user.email)
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach(doc => {
                    // console.log(doc.data())
                    this.setState({
                        currentUser: doc.data(),
                        currentUserUid: doc.id
                    });   
                })
                document.getElementById('profileUsername').value = this.state.currentUser.username; 
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

    hidePage(e){
        e.preventDefault();
        document.getElementById('profile-page').style.display ='none';
    }

    uploadProfilePic(e){
        e.preventDefault();
        let storage = firebase.storage();
        let file = e.target.files[0];
        let storageRef = storage.ref('pics/'+file.name);
    
        let pickedTripID = new URL(location.href).pathname.substr(1);
        console.log(this.state.currentUserUid);

    
        storageRef.put(file).then((snapshot) => {
          console.log('Uploaded', file.name);
    
          storageRef.getDownloadURL().then(
            (url) => {
            console.log('download'+url);

            localStorage.setItem('profilePic',url);
    
            this.setState({
              AddProfilePic: true,
            },() =>{
                document.getElementById('profile-pic').src = url;
            });
    
          }).catch((error) => {
            console.log('download fail'+error.message)
          });
        });
    }
    
    editProfile(e){
        e.preventDefault();
        console.log('ok')

        let profilePic='';
        if(localStorage.getItem('profilePic')){
            profilePic = localStorage.getItem('profilePic');
        }

        firebase.firestore().collection('users').doc(this.state.currentUserUid)
        .update({
            profilePic: profilePic
        })

        localStorage.removeItem('profilePic');  
        document.getElementById(`profile-page`).style.display ='none';
    }


    render() {
        
        console.log(this.props.state.currentUser)
        console.log(this.state.showProfilePage)

        let profilePic;
        if(this.props.state.currentUser){
            if(this.props.state.currentUser.profilePic || this.state.AddProfilePic){
                profilePic = (<img id='profile-pic' src={this.props.state.currentUser.profilePic}/>)
            }else{
                profilePic = ( <div className='profile-nopic'>
                                  <img className='profile-pic-icon' src='./imgs/whiteprofile.svg'/>
                               </div>
                )      
            }
        }

        let profileSetSubmit = <div className='profile-set-submit'>Save changes</div>
        if(this.state.AddProfilePic || this.state.profileUsername || this.state.profileCity || this.state.profileAbout){
            profileSetSubmit = <div onClick={this.editProfile.bind(this)} className='profile-set-submit-approve'>Save changes</div>
        }

        // let profileUsername = <input onChange={this.updateInput.bind(this)} type='text' className='profile-input' id='profileUsername'/>
        // if(this.props.state.currentUser){
        //     profileUsername = <input onChange={this.updateInput.bind(this)} type='text' className='profile-input' id='profileUsername' value={this.props.state.currentUser.username}/>
        // }

        return(  <div id='profile-page'>
                    <div className='profile-pop'>
                        <div onClick={this.hidePage.bind(this)} className='profile-close'>x</div>
                        <div className='add-step-title'>Profile settings</div>
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
                                        {/* <img className='step-upload-pic-icon' src='./imgs/bluecamera.svg'/> */}
                                    </label>
                                </div>
                                <input onChange={this.updateInput.bind(this)} type='text' className='profile-input' id='profileUsername'/>
                                <input onChange={this.updateInput.bind(this)} type='text' className='profile-input' id='profileCity'/>
                                <textarea onChange={this.updateInput.bind(this)} type='text' className='profile-about' id='profileAbout' placeholder='Description of yourself'/>
                            </div>
                        </div>  
                        {profileSetSubmit}       
                        {/* <div onClick={this.editProfile.bind(this)} className='profile-set-submit' aria-disabled='true'>Save changes</div> */}
                    </div>
                </div>
        )
    }
} 



export default Profile;
