import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './style.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

import Banner from "./banner";
import Content from "./content";
import MHeader from "./mem-header";
import MContent from "./mem-content";
import TripID from "./TripID";
import AddStep from "./AddStep";

// import AddTrack from "./addTrack";
// import addSurprise from "./addSurprise";

// -----  firebase set -----
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

class Header extends React.Component{         
  constructor(props){
    super(props);
    this.state = {
      isauthed: false
    };    
  }

  showSignupPage(e){
    e.preventDefault();
    document.getElementById(`signup-page`).style.display ='block';
  }

  // check if email login or not
  checkEmailLogin(e){
    e.preventDefault();
    firebase.auth().onAuthStateChanged((user)=> {
      if (user) {
          console.log(user);
          // alert(`${user.email} login ok`)

      //     firebase.firestore().collection('users')
      // .doc()
      // .set({
      //   username: this.state.username,
      //   email: this.state.email,
      //   password: this.state.password,
      //   isauthed: true
      // })
      //   console.log('member created');
      //   alert(`${this.state.username} login ok`)
      //   //  window.location = `/member.html`;
      //   this.setState({
      //     isauthed: true
      //   });
          // this.setState({
          //   isauthed: true
          // });
          
          db.collection('users').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
            console.log(doc.data().email);
              if(user.email === doc.data().email.toLowerCase()){
                console.log(`member：${doc.data().username}`)
                alert(`${doc.data().username} login ok`)
                document.getElementById(`login-page`).style.display ='none';
                this.setState({
                  isauthed: true
                });
              };  
            });  
          }) 
      }else {
        console.log(`No user is signed in.`)
        document.getElementById(`login-page`).style.display ='block';
      }
    });
  }

  render(){
    if(this.state.isauthed === true){
      return <Redirect to='/member'/>
    }
    return <div className='header'>
            <Link to='/' className='logo'>needaname</Link>
            <div onClick={this.checkEmailLogin.bind(this)} className='login'>Log in</div>
            <div onClick={this.showSignupPage.bind(this)} className='signup'>Get started</div>
            <img className='log-icon' src='./imgs/q.png'></img>  
           </div>         
  }
}

class SignUp extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      username:'',
      email: '',
      password: '',
      isauthed: false
    };
  }

  // ----- facebook sign up -----
  FBsignUp(e){
    e.preventDefault();

    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(token, user)

      firebase.firestore().collection('users')
      .doc(user.uid)
      .set({
        username: user.displayName,
        email: user.email,
        isauthed: true
      })
      alert(`fb sign up ok`)
      // document.getElementById(`signup-page`).style.display ='none';
      this.setState({
        isauthed: true
      });
    }).catch(function(error) {
      var errorCode = error.code;
      // The email of the user's account used.
      var email = error.email;
      console.log(error.message);
      });
  }  

  // ----- email sign up -----
  updateInput(e){
    this.setState({
        [e.target.id]: e.target.value
    });
  }

  signUp(e){
    e.preventDefault();
    console.log(this.state.username);

    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => { 
        firebase.firestore().collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set({
          username: this.state.username,
          email: this.state.email,
          isauthed: true
        })
        console.log('member created');
        console.log(`${this.state.username} login ok`)
        //  window.location = `/member.html`;
        this.setState({
          isauthed: true
        });
      })
      .catch(err => {
        console.log(err.message);
        alert(`${this.state.username} login noooooooo`)
      })
  }

  hideSignupPage(e){
    e.preventDefault();
    document.getElementById(`signup-page`).style.display ='none';
  }

  render(){
    if(this.state.isauthed === true){
      return <Redirect to='/member'/>
    }
    return  <div id='signup-page'>
                <div className='signup-pop'>
                  <div onClick={this.hideSignupPage.bind(this)} className='signup-close'>x</div>
                  <div className='signup-title'>New account</div>
                  <div className='signup-fb-btn'  onClick={this.FBsignUp.bind(this)}>Create new account with Facebook</div>
                  <div className='signup-fb-note'>We'll never post to Facebook without your permission.</div>
                  <div className='signup-or'>or</div>
                  <input type='text' className='signup-name' id='username' placeholder='Username'
                         onChange={this.updateInput.bind(this)}
                         value={this.state.username}></input>
                  <input type="email" className='signup-email' id='email' placeholder='Email' 
                         onChange={this.updateInput.bind(this)}
                         value={this.state.email}></input>
                  <input type='text' className='signup-psw' id='password' placeholder='Password'
                         onChange={this.updateInput.bind(this)}
                         value={this.state.password}></input>
                  <div onClick={this.signUp.bind(this)} className='signup-submit'>Create new account</div>
                  <div className='signup-to-login'>
                    <div>Already have an account?<Link to='/login'> Log in</Link></div>
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
  FBsignUp(e){
    e.preventDefault();
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(token, user)

    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log(error.message);
    });
  }  
  // ----- email log in -----
  emailLogIn(e){
    e.preventDefault();

    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password) 
    .then(() => {
      console.log('email log in ok');
    }).catch(err => {
    console.log(err.message);
    alert('email / password is not correct')
    });
  }
  hideLoginPage(e){
    e.preventDefault();
    document.getElementById(`login-page`).style.display ='none';
  }

  render(){
    return  <div id='login-page'>
                <div className='login-pop'>
                  <div onClick={this.hideLoginPage.bind(this)} className='signup-close'>x</div>
                  <div className='signup-title'>Log in to SURPRISE</div>
                  <div className='signup-fb-btn'  onClick={this.FBsignUp.bind(this)}>Log in with Facebook</div>
                  <div className='signup-fb-note'>We'll never post to Facebook without your permission.</div>
                  <div className='signup-or'>or</div>
                  <input className='login-username' placeholder='Email or username'></input>
                  <input className='login-psw' placeholder='Password'></input>
                  <div onClick={this.emailLogIn.bind(this)} className='login-submit'>Log in</div>
                  <div className='signup-to-login'>
                    <div>New to SURPRISE?<Link to='/signUp'> Create an account</Link></div>
                  </div>
                </div>
            </div>
  }
} 

