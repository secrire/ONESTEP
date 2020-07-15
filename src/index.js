import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './style.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import Banner from "./banner";
import Content from "./content";
import MHeader from "./mem-header";
import MContent from "./mem-content";
import TripID from "./TripID";
import AddStep from "./AddStep";
import EditStep from "./EditStep";

// -----  firebase set ----- //
const firebaseConfig = {
  apiKey: "AIzaSyBBu-u6M_H7Prgya9WhkJ9AP0V7-0I_Ras",
  authDomain: "surprise-85f1d.firebaseapp.com",
  databaseURL: "https://surprise-85f1d.firebaseio.com",
  projectId: "surprise-85f1d",
  storageBucket: "surprise-85f1d.appspot.com",
  messagingSenderId: "432141103535",
  appId: "1:432141103535:web:30273aea341edd9958ff5a"
};

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

// -----  firebase storage  set ----- //
let storage = firebase.storage();



class Header extends React.Component{         
  constructor(props){
    super(props);
    // this.state = {
    //   isauthed: false
    // };    
  }

  showSignupPage(e){
    e.preventDefault();
    document.getElementById(`signup-page`).style.display ='block';
  }

  showLoginPage(e){
    e.preventDefault();
    document.getElementById(`login-page`).style.display ='block';
  }

  // checkEmailLogin(e){
  //   e.preventDefault();
  //   firebase.auth().onAuthStateChanged((user)=> {
  //     if (user) {
      //     firebase.firestore().collection('users')
      // .doc()
      // .set({
      //   username: this.state.username,
      //   email: this.state.email,
      //   password: this.state.password,
      //   isauthed: true
      // })
      //   this.setState({
      //     isauthed: true
      //   });
          
  //         db.collection('users').get().then(querySnapshot => {
  //           querySnapshot.forEach(doc => {
  //           console.log(doc.data().email);
  //             if(user.email === doc.data().email.toLowerCase()){
  //               console.log(`member：${doc.data().username}`)
  //             };  
  //           });  
  //         }) 
  //     }else {
  //       console.log(`No user is signed in.`)
  //     }
  //   });
  // }

  render(){
    // if(this.state.isauthed === true){
    //   return <Redirect to='/member'/>
    // }
    return  <div className='header'>
       <p><a href="mailto:">Send email</a></p>
              <Link to='/' className='logo'>needaname</Link>
              <div onClick={this.showLoginPage.bind(this)} className='login'>Log in</div>
              <div onClick={this.showSignupPage.bind(this)} className='signup'>Get started</div>
              <img className='log-icon' src='./imgs/q.png'/>
            </div>         
  }
}

class SignUp extends React.Component{
  constructor(props){
    super(props);
  }
  
  // ----- facebook sign up -----
  FBsignUp(e){
    e.preventDefault();

    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(token, user)
        console.log(`fb sign up`)
        firebase.firestore().collection('users')
        .doc(user.uid)
        .set({
          username: user.displayName,
          email: user.email,
          isauthed: true
        })

        // this.setState({
        //   username: user.displayName,
        //   email: user.email,
        //   isauthed: true
        // })
        console.log(`${user.displayName} fb sign up ok`)
      })
      .catch((error) => {
        var errorCode = error.code;
        var email = error.email;
        console.log(error.message);
      });
  }  

  // ----- email sign up -----
  emailSignUp(e){
    e.preventDefault();

    firebase.auth().createUserWithEmailAndPassword(this.props.state.email, this.props.state.password)
      .then(() => { 
        /*firebase.firestore().collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set({
          username: this.state.username,
          email: this.state.email,
          isauthed: true
        })        */
      })
      .catch(err => {
        console.log(err.message);
        alert(`${this.state.username} sign up noooooooo`)
      })
  }

  hideSignupPage(e){
    e.preventDefault();
    document.getElementById(`signup-page`).style.display ='none';
  }

  render(){
    if(this.props.state.islogin=== true){
      return <Redirect to='/member'/>
    }
    return    <div id='signup-page'>
                <div className='signup-pop'>
                  <div onClick={this.hideSignupPage.bind(this)} className='signup-close'>x</div>
                  <div className='signup-title'>New account</div>
                  <div className='signup-fb-btn'  onClick={this.FBsignUp.bind(this)}>Create new account with Facebook</div>
                  <div className='signup-fb-note'>We'll never post to Facebook without your permission.</div>
                  <div className='signup-or'>or</div>
                  <input type='text' className='signup-name' id='username' placeholder='Username'
                         onChange={this.props.updateInput} value={this.props.state.username}/>
                  <input type="email" className='signup-email' id='email' placeholder='Email' 
                         onChange={this.props.updateInput} value={this.props.state.email}/>
                  <input type='text' className='signup-psw' id='password' placeholder='Password'
                         onChange={this.props.updateInput} value={this.props.state.password}/>
                  <div onClick={this.emailSignUp.bind(this)} className='signup-submit'>Create new account</div>
                  <div className='signup-to-login'>
                    <div>Already have an account? Log in</div>
                  </div>
                </div>
              </div>
  }
} 

class Login extends React.Component{
  constructor(props){
    super(props);
  }

