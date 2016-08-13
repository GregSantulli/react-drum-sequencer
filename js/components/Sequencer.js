"use strict";

import React, { Component } from 'react';
import Track from './Track.js';
require('../../css/sequencer.sass')



class Sequencer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      stepCount: this.props.stepCount,
      tempo: this.props.tempo,
      sixteenthNoteMs: (60 / this.props.tempo / 4) * 1000,
      input: this.props.context.createGain()
    }
    this.state.input.connect(this.props.context.destination)
  }


  componentWillMount() {

  }

  componentWillUnmount() {
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
  componentDidUpdate(){
    if (this.state.playing){

    }
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



  render() {

    var sequencer = this

    var allSounds = [
      "../../sounds/CLAP.wav",
      "../../sounds/HAT-CLOSED.wav",
      "../../sounds/KICK-HI.wav",
      "../../sounds/SNARE.wav"
    ]

    var allTracks = allSounds.map(function(path, i) {
      return <Track
        key={i}
        context={sequencer.props.context}
        path={path}
        name={path.split('/').reverse()[0]}
        stepLength={sequencer.state.stepCount}
        playing={sequencer.state.playing}
        position={sequencer.state.position}
        input={sequencer.state.input}/>
    });

    var steps = []
    for (var i = 0; i < this.props.stepCount; i++) {
      var padClass =
      steps.push(<div key={i} className={sequencer.activeIndex(i)}> • </div>)
    };



    return (

      <div className="sequencer">
      <div className="control-panel">
        <div className="global-controls">
          <div className="play-button" onClick={this.togglePlaying.bind(this)}>
            {this.state.playing ? 'STOP' : 'PLAY'}
          </div>
        </div>
        <div className="step-counter">
          {steps}
        </div>

      </div>

        <div className="track-container">

        {allTracks}

        </div>
      </div>



    );
  }

};



export default Sequencer