import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'

import Login from './components/Login.js';
import Table from './components/Table.js';
import Sequencer from './components/Sequencer.js'
import NavBar from './components/NavBar.js';
import Api from './actions/api.js'

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();


export default class App extends React.Component {
    render() {
        return (
            <div>
                <Sequencer context={context} tempo="95" stepCount="16"></Sequencer>
                <div>{ this.props.children }</div>
            </div>

        );
    }
}

var routes = (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="login" component={Login} />
      </Route>
    </Router>
);



render(routes, document.getElementById('app'));

