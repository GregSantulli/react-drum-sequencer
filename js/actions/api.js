
import React, { Component } from 'react';
import $ from "jquery";
import Cookies from 'js-cookie';
import crypto from 'crypto';

var Api = function(){
  this.baseUrl = 'http://localhost:3000'
  this.apiVersion = "v1"
  this.apiUrl = this.baseUrl + '/api/' + this.apiVersion
  this.authHeaders = ["access-token", "token-type", "client", "expiry", "uid"]
}

Api.prototype.call = function(method, endpoint, params, headers){
  var api = this
  var promise = new Promise(function(resolve, reject){
    var options = {}
    options.url = api.apiUrl + endpoint
    options.type = method
    options.dataType = 'json'
    if (headers) options.headers = headers
    if (params) options.data = params
    $.ajax(options)
      .then(function(data){
        resolve(data)
      })
      .catch(function(e){
        reject(e)
      })
  })
  return promise
}

Api.prototype.secureCall = function(method, endpoint, params){
  var api = this
  return api.call(method, endpoint, params, api.getClientAuthHeaders())
}

Api.prototype.setClientAuthHeaders = function(request){
  for (var i = 0; i < this.authHeaders.length; i++) {
    var header = this.authHeaders[i]
    Cookies.set(header, request.getResponseHeader(header))
  };
}

Api.prototype.removeClientAuthHeaders = function(){
  for (var i = 0; i < this.authHeaders.length; i++) {
    var header = this.authHeaders[i]
    Cookies.remove(header)
  };
}


Api.prototype.getClientAuthHeaders = function(){
  var headers = {}
  for (var i = 0; i < this.authHeaders.length; i++) {
    var header = this.authHeaders[i]
    headers[header] = Cookies.get(header)
  };
  return headers
}

Api.prototype.signUp = function(params){
  var api = this
  var options = {}
  options.url = this.apiUrl + '/auth'
  options.type = "POST"
  options.data = params
  var promise = new Promise(function(resolve, reject){
    $.ajax(options).then(function(response, status, request){
      console.log(status)
      if (status == 'success'){
        api.setClientAuthHeaders(request)
        resolve(response)
      } else {
        reject(e)
      }
    })
  })
  return promise
}


Api.prototype.getRecords = function(){
  return this.call(
    "GET",
    '/records',
    null,
    this.getClientAuthHeaders()
  )
}


Api.prototype.signIn = function(params){
  var api = this
  var options = {}
  options.url = this.apiUrl + '/auth/sign_in'
  options.type = "POST"
  options.data = params
  var promise = new Promise(function(resolve, reject){
    $.ajax(options).then(function(response, status, request){
      if (status == 'success'){
        api.setClientAuthHeaders(request)
        resolve(response)
      } else {
        reject(response)
      }
    }).catch(function(e){
      reject(e.responseJSON)
    })
  })
  return promise
}

Api.prototype.signOut = function(){
  var api = this
  var options = {}
  options.url = this.apiUrl + '/auth/sign_out'
  options.type = "DELETE"
  var promise = new Promise(function(resolve, reject){
    api.secureCall('DELETE', '/auth/sign_out')
      .then(function(user){
        api.removeClientAuthHeaders()
        resolve(user)
      })
      .catch(function(e){
        reject(e)
    })
  })
  return promise
}

Api.prototype.getUser = function(){
  var api = this
  var promise = new Promise(function(resolve, reject){
    if (Cookies.get('uid')){
      api.call("POST", '/user', null, api.getClientAuthHeaders())
        .then(function(user){
          resolve(user)
        })
        .catch(function(e){
          api.removeClientAuthHeaders()
          reject(e)
      })
    } else {
      reject()
    }
  })
  return promise
}

Api.prototype.getInitialSequence = function(){
  return this.call('GET', '/sequences')
}


Api.prototype.getAwsUrl = function(file){
  var params = { upload: { filename: file.name } }
  return this.call('POST', '/samples/upload', params)
}

Api.prototype.uploadAudioFile = function(file) {
  var api = this
  var promise = new Promise(function(resolve, reject){
    api.uploadFileToS3(file)
      .then(function(data){
        var params = {
          audio_file: {
            name: file.name
          }
        }
        api.secureCall('POST', '/audio_files', params)
          .then(function(data){
            resolve(data)
          })
          .catch(function(e){
            reject(e)
          })
      })
      .catch(function(e){
        reject(e)
      })
  })
  return promise
};

Api.prototype.uploadFileToS3 = function(file){
  var api = this
  var promise = new Promise(function(resolve, reject){
    api.getAwsUrl(file).then(function(data){
      var request = new XMLHttpRequest();
      request.open('PUT', data.url, true);
      request.onload = function(data) {
        request.status === 200 ? resolve(data) : reject(request)
      };
      request.send(file);
    })
  })
  return promise
}


Api.prototype.saveSequence = function(sequence){
  var api = this
    , sequenceId = sequence.props.id
  api.call('PUT', '/sequences/' + sequenceId)
}

export default new Api
