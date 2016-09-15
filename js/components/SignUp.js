"use strict";

import React, { Component } from 'react';

import Api from "../actions/api.js"

import $ from 'jquery'


require('../../css/app.sass')
require('../../css/bootstrap.css')

class SignUp extends Component {


  constructor(props) {
      super(props);
      this.state = {
        hasSubmitted: false,
        errors: {},
      };
  }

  signUp(e){
    e.preventDefault()
    this.setState({hasSubmitted: true})
    var signUp = this
    if (this.validForm()){
      var params = {}
      params.email = this.state.email
      params.password = this.state.password
      params.password_confirmation = this.state.password_confirmation
      Api.signUp(params).then(function(response){
        signUp.props.setUser(response.data)
        Api.getRecords().then(function(data){
          console.log(data)
        })
      })
    }

  }

  currentlyErrors(){
    return !!(
      this.state.emailError ||
      this.state.passwordError ||
      this.state.passwordConfirmationError
    )
  }

  validForm(){
    return !!(
      this.state.email &&
      this.state.password &&
      this.state.password &&
      !this.currentlyErrors()
    )
  }


  validEmail(input) {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRegex.test(input);
  };


  emailInput(e){
    var newEmail = e.target.value
    var newState = {
      email: newEmail,
      emailError: this.validEmail(newEmail) ? false : "Please enter a valid email address"
    }
    this.setState(newState)
  }

  passwordInput(e){
    var newPassword = e.target.value
    var newState = {
      password: newPassword,
      passwordError: newPassword.length >= 6 ? false : "Must be at least 6 characters"
    }
    this.setState(newState)
  }

  passwordConfirmationInput(e){
    var password = e.target.value
    var newState = {
      password_confirmation: password,
      passwordConfirmationError: password == this.state.password ? false : "Password confirmation does not match"
    }
    this.setState(newState)
  }

  errorMessage(type){
    if (this.state.hasSubmitted && this.state.emailError){
      var message;
      switch (type) {
        case 'email':
          message = this.state.emailError
          break
        case 'password':
          message = this.state.passwordError
          break
        case 'passwordConfirmation':
          message = this.state.passwordConfirmationError
          break
      }
      return(
        <div className='form-error'>
          {message}
        </div>
      )
    }
  }

  formClass(error){
    return this.state.hasSubmitted && error ? 'form-group has-error' : 'form-group'
  }


  render() {
    return (
      <div className="form-container">
        <form className="sign-up">
        <div className="title">SIGN UP </div>


        <div className={this.formClass(this.state.emailError)}>
          <label className="control-label" htmlFor="sign-up-email-input"> EMAIL </label>
          {this.errorMessage('email')}
          <input
            id="sign-up-email-input"
            className='form-control'
            type='email'
            placeholder="example@email.com"
            onChange={this.emailInput.bind(this)}/>
        </div>


        <div className={this.formClass(this.state.passwordError)}>
          <label className="control-label" htmlFor="sign-up-password-input"> PASSWORD </label>
          {this.errorMessage('password')}
          <input
            id="sign-up-password-input"
            className='form-control'
            placeholder="6+ characters"
            type="password"
            onChange={this.passwordInput.bind(this)}/>
        </div>

        <div className={this.formClass(this.state.passwordConfirmationError)}>
          <label className="control-label" htmlFor="sign-up-password-confirmation-input"> CONFIRM PASSWORD </label>
          {this.errorMessage('passwordConfirmation')}
          <input
            id='sign-up-password-confirmation-input'
            className='form-control'
            type="password"
            onChange={this.passwordConfirmationInput.bind(this)} />
        </div>

          <button className="submit btn btn-primary" onClick={this.signUp.bind(this)}>
            <div>SIGN UP</div>
          </button>
        </form>
      </div>
      );
    }

};



export default SignUp