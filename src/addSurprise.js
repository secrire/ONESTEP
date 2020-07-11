import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './add.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

class AddSurprise extends React.Component {
    constructor(props){
          super(props);
        }
  
    render() {
      return  <div className='add-page'>
                  <div className='add-pop'>
                  <Link to='/member'> <div className='add-close'>x</div></Link>
                  <div className='add-title'>New Surprise</div>
                  <div className='add-name'>Trip name</div>
                  <input type='text' className='add-name-input' placeholder='e.g. Europe Train Tour'
                          // onChange={this.updateInput.bind(this)}
                          // value={this.state.username}
                          ></input>
                  <div className='add-sum'>Trip summary</div>
                  <input type='text' className='add-sum-input' placeholder='e.g. First Solo Trip With Luck'
                          // onChange={this.updateInput.bind(this)}
                          // value={this.state.username}
                          ></input>
                  <div className='add-when'>When?</div>
                  <div className='add-start'>Start date</div>
                  <input type='text' className='add-start-input' placeholder='5 July 2020'
                          // onChange={this.updateInput.bind(this)}
                          // value={this.state.username}
                          ></input>   
                  <div className='add-end'>End date</div>
                  <input type='text' className='add-end-input' placeholder='I have no idea'
                          // onChange={this.updateInput.bind(this)}
                          // value={this.state.username}
                          ></input>  
                  {/* <div className='who-can-see'>Who can see my trip</div>                */}
                  <div className='add-submit'>Add plan</div>
                  </div>
              </div>
        }
   }  


   export default AddPlan;
