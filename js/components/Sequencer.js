"use strict";

import React, { Component } from 'react';
import Track from './Track.js';
require('../../css/sequencer.sass')
import Api from "../actions/api.js"

class Sequencer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      stepCount: this.props.stepCount,
      tempo: this.props.tempo,
      sixteenthNoteMs: (60 / this.props.tempo / 4) * 1000,
      input: this.props.context.createGain(),
    }
    this.state.input.connect(this.props.context.destination)
  }

  componentDidUpdate() {
    var seq = this
    Api.getInitialSequence()
      .then(function(data){
        var allTracks;
        if (data.tracks){
          allTracks = data.tracks.map(function(sound, i) {
            return seq.getTrack(sound, i)
          });
        }
        seq.setState({
          tracks: allTracks,
          id: data.id
        })
      })
      .catch(function(e){
        console.log(e)
      })
  }

  componentDidMount() {
    this.setState({
      position: 0
    })
  }

  togglePlaying(){
    clearTimeout(this.timeout)
    var newState = {}
    newState.playing = !this.state.playing
    if (this.state.playing){
      newState.position = 0
    } else {
      var seq = this
      newState.timeout = setTimeout(seq.incrementPosition.bind(seq), this.state.sixteenthNoteMs)
    }
    this.setState(newState)
  }

  componentWillUnmount(){
    clearTimeout(this.state.timeout)
  }

  incrementPosition(){
    var seq = this
    if (this.state.playing){
      var newPosition = seq.state.position > 14 ? 0 : seq.state.position + 1
      var timeout = setTimeout(seq.incrementPosition.bind(seq), this.state.sixteenthNoteMs)
      this.setState({
        position: newPosition,
        timeout: timeout
      })
    }
  }

  activeIndex(i){
    return (this.state.position == i && this.state.playing) ? "step-pad current": "step-pad"
  }

  startButtonIcon(){
    var icon  = this.state.playing ? "stop" : "play"
    return (
      <span className={"glyphicon glyphicon-"+icon} aria-hidden="true"></span>
      )
  }

  updateTempo(e){
    this.setState({
      tempo: e.target.value,
      sixteenthNoteMs: (60 / e.target.value / 4) * 1000,
    })
  }

  decodePattern(track){
    var pattern = {}
    for (var x = 0; x < track.pattern.length; x++) {
      if (track.pattern[x] == "1"){
        pattern[x] = true
      }
    };
    return pattern
  }


  addTrack(e){
    var fiel = e.target.files[0]
    console.log(this.state.tracks)
  }

  // newTrack(audioFile){
  //   var tracks = this.state.tracks
  //   tracks.push(
  //     <Track
  //       key={i}
  //       context={this.props.context}
  //       name={audio_file.name}
  //       path={audio_file.url}
  //       stepLength={this.state.stepCount}
  //       playing={this.state.playing}
  //       position={this.state.position}
  //       input={this.state.input}/>
  //   )
  //   this.setState({
  //     tracks: tracks
  //   })
  // }

  changeTrackPattern(x){
    console.log(this.state)
    console.log(x)
  }


  getTrack(track, i){
    var pattern = this.decodePattern(track)
    return <Track
      key={i}
      id={track.id}
      context={this.props.context}
      name={track.audio_file.name}
      path={track.audio_file.url}
      pattern={pattern}
      changeTrackPattern={this.changeTrackPattern.bind(this)}
      stepLength={this.state.stepCount}
      playing={this.state.playing}
      position={this.state.position}
      input={this.state.input}/>
  }

  saveSequence(){
    console.log(this.props)
    console.log(this.state)
    // Api.saveSequence(this)
  }



  render() {

    var sequencer = this

    var steps = []
    for (var i = 0; i < this.props.stepCount; i++) {
      steps.push(<div key={i} className={sequencer.activeIndex(i)}> • </div>)
    };

    return (

      <div className="sequencer">
      <div className="control-panel">
        <div className="global-controls">

          <span className="save-sequence glyphicon glyphicon-floppy-disk"
            aria-hidden="true"
            type="file"
            accept="audio/wav"
            onClick={this.saveSequence.bind(this)} >
          </span>

          <input
            className="tempo-slider"
            onChange={this.updateTempo.bind(this)}
            type="range"
            min="80"
            max="160"
            step="1"
            value={this.state.tempo} />

            <div className="tempo-display">
              {this.state.tempo} BPM
            </div>

          <div className="play-button" onClick={this.togglePlaying.bind(this)}>
            {this.startButtonIcon()}
          </div>
        </div>
        <div className="step-counter">
          {steps}
        </div>

      </div>

        <div className="track-container">
          {this.state.tracks}
        </div>


      {
       /*
          <span className="add-track glyphicon glyphicon-plus" aria-hidden="true">
            <input
              className="file-input"
              type="file"
              accept="audio/wav"
              onChange={this.addTrack.bind(this)}>
            </input>
          </span>
        */
      }


      </div>



    );
  }

};



export default Sequencer