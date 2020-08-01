import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './style.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import mapboxgl from 'mapbox-gl';

import Search from "./search";
import Banner from "./banner";
import Content from "./content";
import MHeader from "./mem-header";
import MContent from "./mem-content";
import TripID from "./TripID";


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

    this.state = {
      
    };
  }

  // componentDidMount(){
  //   let user = firebase.auth().currentUser;
  //   if(!user){
  //     console.log(document.getElementById("header"))
  //     document.getElementById("header").style.cssText += 'z-index: 1002;';
  //   } 
  // }


  showSignupPage(e){
    e.preventDefault();
    this.setState({
      showSignupPage: true,
    });
  }

  showLoginPage(e){
    e.preventDefault();
    this.setState({
      showLoginPage: true,
    });
  }

  loginToSignup(e){
    e.preventDefault();
    console.log(this.state)
    this.setState({
      showSignupPage: true,
      showLoginPage: false,
    });
  }

  signupToLogin(e){
    e.preventDefault();
    console.log(this.state)
    this.setState({
      showSignupPage: false,
      showLoginPage: true,
    });
  }

/*          --------------   S I G N    U P       --------------      */
  // ----- facebook sign up -----
  FBsignUp(e){
    e.preventDefault();

    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        var token = result.credential.accessToken;
        var user = result.user;

        console.log(user)
        // console.log(`fb sign up`)

        // firebase.firestore().collection('users')
        // .doc(user.uid)
        // .set({
        //   username: user.displayName,
        //   email: user.email,
        //   isauthed: true
        // })

        // this.setState({
        //   username: user.displayName,
        //   email: user.email,
        //   isauthed: true
        // })
        // console.log(`${this.state.username}`)
      })
      .catch((error) => {
        var email = error.email;
        console.log(error.message);
      });
  }  

  // ----- email sign up -----
  emailSignUp(e){
    e.preventDefault();

    firebase.auth().createUserWithEmailAndPassword(this.props.state.email, this.props.state.password)
      .then(() => { 
        console.log('email create member ok')
        document.getElementById(`username`).value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
      })
      .catch(err => {
        console.log(err.message);
        alert(`${this.state.username} sign up noooooooo`)
      })
  }
  
  hideSignupPage(e){
    e.preventDefault();
    // document.getElementById(`signup-page`).style.display ='none';
    this.setState({
      showSignupPage: false,
    });
  }



/*          --------------   L O G I N       --------------      */
  //----- facebook log in -----
  FBlogin(e){
    e.preventDefault();
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider)
    .then((result) => {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(user);

      // firebase.firestore().collection('users')
      //   .doc(user.uid)
      //   .set({
      //     username: user.displayName,
      //     email: user.email,
      //     // isauthed: true
      //   })
      // this.setState({
      //   logEmail: user.email
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
    document.getElementById('login-fail-msg').style.display = 'block';
    });
  }

  hideLoginPage(e){
    e.preventDefault();
    // document.getElementById(`login-page`).style.display ='none';
    this.setState({
      showLoginPage: false,
    });
  }



  render(){

    if(this.props.state.islogin === true){
      return <Redirect to={"/m"+this.props.state.userUid}/>
    }

    let signupPage =null;
    let signupSubmit=  <div onClick={this.emailSignUp.bind(this)} className='signup-submit'>Create new account</div>;

    if(this.state.showSignupPage === true){
      if(this.props.state.username && this.props.state.email && this.props.state.password){
        signupSubmit=  <div onClick={this.emailSignUp.bind(this)} className='signup-submit-approve'>Create new account</div>;
      }
      signupPage = (
        <div id='signup-page'>
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
            <input type='password' className='signup-psw' id='password' placeholder='Password: at least 6 characters'
                  onChange={this.props.updateInput} value={this.props.state.password}/>
            {/* <div className='signup-fb-note'>Password should be at least 6 characters</div> */}
            {signupSubmit}
            <div className='signup-to-login'>
              <p>Already have an account?</p>
              <div onClick={this.signupToLogin.bind(this)}>Log in</div>
            </div>
          </div>
        </div>    
      )
    }

    let loginPage =null;
    if(this.state.showLoginPage === true){
      loginPage = (
              <div id='login-page'>
                <div className='login-pop'>
                  <div onClick={this.hideLoginPage.bind(this)} className='signup-close'>x</div>
                  <div className='signup-title'>Log in to ONESTEP</div>
                  <div className='signup-fb-btn'  onClick={this.FBlogin.bind(this)}>Log in with Facebook</div>
                  <div className='signup-fb-note'>We'll never post to Facebook without your permission.</div>
                  <div className='signup-or'>or</div>
                  <input type='text' onChange={this.props.updateInput} id='logEmail' className='login-username' placeholder='Email'/>
                  <input type='password' onChange={this.props.updateInput} id='logPassword' className='login-psw' placeholder='Password'/>
                  <div id='login-fail-msg'>Sorry, your username or password is wrong.</div>
                  <div onClick={this.emailLogIn.bind(this)} className='login-submit'>Log in</div>
                  <div className='signup-to-login'>
                    <p>New to ONESTEP?</p>
                    <div onClick={this.loginToSignup.bind(this)}>Create an account</div>
                  </div>
                </div>
              </div>
      )
    }



    return  <div>
              <div id='header'>
                {/* <Link to='/' className='logo'></Link> */}
                {/* <input className='search'placeholder='Search'/>
                <img className='search-icon' src='./imgs/search.svg'/> */}
                <Search/>
                {/* <i className="fas fa-camera" style="user-select: auto;"></i> */}
                <div className='login-signup-box'>
                  <div onClick={this.showLoginPage.bind(this)} className='login'>Login</div>
                  <div className='login-signup-line'>/</div>
                  <div onClick={this.showSignupPage.bind(this)} className='signup'>Register</div>
                </div>
                
                {signupPage}
                {loginPage}
                <img className='log-icon' src='./imgs/q.png'/>
              </div>    
            </div>
  }
}

