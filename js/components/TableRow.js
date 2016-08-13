"use strict";

import React, { Component } from 'react';

import Api from "./actions/api.js"

class TableRow extends Component {



    render() {
      var tdArray = this.props.map(function(cell) {
          return <td className="cell">{cell}</td>;
      });

        return (

          <tr>
            {tdArray}
          </tr>



        );
    }

};



export default TableRow