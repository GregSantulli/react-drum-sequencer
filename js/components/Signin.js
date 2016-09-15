"use strict";

import React, { Component } from 'react';
import Api from "../actions/api.js"


// import Api from "../actions/api.js"

require('../../css/app.sass')
require('../../css/bootstrap.css')

class SignIn extends Component {


  constructor(props) {
      super(props);
      this.state = {

      };
  }


  signIn(e){
    e.preventDefault()
    var signIn = this
    Api.signIn({
      email: this.state.email,
      password: this.state.password
    }).then(function(response){
      signIn.props.setUser(response.data)
    }).catch(function(e){
      console.log("SIGN IN ERROR")
      console.log(e)
    })
  }

  render() {
    return (
      <div className="form-container">
        <form className="sign-up">
        <div className="title">SIGN IN </div>

        <div className="input-label"> EMAIL </div>
        <input
          className='form-control'
          type='email'
          placeholder="example@email.com"
          onChange={(e) => this.setState({email: e.target.value})}/>

          <div className="input-label"> PASSWORD </div>
          <input
            className='form-control'
            type="password"
            onChange={(e) => this.setState({password: e.target.value})}/>

          <button className="submit btn btn-success" onClick={this.signIn.bind(this)}>
            <div>SIGN IN</div>
          </button>

        </form>
      </div>
      );
    }

};



export default SignIn