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
    .orderBy('planLike','desc').limit(4)
    .onSnapshot(querySnapshot => {
      let data=[];       
      let tripID=[];
      let authorUid=[];
      querySnapshot.forEach(doc => {
          data.push(doc.data());
          // console.log(doc.id,doc.data().tripName)
          tripID.push(doc.id);  
          authorUid.push(doc.data().authorUid)
      })
      this.setState({
          userTrips: data,
          tripIDs: tripID,
          authorUids: authorUid,
      }, () => {
        let authorName=[];       
        let authorPic=[];
        for(let i=0; i<this.state.authorUids.length; i++){
          firebase.firestore().collection('users')
          .onSnapshot(querySnapshot =>{
            
              querySnapshot.forEach(doc => {
                if(this.state.authorUids[i] === doc.id){
                  authorName.push(doc.data().username)
                  authorPic.push(doc.data().profilePic)
                } 
              })
              console.log(authorName);
              this.setState({
                authorNames: authorName,
                authorPics: authorPic
              })    
          });
        }
      }
      
      );
      console.log(this.state.authorNames)
      // console.log(this.state.userTrips)
    })

    
    
  }    
    render(){
      console.log(this.state.authorNames);

      let renderPopTrips;
      if(this.state.authorPics){
        renderPopTrips = this.state.userTrips.map((n, index)=>{
          return  <li key={this.state.tripIDs[index]} className='fav'>
                    <figure className='fav-main'>
                      <Link to={"/"+this.state.tripIDs[index]}>
                          <div className='fav-hover-layer'>   
                            <p>SEE TRIP</p>
                            <img src='./imgs/bluearrow.svg'/>
                          </div>
                      </Link>
                      <Link to={"/"+this.state.tripIDs[index]}>
                          {/* <div className='fav-main'>    */} 
                            <img className='fav-img' src={n.coverPic}></img>
                          {/* </div> */}
                      </Link>
                    </figure>
                          <div className='fav-info'>
                            <div className='fav-info-decoration'/>
                            <div className='fav-who'>
                              <img className='fav-user-pic' src={this.state.authorPics[index]}></img>
                              <div className='fav-name'>{this.state.authorNames[index]}</div>
                            </div>
                            <div className='fav-trip-name'>{n.tripName}</div> 
                            <div className='fav-content'>{n.tripSum}</div>
                          </div>                           
                  </li>
        })
      }
      
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
                  <div className='footer-content'>
                    <div className='footer-box'>
                      <p className='footer-title'>About</p>
                      <Link to='/'><div className='footer-a'>Our story</div></Link>
                      <Link to='/'><div className='footer-a'>Cookie policy</div></Link>
                      
                    </div>
                    <div className='footer-feed'>
                      <p className='footer-title'>We love feedback</p>
                      <div className='footer-feed-p'>EACHSTEP is developed in Taiwan by passionate traveler. We always want to make it better. Please <a className='footer-feed-a' href="mailto:allie.shwu@gmail.com">drop us some feedback</a> if you like :)</div>
                    </div>
                    <div className='footer-social'>
                        <img src="./imgs/fb.svg" />
                        <img src="./imgs/ig.svg" />
                    </div>
                    <p className='copyright'>&copy; EACHSTEP 2020 </p> 
  
                    {/* <div className='footer-box'>
                      <p>Connect with us</p>
                      <div className='menu-social'>
                        <img  src="./imgs/fb.svg" />
                        <img  src="./imgs/ig.svg" />
                      </div>  
                    </div>   */}
                  </div>
                  {/* <p className='copyright'>&copy; 2020. All rights reserved.</p> */}
                </div>
             </div>
  }
  }

   export default Content;
