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
      function myFunction() {
        var element = document.getElementById("elem");
        var desiredPosition = 500;
        var counter = document.getElementById("count");
        counter.innerHTML = 'pageyOffset: ' + window.pageYOffset;
        if (window.pageYOffset > desiredPosition) {
          element.style.cssText += "transform: matrix(1, 0, 0, 1, 0, 0); position: fixed; top: 20px;  right: 50%;margin-left: calc(100% - 50px) " ;
          document.getElementById("cover").style.cssText+='opacity:0.5'
        } else {
          element.style.cssText += 'transform: matrix(4.5, 0, 0, 4.5, 0, 170)';
          document.getElementById("cover").style.cssText+='opacity:0'
        }
      }
      window.onscroll = myFunction;
      
      return  <div className='banner'>
                 <div id="cover"></div>
                <div className='banner-top'>
                  <div className='banner-intro'>
                    <div className='intro-line1'>explore.</div>  
                    <div className='intro-line2'>SURPRISE</div>  
                    <input className='search'placeholder='explore...'/>
                  </div>
            
                  
                  <img className='banner-img' src='./imgs/b.JPG'></img>
                </div>
                <div id="elem">needaname</div>
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
               <p id = "count">pageYOffset: 0</p>
              </div>
  }
  }
  

export default Banner;