{/* // class Links extends React.Component{
//     constructor(props){
//       super(props);
//   }
//   render(){
//       let link =[];
//       console.log(this.props)
//       if(this.props.chapters){
//           for(let i=0; i< this.props.chapters.length; i++){
//               link.push(<Link to={'/'+this.props.chapters[i].key} key={i}>{this.props.chapters[i].title}</Link>)
//           }
//       }
//       let key = 0
//       let renderLink = link.map((n)=><div key={key++}>{n}</div>)
//       console.log(renderLink)
//       return <div>
//             {renderLink}
//             </div>
//   }
// } */}

class App extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        username:'',
        email: '',
        password: '',
        isauthed: false
       };
    }
  
    componentDidMount() {
      //  firebase database 待用 -------------------  
      // // add data base  
      //   db.collection("users").add({
      //     first: "Ada",
      //     last: "Lovelace",
      //     born: 1815
      // })
      // .then(function(docRef) {
      //     console.log("Document written with ID: ", docRef.id);
      // })
      // .catch(function(error) {
      //     console.error("Error adding document: ", error);
      // });
      // // read data base
      // db.collection("users").get().then((querySnapshot) => {
      //   querySnapshot.forEach((doc) => {
      //       console.log( doc.id , doc.data());
      //   });
      // });
      //-------------------------------------
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
    //         this.setState({
    //           isLoaded: true,
    //         });
    //       }
    //     )
    // }
  
    // componentWillMount() {
    //   let ref = firebase.database().collection('test1');
    //   ref.get().then(querySnapshot => {
    //     querySnapshot.forEach(doc => {
    //     console.log(doc.id, doc.data());
    //     });
    //   });
    // }
    render() {
        return (
            <Router>
                {/* <Links chapters={this.state.chapters}/> */}
                <div>

                {/* <Switch>  */}
                <Route exact path='/public/index.html'><Header/><Banner/><Content/><Login/><SignUp/></Route> 
                <Route path='/member'><MHeader/><MContent/></Route>
                <Route path='/tripID'><MHeader/><TripID/><AddStep/></Route>
                {/* <Route path='/addStep'><MHeader/></Route> */}
                {/* <Route path='/signUp'><Header/><Banner/><Content/><SignUp/></Route> */}
                {/* <Route path='/login'><Header/><Banner/><Content/><Login/></Route> */}
                {/* {route} */}
                {/* </Switch> */}
                </div>
            </Router>
        );
    }
}

  
ReactDOM.render(<App/>, document.querySelector('#root'));