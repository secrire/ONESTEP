import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './style.css';
import './member.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

class Search extends React.Component{
    constructor(props){
        super(props);

        this.state = ({
            display: null,
        })
    }


    updateSearchInput(e){
        this.setState({
            searchText: e.target.value,
            // display: true,
        });
        console.log(this.state.searchText)

        console.log(document.getElementById(`search-input`).value)
        
        firebase.firestore().collection('users')
        .onSnapshot(querySnapshot => {
            // let searchUserName=[];
            // let searchUserPic=[];
            querySnapshot.forEach(doc => {
                // planLikeStep.push(doc.data().planLike);
                if(document.getElementById(`search-input`).value === doc.data().username){
                console.log(doc.id);

                this.setState({
                    searchUserName: doc.data().username,
                    // searchUserPic: 
                    searchUserUID: doc.id
                }); 
                }    
            }) 
        });

        firebase.firestore().collection('trips')
        .onSnapshot(querySnapshot => {
            // let searchUserName=[];
            // let searchUserPic=[];
            querySnapshot.forEach(doc => {
                // planLikeStep.push(doc.data().planLike);
                if(document.getElementById(`search-input`).value === doc.data().tripName){
                console.log(doc.data());

                this.setState({
                    searchTripName: doc.data().tripName,
                    // searchUserPic: 
                    searchTripID: doc.id
                }); 
                }    
            }) 
        }); 
    }

    search(e){
        e.preventDefault();
       
        console.log(document.getElementById(`search-input`).value)
       

    }

    render(){
        let searchPage = null;
        let searchUserBox = null;
        let searchTripBox = null;

        if(this.state.searchUserName){
            searchUserBox = (
                <Link to={"/m"+this.state.searchUserUID}>
                    <div className='search-user-box'>
                        <img className='search-user-img' src='./imgs/q.png'></img>
                        <div className='search-user-name'>{this.state.searchUserName}</div>
                    </div>
                </Link>
            )
        }
        if(this.state.searchTripName){
            searchTripBox = (
                <Link to={"/"+this.state.searchTripID}>
                    <div className='search-trip-box'>
                        <img className='search-user-img' src='./imgs/q.png'></img>
                        <div className='search-user-name'>{this.state.searchTripName}</div>
                    </div>
                </Link>
                
            )
        }
        
        if(this.state.searchText){
            searchPage = (
                <div id='search-page'>
                    <div className='search-pop'>
                        {/* <div className='search-close'>x</div> */}
                        <div className='search-title'>Results</div>
                        <div className='search-container'>
                            {searchUserBox}
                            {searchTripBox}
                        </div>    
                    </div>
                </div>
            )
        }else{
            searchPage = null;
        }

      
      
        return  <div className='search-component'>
                    <input onChange={this.updateSearchInput.bind(this)} className='search-input' id= 'search-input' placeholder='Search'/>
                    <img onClick={this.search.bind(this)} className='search-icon' src='./imgs/search.svg'/>
                

                {searchPage}
                
                </div>
    }
}
  

export default Search;
