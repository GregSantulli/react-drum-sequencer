"use strict";

import React, { Component } from 'react';
import {Link } from 'react-router'
import Api from "../actions/api.js"
require('../../css/app.sass')
import Login from './Login.js';
import Signin from './Signin.js';
import { EmailSignUpForm } from "redux-auth/material-ui-theme";



class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {records: null };
  }

  setUser(user){
    this.setState({user: user})
  }

  noUser(){
    this.setState({user: null})
  }


  componentWillMount() {
    if (false){
      var _this = this
      this.serverRequest = Api.get('/user').then((response) => {
        if (response.status == 200){
          response.json().then((json) => {
            this.setUser(json)
          })
        }
      })
    } else {
      this.noUser
    }
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  handleClick() {
    console.log(this)
  }
  playSound() {
    console.log(this)
  }





  render() {

    return (
        <div className="nav-bar">
        <Login/>
        <Signin/>

        </div>
    );
  }

};



export default NavBar