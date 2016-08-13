"use strict";

import React, { Component } from 'react';

import Api from "../actions/api.js"

require('../../css/app.sass')
require('../../css/bootstrap.css')

class Login extends Component {


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
        <div className="title">SIGN UP </div>

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
            placeholder="6+ characters"
            type="password"
            onChange={(event) => this.setState({password: event.nativeEvent.text})}
            value={this.state.password} />

          <div className="input-label"> CONFIRM PASSWORD </div>
          <input
            className='form-control'
            type="password"
            onChange={(event) => this.setState({password_confirmation: event.nativeEvent.text})}
            value={this.state.password_confirmation} />

          <button className="submit btn btn-primary">
            <div>SIGN UP</div>
          </button>
        </form>
      </div>
      );
    }

};



export default Login