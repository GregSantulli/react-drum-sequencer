"use strict";

import React, { Component } from 'react';
import {Link } from 'react-router'
import Api from "../actions/api.js"
require('../../css/app.sass')
import SignUp from './SignUp.js';
import SignIn from './SignIn.js';
import { EmailSignUpForm } from "redux-auth/material-ui-theme";



class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  setUser(user){
    this.setState({user: user})
  }

  noUser(){
    this.setState({user: null})
  }


  componentWillMount() {
    var _this = this
    if (!this.state.user){
      Api.getUser()
        .then(function(user){
          _this.setUser(user)
        })
        .catch(function(e){
          _this.noUser()
        })
    }
  }

  componentWillUnmount() {
    // this.serverRequest.abort();
  }

  logOut(){
    var _this = this
    Api.signOut().then(function(data){
      console.log(data)
      _this.noUser()
    })

  }


  registrationPanel(){
    if (!this.state.user){
      return(
          <span className='registration-panel'>
            <SignUp
            setUser={this.setUser.bind(this)}/>
            <SignIn
            setUser={this.setUser.bind(this)}/>
          </span>
      )
    }
  }

  toggleUserMenu(){
    this.setState({
      menuVisible: !this.state.menuVisible
    })
  }

  menuDisplay(){
    return this.state.menuVisible ? "user-menu" : "user-menu hidden"
  }

  userPanel(){
    if (this.state.user){
      return(
        <div className="user-panel">
          <span className="email-display" onClick={this.toggleUserMenu.bind(this)}>
            {this.state.user.email}
            <span className="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>
          </span>
          <div className={this.menuDisplay()}>
            <div className="menu-item" onClick={this.logOut.bind(this)}> Logout </div>
          </div>
        </div>
      )
    }
  }






  render() {

    return (
        <div className="nav-bar">

        {this.registrationPanel()}

        {this.userPanel()}

        </div>
    );
  }

};



export default NavBar