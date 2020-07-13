import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './member.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import TripID from "./TripID";



class MContent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userDisplayname:'',
            tripName:'',
            userTrips:[],
            tripIDs:[],
            isLoading: false
          };    
        }
    componentDidMount() {
        let user = firebase.auth().currentUser;
        console.log(user)    

        firebase.firestore().collection('users')
        // .where('logEmail','==',user.email)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                // console.log(doc.id, doc.data())
                // if(user.email === doc.data().email || user.email ===  doc.data().logEmail){
                //     this.setState({
                //         userDisplayname: doc.data().username
                //     });
                // document.getElementById('user-card-name').textContent = doc.data().username
                // }
                
            }) 
        });
        firebase.firestore().collection('trips').get()
        // .orderBy('time','desc')
        .then(querySnapshot => {
            let data=[];       // 放state前先foreach處理資料
            let tripID=[];
            querySnapshot.forEach(doc => {
                if(user.uid === doc.data().authorUid){
                    data.push(doc.data());
                    // console.log(doc.id,doc.data().tripName)
                    tripID.push(doc.id);  
                }
            })
            console.log(data) 
            this.setState({
                userTrips: data,
                tripIDs: tripID
            });
            console.log(this.state.userTrips)
            console.log(this.state.tripIDs)
        })
    
    }
    
    // addPlan(e){
    //     e.preventDefault();
    //     // firebase.firestore().collection('trips').doc('BJtEvs1hzD8qZWutOLW1')
    //     // .collection('plan').doc()
    //     // .set({
    //     //     location: ''
    //     // })
    //     console.log('db add plan subcollection ok');  
    //     // document.getElementById(`card-add-plan`).style.display ='none';
    //     this.setState({
    //         isaddedPlan: true
    //     });
    // } 
    
    // addTrack(e){
    //     e.preventDefault();   
    //     firebase.firestore().collection('trips').doc('BJtEvs1hzD8qZWutOLW1')
    //     .collection('track')
    //     .doc()
    //     .set({
    //         location: '',
    //     //     stepName:  document.getElementById(`add-step-name`).value,
    //     //     stepArrDate: document.getElementById(`add-sum-input`).value,
    //     //     stepArrTime: document.getElementById(`add-sum-input`).value,
    //     //     stepDepDate: document.getElementById(`add-sum-input`).value,
    //     //     stepDepTime: document.getElementById(`add-sum-input`).value,
    //     //     stepStory: document.getElementById(`add-start-input`).value,
    //     //     stepPic: ''
    //     })
    //     console.log('db add track subcollection ok');  
    //     // document.getElementById(`card-add-track`).style.display ='none';
    //     this.setState({
    //         isaddedPlan: true
    //     });
    // } 
     
    render() {
        // let content;
        // // let item;
        // if(this.state.isLoading === false){
        //     content = [];
        //     if(this.state.tripIDs.length >0){
        //         for(let i=0; i<this.state.tripIDs.length; i++){
        //         firebase.firestore().collection('trips').doc(this.state.tripIDs[i]).get()
        //         .then(
        //             (doc)=>{
        //                 console.log(doc.data())
        //                 let item = <Link to={'/'+this.state.tripIDs[i]} key={this.state.tripIDs[i]}>
        //                     <div className='card'>  
        //                         {/* <div className='card-title'>{doc.data().tripName}</div>
        //                         <div className='card-main'>
        //                             <div className='card-time'>{doc.data().tripStart}</div>
        //                             <div className='card-days'>18 days</div>
        //                         </div> */}
        //                         <img className='card-img' src='./imgs/b.JPG'/>
        //                     </div>
        //                     </Link>
        //                 content.push(item) 
        //                 console.log(content)
        //                 if(i=== this.state.tripIDs.length-2){
        //                     this.setState({isLoading: true})
        //                 }   
        //             }
        //         )
        //         }
    
        //     }
        // }else{content = ''}
       
        // console.log(content)
        let key=0;
        let renderUserTrips = this.state.userTrips.map((n)=>{
            return  <li key={key++}>
                        <Link to='/tripID'><div className='card'>  
                            <div className='card-title'>{n.tripName}</div>
                            <div className='card-main'>
                                <div className='card-time'>{n.tripStart}</div>
                                <div className='card-days'>18 days</div>
                            </div>
                            <img className='card-img' src='./imgs/b.JPG'/>
                        </div></Link>
                    </li>
        })
        
        let renderTripIDs = this.state.tripIDs.map((k)=>{
            // firebase.firestore().collection('trips').doc(k).get()
            // .then(
            //     (doc)=>{
            //         console.log(doc.data())
            //         console.log(renderTripIDs)
            //         // item = 
                    // return <Link to={'/'+k} key={k}>
                    //     <div className='card'>  
                    //         {/* <div className='card-title'>{doc.data().tripName}</div>
                    //         <div className='card-main'>
                    //             <div className='card-time'>{doc.data().tripStart}</div>
                    //             <div className='card-days'>18 days</div>
                    //         </div> */}
                    //         <img className='card-img' src='./imgs/b.JPG'/>
                    //     </div>
                    //     </Link>
                    // content.push(item) 
                    // console.log(content)   
                    
            //     }
            // )
            
            return  <li key={key++}>
                        <Link to={'/'+k} className='card'>
                        
                        {/* {renderUserTrips} */}
                        </Link>
                    </li>
        })
        
        
        // console.log(this.props)  
        return <div className='content'>
                    <div className='user-total-trip'>
                        <div className='user-card'>
                            <img className='user-card-img' src='./imgs/b.JPG'></img>
                            <div id='user-card-name'>{this.state.userDisplayname}</div>
                            <div className='user-card-statis'>
                                <div className='user-card-like'>0 likes</div>
                                <div className='user-card-trip'>{this.state.userTrips.length} trips</div>
                            </div>
                        </div>
                        <div className='user-title'>Trips</div>
                        
                        <ul className='cards'>
                            {renderTripIDs}
                            {/* {content} */}
                            {renderUserTrips}
                            {/* <li><Link to='/tripID'><div className='card'>  
                                <div className='card-title'>{this.state.tripName}</div>
                                <div className='card-main'>
                                    <div className='card-time'>July 2020</div>
                                    <div className='card-days'>18 days</div> */}
                                    {/* <div onClick={this.addPlan.bind(this)} id='card-add-plan'>Plan</div>
                                    <div onClick={this.addTrack.bind(this)} id='card-add-track'>Track</div> */}
                                {/* </div>
                                <img className='card-img' src='./imgs/b.JPG'></img>
                            </div></Link></li> */}
                        </ul>
                    </div>
                </div>
    }
}  

export default MContent;   

