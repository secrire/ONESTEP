import React from 'react';
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";


class User extends React.Component {
    constructor() {
        super();
        this.state = {
         email: '',
         password: ''
        };
    }

    updateInput(e){
        this.setState({
        //   [e.target.name]: e.target.value
            email: e.currentTarget.value,
            password: e.currentTarget.value
        });
      }

  signUp(e){
     e.preventDefault();
     console.log(this.state.email);

    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        firebase.firestore().collection('users')
        .doc()
        .set({
          email: this.state.email,
          password: this.state.password
          // name: name.value
        })
          console.log('member created');
      })
      .catch(err => {
        console.log(err.message);
      })
  }

    // addUser(e){
    //     e.preventDefault();
    //     const db = firebase.firestore();
    //     db.settings({
    //       timestampsInSnapshots: true
    //     });
    //     const userRef = db.collection('test1').add({
    //       fullname: this.state.fullname,
    //       email: this.state.email
    //     });  
    //     this.setState({
    //       fullname: '',
    //       email: ''
    //     });
    //   };

   

  render() {
    return (
        <div>
          <input
            type="email"
            className="email1"
            placeholder="email"
            onChange={this.updateInput.bind(this)}
            value={this.state.email}
          />
          <input
            type="text"
            name="password"
            placeholder="password"
            onChange={this.updateInput.bind(this)}
            value={this.state.password}
          />
          <button  onClick={this.signUp.bind(this)}>Submit</button>
        </div>
        );
      }
   }
export default User;