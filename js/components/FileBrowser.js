"use strict";

import React, { Component } from 'react';
require('../../css/fileBrowser.sass')
import Api from "../actions/api.js"



class FileBrowser extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillMount() {
    var browser = this
    Api.call('GET', '/audio_files')
      .then(function(data){
        browser.setState({
          files: data
        })

      })
      .catch(function(e){
        console.log(e)
      })

  }

  componentWillUnmount() {

  }

  handleFileClick(){
    this.setState({
    })
  }


  allFiles(){
    if (!this.state.files){
      return
    }
    var browser = this
    this.state.files.map(function(file){
      return (
        <div className="file">{file.name}</div>
      );
    })
  }

  loadSound(file){
    this.props.loadSound(file)
  }


  render() {

    var allFiles;
    var browser = this

    if (this.state.files){
      allFiles = this.state.files.map(function(file, i){
        return (
          <div key={i} className="file-row" onClick={browser.loadSound.bind(browser, file)}>
            <div className="file-cell">{file.id}</div>
            <div className="file-cell">{file.name}</div>
          </div>
        );
      })
    }

    return (
      <div className="file-browser">
        {allFiles}
      </div>
    );
  }

};



export default FileBrowser