"use strict";

import React, { Component } from 'react';
import Api from "../actions/api.js"
require('../../css/app.sass')


class Table extends Component {

  constructor(props) {
    super(props);
    this.state = {records: null };
  }

  setRecords(records){
    this.setState({records: records})
  }


  componentWillMount() {
    var _this = this
    this.serverRequest = Api.get('/records').then((response) => {
      if (response.status == 200){
        response.json().then((json) => {
          this.setRecords(json)
        })
      }
    })
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  handleClick() {
    console.log(this)
  }
  playSound() {
    console.log(this)
  }


  render() {

    var allRecords

    if (this.state.records){
      var that = this
      allRecords = this.state.records.map(function(record){
        return (
          <tr key={record.id}>
            <td
              onClick={that.handleClick.bind(record)}
              >
              {record.name}
            </td>
            <td>hayy</td>
            <td className="actions">

                <span className="glyphicon glyphicon-play" aria-hidden="true"></span>

                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>

                <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>

            </td>
          </tr>
          )
      });
    }


    return (
      <div className="table-container">
        <table className="table">
          <tbody>
            {allRecords}
          </tbody>
        </table>
      </div>
    );
  }

};



export default Table