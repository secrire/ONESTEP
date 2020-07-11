import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './style.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

class Content extends React.Component{
    constructor(props){
      super(props);
  }
    render(){
      return <div className='content'>
              <div className='favs-title'>OUR FAVs</div>
                <div className='favs'>
                    <a className='fav'>
                      <div className='fav-who'>
                        <img className='fav-profile' src='./imgs/a.JPG'></img>
                        <div className='fav-name'>aa aa</div>
                      </div>
                      <div className='fav-main'>  
                      <div className='fav-title'>italy gelato</div>
                      <img className='fav-img' src='./imgs/b.JPG'></img>
                      </div>
                      <div className='fav-content'>three scoops every day</div>
                    </a>
                    <a className='fav'>
                      <div className='fav-who'>
                          <img className='fav-profile' src='./imgs/a.JPG'></img>
                          <div className='fav-name'>aa aa</div>
                      </div> 
                      <div className='fav-main'>  
                      <div className='fav-title'>italy gelato</div>
                      <img className='fav-img' src='./imgs/b.JPG'></img>
                      </div>
                      <div className='fav-content'>three scoops every day</div>
                    </a>
                    <a className='fav'>
                      <div className='fav-who'>
                        <img className='fav-profile' src='./imgs/a.JPG'></img>
                        <div className='fav-name'>aa aa</div>
                      </div> 
                      <div className='fav-main'>  
                      <div className='fav-title'>italy gelato</div>
                      <img className='fav-img' src='./imgs/b.JPG'></img>
                      </div>
                      <div className='fav-content'>three scoops every day</div>
                    </a>
                </div>
              
                <div className='pops-title'>MOST POPs</div>
                <div className='pops'>
                    <a className='pop'>
                      <div className='pop-who'>
                        <img className='pop-profile' src='./imgs/a.JPG'></img>
                        <div className='pop-name'>bb bb</div>
                      </div> 
                      <div className='pop-main'>  
                      <div className='pop-title'>italy gelato</div>
                      <img className='pop-img' src='./imgs/a.JPG'></img>
                      </div>
                      <div className='pop-content'>everything so quiet</div>
                    </a>
                    <a className='pop'>
                      <div className='pop-who'>
                        <img className='pop-profile' src='./imgs/a.JPG'></img>
                        <div className='pop-name'>bb bb</div>
                      </div> 
                      <div className='pop-main'>  
                      <div className='pop-title'>italy gelato</div>
                      <img className='pop-img' src='./imgs/a.JPG'></img>
                      </div>
                      <div className='pop-content'>everything so quiet</div>
                    </a>
                    <a className='pop'>
                      <div className='pop-who'>
                        <img className='pop-profile' src='./imgs/a.JPG'></img>
                        <div className='pop-name'>bb bb</div>
                      </div> 
                      <div className='pop-main'>  
                      <div className='pop-title'>italy gelato</div>
                      <img className='pop-img' src='./imgs/a.JPG'></img>
                      </div>
                      <div className='pop-content'>everything so quiet</div>
                    </a>
                </div>
  
                <div className='footer'>
                &copy; 2020. All rights reserved.
                </div>
             </div>
  }
  }

   export default Content;