/*          --------------   S I G N    U P       --------------      */

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
        console.log('email create member ok')
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
      return <Redirect to={"/m"+this.props.state.userUid}/>
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
                  <input type='password' className='signup-psw' id='password' placeholder='Password'
                         onChange={this.props.updateInput} value={this.props.state.password}/>
                  <div onClick={this.emailSignUp.bind(this)} className='signup-submit'>Create new account</div>
                  <div className='signup-to-login'>
                    <div>Already have an account? Log in</div>
                  </div>
                </div>
              </div>
  }
} 

/*          --------------   L O G I N       --------------      */
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

      console.log(`fb login`)
    })
    .catch((error) => {
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
      return <Redirect to={"/m"+this.props.state.userUid}/>
    }
    return  <div id='login-page'>
                <div className='login-pop'>
                  <div onClick={this.hideLoginPage.bind(this)} className='signup-close'>x</div>
                  <div className='signup-title'>Log in to SURPRISE</div>
                  <div className='signup-fb-btn'  onClick={this.FBlogin.bind(this)}>Log in with Facebook</div>
                  <div className='signup-fb-note'>We'll never post to Facebook without your permission.</div>
                  <div className='signup-or'>or</div>
                  <input type='text' onChange={this.props.updateInput} id='logEmail' className='login-username' placeholder='Email or username'/>
                  <input type='password' onChange={this.props.updateInput} id='logPassword' className='login-psw' placeholder='Password'/>
                  <div onClick={this.emailLogIn.bind(this)} className='login-submit'>Log in</div>
                  <div className='signup-to-login'>
                    <div>New to SURPRISE?<Link to='/signUp'> Create an account</Link></div>
                  </div>
                </div>
            </div>
  }
} 

