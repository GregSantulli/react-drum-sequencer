import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'

import Sequencer from './components/Sequencer.js'
import NavBar from './components/NavBar.js';
import FileBrowser from './components/FileBrowser.js';
import Api from './actions/api.js'

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  setSequencer(){
  }

  componentWillMount() {

  }

  loadSound(sound){
    var tracks = this.state.tracks
    console.log(sound)
    tracks.push({
      audio_file: sound,
      pattern: "0000000000000000"
    })
    this.setState({
      tracks: tracks
    })
  }


  render() {
    return (
      <div>
        <Sequencer
          context={context}
          tempo="95"
          stepCount="16">
        </Sequencer>
        <FileBrowser loadSound={this.loadSound.bind(this)} />
        <div>{ this.props.children }</div>
      </div>
    );
  }
}





render(<App/>, document.getElementById('app'));

