
import React, { Component } from 'react';


var Api = function(){
  this.baseUrl = 'http://localhost:3000'
  this.apiVersion = "v1"
  this.apiUrl = this.baseUrl + '/api/' + this.apiVersion
}

Api.prototype.signUp = function(params){
  console.log("signing up")
  var url = this.baseUrl + '/auth'
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  })
}

Api.prototype.get = function(endpoint, params, headers){
  var url = this.apiUrl + endpoint
  var options = {}
  options.method = "GET"
  if (headers) options.headers = headers
  if (params) options.body = JSON.stringify(params)
  return fetch(url, options)
}


export default new Api
