"use strict";

import React, { Component } from 'react';
import Pad from './Pad.js';
require('../../css/track.sass')


class Track extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pattern: this.props.pattern || {},
      playing: this.props.playing,
      gain: this.props.context.createGain(),
      volume: 1
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

  componentWillUnmount() {
  }


  changePattern(i){
    var newPattern = this.state.pattern
    newPattern[i] = !newPattern[i]
    this.setState({pattern: newPattern})
  }

  shouldComponentUpdate(newProps, newState){
    return this.props.position == newProps.position
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
          <input
            className="volume-slider"
            onChange={this.updateVolume.bind(this)}
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={this.state.volume} />
          <div className="track-name">
            {this.props.name}
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