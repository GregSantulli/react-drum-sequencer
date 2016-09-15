"use strict";

import React, { Component } from 'react';
require('../../css/pad.sass')


class Pad extends Component {

  constructor(props) {
    super(props);
    this.state = {
      position: this.props.position
    }
  }

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  handlePadClick(){
    this.props.changePattern()
  }

  getClassName(){
    return this.props.active ? "pad active" : "pad"
  }

  render() {
    return (
      <div className={this.getClassName()} onClick={this.handlePadClick.bind(this)}></div>
    );
  }

};



export default Pad