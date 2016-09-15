"use strict";

import React, { Component } from 'react';
import Pad from './Pad.js';
import Api from "../actions/api.js"
require('../../css/track.sass')
import $ from "jquery";



class Track extends Component {

  constructor(props) {
    super(props);
    this.state = {
      path: this.props.path,
      name: this.props.name,
      pattern: this.props.pattern || {},
      playing: this.props.playing,
      gain: this.props.context.createGain(),
      volume: 1
    }
  }

  loadSound(){
    if (!this.state.path){
      return
    }
    var track = this
    var request = new XMLHttpRequest();
    request.open("GET", track.state.path, true);
    request.responseType = "arraybuffer";
    request.onload = function(){
      track.props.context.decodeAudioData(request.response, function(audioBuffer){
        track.setState({buffer: audioBuffer})
      });
    }
    request.send();
  }

  playSound() {
    if (this.state.buffer) {
      var sound = this.props.context.createBufferSource();
      sound.buffer = this.state.buffer;
      sound.connect(this.state.gain);
      sound.start(0);
    } else {
      this.loadSound()
    }
  }

  playCurrentPosition(){
    var position = this.props.position
    var pattern = this.state.pattern
    if (pattern[position]){
      this.playSound()
    }
  }

  componentWillMount() {
    this.loadSound()
  }

  componentDidMount() {
    this.state.gain.connect(this.props.input)
  }

  componentWillReceiveProps(newProps){
    if (this.props.playing && (this.props.position != newProps.position)){
      this.playCurrentPosition()
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.path != this.state.path){
      this.loadSound()
    }
  }

  componentWillUnmount() {

  }

  changePattern(i){
    var newPattern = this.state.pattern
    newPattern[i] = !newPattern[i]
    this.props.changeTrackPattern(this)
    this.setState({pattern: newPattern})
  }

  shouldComponentUpdate(newProps, newState){
    var newFile = this.state.path != newState.path
    var newPosition = this.props.position == newProps.position
    // console.log(newFile || newPosition)
    return newFile || newPosition
  }

  padActive(i){
    return !!this.state.pattern[i]
  }

  updateVolume(e){
    this.setState({volume: e.target.value})
    this.state.gain.gain.value = e.target.value
  }

  getVolume(){
    return this.state.gain.gain.value
  }

  getFile(e){
    var track = this
    var file = e.target.files[0]
    if (!file) {
      return;
    }
    Api.uploadAudioFile(file)
      .then(function(data){
        track.setState({
          audio_file_id: data.id,
          name: data.name,
          path: data.url
        })
      })
      .catch(function(e){
        console.log(e)
      })

    // // use below to temorarily add lcoal file to sequencer without uploading to s3
    // var track = this
    // var reader = new FileReader();
    // reader.onload = function(e) {
    //   var contents = e.target.result;
    //   track.props.context.decodeAudioData(contents, function(audioBuffer){
    //     track.setState({
    //       buffer: audioBuffer,
    //       name: file.name
    //     })
    //   })
    // };
    // reader.readAsArrayBuffer(file);
  }

  saveTrack(){
    var patternString = ''
    for (var i = 0; i < this.props.stepLength; i++) {
      patternString += (this.state.pattern[i] ? '1' : '0')
    };
    var _this = this
    var params = {
      track: {
        pattern: patternString,
        audio_file_id: this.state.audio_file_id
      }
    }
    Api.call('POST', '/tracks', params)
      .then(function(data){
        console.log(data)
      })
      .catch(function(e){
        console.log(e)
      })
  }


  render() {

    var pads = []
    for (var i = 0; i < this.props.stepLength; i++) {
      pads.push(
        <Pad
          key={i}
          playSound={this.playSound.bind(this)}
          changePattern={this.changePattern.bind(this, i)}
          active={!!this.state.pattern[i]}
          currentPosition={this.props.position}/>
      )
    };



    return (
      <div className="track">
        <div className="transport-container">

          <input
            className="volume-slider"
            onChange={this.updateVolume.bind(this)}
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={this.state.volume} />

          {
            /*  will implement more tranport controls later:

              <span className="load-button glyphicon glyphicon-folder-open"
              aria-hidden="true">
                <input
                  className="file-input"
                  type="file"
                  accept="audio/wav"
                  onChange={this.getFile.bind(this)}>
                </input>
              </span>


              <span className="load-button glyphicon glyphicon-floppy-disk"
                aria-hidden="true"
                type="file"
                accept="audio/wav"
                onClick={this.saveTrack.bind(this)} >
              </span>

              <div className="file-arrows">
                <span className="glyphicon glyphicon-triangle-top" aria-hidden="true">
                </span>
                <span className="glyphicon glyphicon-triangle-bottom" aria-hidden="true">
                </span>
              </div>

            */
          }

          <div className="track-name">
            {this.props.id}: {this.props.name}
          </div>
          <div className="controls-container">
          </div>
        </div>

        <div className="pad-container">
          {pads}
        </div>
      </div>
    );
  }

};



export default Track