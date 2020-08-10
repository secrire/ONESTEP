import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import '../css/style.css';
import '../css/member.css';

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
        });
        
        let searchUserName= [];
        let searchUserUID= [];

        firebase.firestore().collection('users')
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
                for(let value of doc.data().username){
                    if(this.state.searchText.toLowerCase() === value.toLowerCase()){
                        console.log(doc.data().username);

                        searchUserName.push(doc.data().username);
                        searchUserUID.push(doc.id);
        
                        this.setState({
                            searchUserName: searchUserName,
                            searchUserUID: searchUserUID
                        }); 
                    }   
                }
          
            }) 
        });

        firebase.firestore().collection('trips')
        .onSnapshot(querySnapshot => {
            // let searchUserName=[];
            // let searchUserPic=[];
            querySnapshot.forEach(doc => {
                // planLikeStep.push(doc.data().planLike);
                if(document.getElementById(`search-input`).value == doc.data().tripName){
                // console.log(doc.data());

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
       
        this.setState({
            showSearchInput: true,
        });
    }

    render(){
        let searchPage = null;
        let searchUserBox = null;
        let searchTripBox = null;

        // console.log(this.state.searchUserName)
        // console.log(this.state.searchUserUID)

        if(this.state.searchUserName){
            searchUserBox = this.state.searchUserName.map((n, index)=>{
                <Link to={"/m"+this.state.searchUserUID[index]} key={this.state.searchUserUID[index]}>
                    <div className='search-user-box'>
                        <img className='search-user-img' src='./imgs/q.png'></img>
                        <div className='search-user-name'>{n}</div>
                    </div>
                </Link>
            })
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

        let searchInput = null;
        if(this.state.showSearchInput){
            searchInput =(
                <input onChange={this.updateSearchInput.bind(this)} className='search-input' id= 'search-input' placeholder='Search'/>
            )
        }
        return  <div className='search-component'>
                {searchInput}
                    <img onClick={this.search.bind(this)} className='search-icon' id='search-icon' src='./imgs/search.svg'/>
                {searchPage}
                </div>
    }
}
  

export default Search;