/*          --------------   A P P       --------------      */

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
        islogin: null,
        userUid:'',
        totalUserUIDs:[]
      };
    }

    componentDidMount(){

      firebase.firestore().collection('users')
      .onSnapshot(querySnapshot => {
        let totalUserUID=[];      
        querySnapshot.forEach(doc => {
        totalUserUID.push(doc.id);
        // console.log(doc.id,doc.data())
        })
        this.setState({
          totalUserUIDs: totalUserUID  
        });
        // console.log(this.state.totalUserUIDs)
      })      

      firebase.auth().onAuthStateChanged((user)=> {
        if (user) {
          console.log('Sign In', user);

          this.setState({
            islogin: true,
            userUid:user.uid,
          });

          console.log(this.state.userUid)
          console.log(user.photoURL)
          // console.log(this.state.email)

          if(this.state.logEmail ==='' && this.state.email !==''){
            firebase.firestore().collection('users')
            .doc(firebase.auth().currentUser.uid)
            .set({
              username: this.state.username,
              email: this.state.email,
              logEmail: this.state.logEmail,
              // planLike:[],
              // trackLike:[],
              // planSave:[],
              // trackSave:[],
            })
          }else if(user.photoURL){
            firebase.firestore().collection('users')
            .doc(firebase.auth().currentUser.uid)
            .set({
              username: user.displayName,
              email: user.email,
              logEmail: this.state.logEmail,
            })
          }else{
            firebase.firestore().collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
              // username: this.state.username,
              // email: this.state.email,
              logEmail: this.state.logEmail
            })
          }

          // firebase.firestore().collection('trips')
          // .orderBy('createTime','desc')
          // .onSnapshot(querySnapshot => {      
          //   let tripID=[];
          //   querySnapshot.forEach(doc => {
          //     // if(user.uid === doc.data().authorUid){
          //       tripID.push(doc.id);  
          //     // }
          //   })
          //   this.setState({
          //     tripIDs: tripID
          //   });
          //   console.log(this.state.tripIDs)
          // })
        }else {
          console.log(`No user is signed in.`, user)
        }
      });

      firebase.firestore().collection('trips')
      .orderBy('createTime','desc')
      .onSnapshot(querySnapshot => {      
        let tripID=[];
        querySnapshot.forEach(doc => {
          // if(user.uid === doc.data().authorUid){
            tripID.push(doc.id);  
          // }
        })
        this.setState({
          tripIDs: tripID
        });
        console.log(this.state.tripIDs)
      })

      console.log(this.state.userUid)
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

        this.setState({
          islogin: false
        });
        console.log(this.state)
      })
      .catch(function(error) {
        console.log(error.message)
      });
    }
  
    render() {
      // function borderHeader() {
      //   let header = document.getElementById("header");
      //   let desiredPosition = 300;
      //   if (window.pageYOffset > desiredPosition) {
      //     header.style.cssText += "box-shadow: 0px 0px 20px 0px #dbdbdb;" ;
      //   } else {
      //     header.style.cssText -= 'box-shadow: 0px 0px 20px 0px #dbdbdb;';
      //   }
      // }
      // window.onscroll = borderHeader;

      let tripRoute =[];
      console.log(this.state.tripIDs)
      if(this.state.tripIDs!==[]){
        for( let i=0; i<this.state.tripIDs.length; i++){
          tripRoute.push(<Route exact path={'/'+this.state.tripIDs[i]}><MHeader changeIslogin={this.changeIslogin.bind(this)}  state={this.state}/><TripID state={this.state}/></Route>)
        }
      }
      let totalUserUIDsRoute =[];
      if(this.state.totalUserUIDs!==[]){
        for( let i=0; i<this.state.totalUserUIDs.length; i++){
          if(this.state.totalUserUIDs[i]!== this.state.userUid){
            totalUserUIDsRoute.push(<Route exact path={'/m'+this.state.totalUserUIDs[i]}><MHeader changeIslogin={this.changeIslogin.bind(this)}  state={this.state}/><MContent state={this.state}/></Route>)
          }
        }
      }
        return (
            <Router>
                <div>
                {/* <Switch>  */}
                <Route exact path='/'><Header updateInput={this.updateInput.bind(this)} state={this.state}/><Banner/><Content/></Route> 
                <Route exact path={"/m"+this.state.userUid}><MHeader changeIslogin={this.changeIslogin.bind(this)}  state={this.state}/><MContent state={this.state}/></Route>
                {tripRoute}
                {totalUserUIDsRoute}
                {/* <Route path='/tripID'><MHeader/><TripID state={this.state}/><AddStep/></Route> */}
                {/* </Switch> */}
                </div>
            </Router>
        );
    }
}

  
ReactDOM.render(<App/>, document.querySelector('#root'));

{/* <Login updateInput={this.updateInput.bind(this)} state={this.state}/> */}
{/* <SignUp updateInput={this.updateInput.bind(this)} state={this.state}/> */}