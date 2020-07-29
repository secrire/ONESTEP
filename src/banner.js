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
        var desiredPosition = 240;
        // var counter = document.getElementById("count");
        // counter.innerHTML = 'pageyOffset: ' + window.pageYOffset;
        if (window.pageYOffset > desiredPosition) {
          element.style.cssText += "transform: matrix(1, 0, 0, 1, 0, 0); position: fixed; top: 20px; right: 47%; z-index: 5; " ;
          // document.getElementById("cover").style.cssText+='opacity:0.5'
        } else {
          element.style.cssText += 'transform: matrix(5, 0, 0, 6, 0, 60); position: fixed; top: 90px; right: 47%; z-index: 0';
          // document.getElementById("cover").style.cssText+='opacity:0'
        }
      }
      window.onscroll = myFunction;
      
      return  <div className='banner'>
                 {/* <div id="cover"></div> */}
                <img className='banner-img' src='./imgs/b.JPG'></img>
                {/* <div className='banner-top'> */}
                  {/* <div className='banner-intro'> */}
                    <div className='intro-line1'>wander</div>
                    <div className='intro-line2'>explore</div> 
                    <div className='intro-line3'>collect</div>  
                    {/* <div className='intro-line1'>collect</div>    */}
                    {/* <div className='intro-line2'>collect</div>   */}
                    {/* <input className='search'placeholder='explore...'/> */}
                  {/* </div> */}
                  <div className='banner-desc'>Plan, track and see the difference. Somewhere is called surprise. Plan, track and see the difference. Somewhere is called surprise.</div>                  
                  {/* <img className='banner-img' src='./imgs/b.JPG'></img> */}
                {/* </div> */}
                <div id="elem">A N A M E</div>
                <div className='features'>
                  <div className='feature'>
                    <div className='feature-title1'>plan or track</div>
                    <div className='feature-content'>keep track of your route and places you’ve visited.keep track of your route and places you’ve visited.
                    keep track of your route and places you’ve </div>
                  </div>
                  {/* <div className='feature'>
                    <div className='feature-title'>surprise</div>
                    <div className='feature-content'>keep track of your route and places you’ve visited.</div>
                  </div> */}
                  <div className='feature-sep'></div>
                  <div className='feature'>
                    <div className='feature-title2'>sharing is caring</div>
                    <div className='feature-content'>keep track of your route and places you’ve visited.keep track of your route and places you’ve visited.
                    keep track of your</div>
                  </div>
               </div>
               <p id = "count">pageYOffset: 0</p>
              </div>
  }
  }
  

export default Banner;
