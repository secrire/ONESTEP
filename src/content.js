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

    this.state = {
      // userDisplayname:'',
      userTrips:[],
      tripIDs:[],
    };    
  }
  componentDidMount() {
    firebase.firestore().collection('trips')
    .orderBy('createTime','desc').limit(4)
    .onSnapshot(querySnapshot => {
        let data=[];       
        let tripID=[];
        querySnapshot.forEach(doc => {
            // if(urlUserUID === doc.data().authorUid){
                data.push(doc.data());
                // console.log(doc.id,doc.data().tripName)
                tripID.push(doc.id);  
            // }
        })
        this.setState({
            userTrips: data,
            tripIDs: tripID
        });
        console.log(this.state.userTrips)
    })
  }    
    render(){
      let renderPopTrips = this.state.userTrips.map((n, index)=>{
        return  <li key={this.state.tripIDs[index]} className='fav'>
                    <Link to={"/"+this.state.tripIDs[index]}>
        
                        <div className='fav-main'>   
                          {/* <div className='fav-title'>italy gelato</div> */} 
                          <img className='fav-img' src='./imgs/b.JPG'></img>
                        </div>
                        <div className='fav-who'>
                          <img className='fav-profile' src='./imgs/a.JPG'></img>
                          <div className='fav-name'>aa aa</div>
                        </div>
                        <div className='fav-trip-name'>{n.tripName}</div> 
                        <div className='fav-content'>{n.tripSum}</div>

                    </Link>
                </li>
    })
      return <div className='content'>
              <div className='favs-title'>POPULAR TRIPS</div>
                <div className='favs'>
                  {renderPopTrips}  
                    
                    {/* <a className='fav'>
                      <div className='fav-main'>   
                        <img className='fav-img' src='./imgs/b.JPG'></img>
                      </div>
                      <div className='fav-who'>
                        <img className='fav-profile' src='./imgs/a.JPG'></img>
                        <div className='fav-name'>aa aa</div>
                      </div>
                      <div className='fav-trip-name'>italy gelato</div> 
                      <div className='fav-content'>three scoops every day</div>
                    </a> */}


                    {/* <a className='fav'>
                      <div className='fav-who'>
                          <img className='fav-profile' src='./imgs/a.JPG'></img>
                          <div className='fav-name'>aa aa</div>
                      </div> 
                      <div className='fav-main'>  
                      <div className='fav-title'>italy gelato</div>
                      <img className='fav-img' src='./imgs/b.JPG'></img>
                      </div>
                      <div className='fav-content'>three scoops every day</div>
                    </a> */}
                </div>
              
                {/* <div className='pops-title'>MOST POPs</div>
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
                </div> */}
  
                <div className='footer'>
                &copy; 2020. All rights reserved.
                </div>
             </div>
  }
  }

   export default Content;
