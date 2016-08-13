"use strict";

import React, { Component } from 'react';

import Api from "../actions/api.js"

require('../../css/app.sass')
require('../../css/bootstrap.css')

class Signin extends Component {


  constructor(props) {
      super(props);
      this.state = {
          email: "",
          password: "",
          password_confirmation: "",
          hasSubmitted: false,
          errors: {},
      };
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
          onChange={(event) => this.setState({email: event.nativeEvent.text})}
          value={this.state.email}/>

          <div className="input-label"> PASSWORD </div>
          <input
            className='form-control'
            type="password"
            onChange={(event) => this.setState({password: event.nativeEvent.text})}
            value={this.state.password} />

          <button className="submit btn btn-success">
            <div>SIGN IN</div>
          </button>

        </form>
      </div>
      );
    }

};



export default Signin