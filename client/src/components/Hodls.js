import React, { Component } from 'react';
import { Row, Col, Space } from 'antd';
import Hodl from './Hodl';

class Hodls extends Component {
  componentDidMount() {

  }

  render() {


    return (
        <Row className="hodl h-container">
        {this.props.hodls.map((hodl, i) => (
          <Hodl
            key={hodl.key}
            data={hodl}
            web3={this.props.web3}
          />
        ))}
        </Row>
    );
  }
}

export default Hodls;
