import React, { Component } from 'react';
import { Menu, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

class Footer extends Component {

  render() {
    return (
      <Row className="footer">
          Contract Address: {this.props.contractAddress}
      </Row>
    );
  }
}

export default Footer;
