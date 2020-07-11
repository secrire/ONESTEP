import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './style.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

class Banner extends React.Component{
    constructor(props){
      super(props);
  }
    render(){
      return  <div className='banner'>
        <Link to='/member'>mem</Link>
                <div className='banner-top'>
                  <div className='banner-intro'>
                  <div className='intro-line1'>explore.</div>  
                  <div className='intro-line2'>SURPRISE</div>  
                  <input className='search'placeholder='explore...'/>
                  </div>
                  <img className='banner-img' src='./imgs/b.JPG'></img>
                </div>
                <div className='features'>
                  <div className='feature'>
                    <div className='feature-title'>plan or track</div>
                    <div className='feature-content'>keep track of your route and places you’ve visited.</div>
                  </div>
                  <div className='feature'>
                    <div className='feature-title'>surprise</div>
                    <div className='feature-content'>keep track of your route and places you’ve visited.</div>
                  </div>
                  <div className='feature'>
                    <div className='feature-title'>sharing is caring</div>
                    <div className='feature-content'>keep track of your route and places you’ve visited.</div>
                  </div>
               </div>
              </div>
  }
  }
  

export default Banner;
