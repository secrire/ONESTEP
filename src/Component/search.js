import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import '../css/style.css';
import '../css/member.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

class Search extends React.Component{
    constructor(props){
        super(props);

        this.state = ({
        })
    }

    updateSearchInput(e){
        this.setState({
            searchText: e.target.value,
        });
        
        let searchUserUID = [];
        let searchUserName = [];
        let searchUserImg = [];

        firebase
            .firestore()
            .collection('users')
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach(doc => {
                    for(let value of doc.data().username){
                        if(this.state.searchText.toLowerCase() == value.toLowerCase()){
                            searchUserUID.push(doc.id);
                            searchUserName.push(doc.data().username);
                            searchUserImg.push(doc.data().profilePic);
                        }   
                    }
                }) 
                this.setState({
                    searchUserUID: searchUserUID,
                    searchUserName: searchUserName,
                    searchUserImg: searchUserImg,
                }); 
            });

        let searchTripID = [];
        let searchTripName = [];
        let searchTripImg = [];
        
        firebase
            .firestore()
            .collection('trips')
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach(doc => {       
                        if(this.state.searchText.toLowerCase() === doc.data().tripName.toLowerCase()){
                            
                            searchTripID.push(doc.id);
                            searchTripName.push(doc.data().tripName);
                            searchTripImg.push(doc.data().coverPic);
                        
                        }       
                }) 
                this.setState({
                    searchTripID: searchTripID,
                    searchTripName: searchTripName,
                    searchTripImg: searchTripImg,
                }); 
            }); 
    }

    search(e){
        e.preventDefault();
       
        this.setState({
            showSearchInput: true,
        });
    }

    render(){
        console.log(this.state.searchTripName)
        console.log(this.state.searchTripImg)

        let searchPage = null;
        let searchUserBox = null;
        let searchTripBox = null;

        let searchUserImg = (
            <div className="search-user-noimg">
                <img className="search-user-noimg-icon" src="./imgs/whiteprofile.svg" />
            </div>
        );

        if(this.state.searchUserName){
            searchUserBox = this.state.searchUserName.map((n, index)=>{
                if(this.state.searchUserImg[index]!== undefined){
                    searchUserImg = <img className='search-user-img' src={this.state.searchUserImg[index]} key={this.state.searchUserImg[index]} />
                }

                return(
                    <Link to={"/m"+this.state.searchUserUID[index]} key={this.state.searchUserUID[index]}>
                        <div className='search-user-box'>
                            {searchUserImg}
                            <div className='search-user-name'>{n}</div>
                        </div>
                    </Link>
                )    
            })
        }

        let searchTripImg = (
            <div className="search-trip-noimg" />        
        );

        if(this.state.searchTripName){
            searchTripBox = this.state.searchTripName.map((n, index)=>{
                if(this.state.searchTripImg[index]!== undefined){
                    searchTripImg = <img className='search-user-img' src={this.state.searchTripImg[index]} key={this.state.searchTripImg[index]} />
                }

                return(
                    <Link to={"/"+this.state.searchTripID[index]} key={this.state.searchTripID[index]}>
                        <div className='search-trip-box'>
                            {searchTripImg}
                            <div className='search-user-name'>{n}</div>
                        </div>
                    </Link>
                )    
            })
        }
        
        if(this.state.searchText){
            searchPage = (
                <div id='search-page'>
                    <div className='search-pop'>
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