  //----- facebook log in -----
  FBlogin(e){
    e.preventDefault();
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider)
    .then((result) => {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(token, user);
      firebase.firestore().collection('users')
        .doc(user.uid)
        .set({
          username: user.displayName,
          email: user.email,
          isauthed: true
        })
      // this.setState({
      //   isauthed: true
      // });
      console.log(`fb login`)
    })
    .catch((error) => {
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(error.message);
    });
  }  
  // ----- email log in -----
  emailLogIn(e){
    e.preventDefault();

    firebase.auth().signInWithEmailAndPassword(this.props.state.logEmail, this.props.state.logPassword) 
    .then(() => {
      console.log('email log in ok');
    })
    .catch(err => {
    console.log(err.message);
    // alert('email / password is not correct')
    });
  }

  hideLoginPage(e){
    e.preventDefault();
    document.getElementById(`login-page`).style.display ='none';
  }

  render(){
    if(this.props.state.islogin=== true){
      return <Redirect to='/member'/>
    }
    return  <div id='login-page'>
                <div className='login-pop'>
                  <div onClick={this.hideLoginPage.bind(this)} className='signup-close'>x</div>
                  <div className='signup-title'>Log in to SURPRISE</div>
                  <div className='signup-fb-btn'  onClick={this.FBlogin.bind(this)}>Log in with Facebook</div>
                  <div className='signup-fb-note'>We'll never post to Facebook without your permission.</div>
                  <div className='signup-or'>or</div>
                  <input onChange={this.props.updateInput} id='logEmail' className='login-username' placeholder='Email or username'/>
                  <input onChange={this.props.updateInput} id='logPassword' className='login-psw' placeholder='Password'/>
                  <div onClick={this.emailLogIn.bind(this)} className='login-submit'>Log in</div>
                  <div className='signup-to-login'>
                    <div>New to SURPRISE?<Link to='/signUp'> Create an account</Link></div>
                  </div>
                </div>
            </div>
  }
} 

class App extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        username:'',
        email: '',
        password: '',
        logEmail:'',
        logPassword:'',
        tripIDs:[],
        islogin: null
       };
    }

    componentDidMount(){
      firebase.auth().onAuthStateChanged((user)=> {
        if (user) {
          console.log('Sign In', user);

          this.setState({
            islogin: true
          });

          if(this.state.logEmail ==='' && this.state.email !==''){
            firebase.firestore().collection('users')
            .doc(firebase.auth().currentUser.uid)
            .set({
              username: this.state.username,
              email: this.state.email,
              // isauthed: true,
              logEmail: this.state.logEmail
            })
          }else{
            firebase.firestore().collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
              // username: this.state.username,
              // email: this.state.email,
              // isauthed: true,
              logEmail: this.state.logEmail
            })
          }

          firebase.firestore().collection('trips')
          .orderBy('createTime','desc')
          .onSnapshot(querySnapshot => {      
            let tripID=[];
            querySnapshot.forEach(doc => {
              if(user.uid === doc.data().authorUid){
                tripID.push(doc.id);  
              }
            })
            this.setState({
              tripIDs: tripID
            });
            console.log(this.state.tripIDs)
          })
        }else {
          console.log(`No user is signed in.`, user)
        }
      });
    }

    updateInput(e){
      this.setState({
          [e.target.id]: e.target.value
      });
    }

    changeIslogin(){
      firebase.auth().signOut()
      .then(() => {
        console.log('logout ok');
        console.log(this.state)

        this.setState({
          islogin: false
        });
      })
      .catch(function(error) {
        console.log(error.message)
      });
    }
  
    // componentDidMount() {
    //   fetch("https://cwpeng.github.io/live-records-samples/data/content.json")
    //     .then(res => res.json())
    //     .then(
    //       (result) => {
    //         this.setState({
    //           chapters: result.chapters
    //         });
    //       },
        
    //       (error) => {
    //       }
    //     )
    // }
    // componentWillMount() {
    // }
    render() {
      let tripRoute =[];
      if(this.state.tripIDs!==[]){
        for( let i=0; i<this.state.tripIDs.length; i++){
          tripRoute.push(<Route path={'/'+this.state.tripIDs[i]}><MHeader changeIslogin={this.changeIslogin.bind(this)}  state={this.state}/><TripID state={this.state}/><AddStep/></Route>)
        }
      }
        return (
            <Router>
                {/* <Links chapters={this.state.chapters}/> */}
                <div>
                {/* <Switch>  */}
                <Route exact path='/'><Header/><Banner/><Content/><Login updateInput={this.updateInput.bind(this)} state={this.state}/><SignUp updateInput={this.updateInput.bind(this)} state={this.state}/></Route> 
                <Route path='/member'><MHeader changeIslogin={this.changeIslogin.bind(this)}  state={this.state}/><MContent/></Route>
                {tripRoute}
                {/* <Route path='/tripID'><MHeader/><TripID state={this.state}/><AddStep/></Route> */}
                {/* <Route path='/addStep'><MHeader/></Route> */}
                {/* <Route path='/signUp'><Header/><Banner/><Content/><SignUp/></Route> */}
                {/* <Route path='/login'><Header/><Banner/><Content/><Login/></Route> */}
                {/* </Switch> */}
                </div>
            </Router>
        );
    }
}

  
ReactDOM.render(<App/>, document.querySelector('#root'));