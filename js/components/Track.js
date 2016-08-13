"use strict";

import React, { Component } from 'react';
import Pad from './Pad.js';
require('../../css/track.sass')


class Track extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pattern: {},
      playing: this.props.playing

    }
  }

  loadSound(){
    var track = this
    var request = new XMLHttpRequest();
    request.open("GET", track.props.path, true);
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
      sound.connect(this.props.context.destination);
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

  componentDidUpdate() {

  }

  componentWillReceiveProps(newProps){
    if (this.props.playing && (this.props.position != newProps.position)){
      this.playCurrentPosition()
    }
  }

  componentWillUnmount() {
  }


  changePattern(i){
    var newPattern = this.state.pattern
    newPattern[i] = !newPattern[i]
    this.setState({pattern: newPattern})
  }




  padActive(i){
    return !!this.state.pattern[i]
  }


  render() {

    var pads = []
    for (var i = 0; i < this.props.stepLength; i++) {
      pads.push(
        <Pad
          key={i}
          playSound={this.playSound.bind(this)}
          changePattern={this.changePattern.bind(this, i)}
          active={!!this.state.pattern[i]} />
      )
    };

    return (
      <div className="track">
        <div className="transport-container">
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