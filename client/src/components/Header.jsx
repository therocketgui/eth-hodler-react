import React, { Component } from 'react';
import { Menu, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

class Header extends Component {

  render() {
    return (
      <Row>
        <Row className="h-top-bar">
          My HODL Token Balance: {this.props.hodlTokenBalance} / HODL Token Total Supply: {this.props.hodlTokenTotalSupply}
        </Row>
        <Row className="h-top-bar">
          Pool Token Balance: {this.props.dexTokenBalance} / Pool Eth Balance: {this.props.dexEthBalance}
        </Row>
        <Row className="h-top-bar">
          Hodl Token Price: {this.props.dexEthBalance/this.props.dexTokenBalance} Eth
        </Row>
        <Row className="h-header">
          <h1>Hodler v0.1</h1>
          <p>A Smart Contract to Hodl, because I can't by myself.<br /> Get Hodl Tokens every time you lock Eth longer than 365 days.</p>
        </Row>

        <Row className="h-i-container gutter={16}">
          <Col span={6} className="gutter-row h-i-box h-i-sub-container">My Total locked: {this.props.myTotalLocked} Eth</Col>
          <Col span={6} className="gutter-row h-i-box h-i-sub-container">My Total unlocked: {this.props.myTotalUnlocked} Eth</Col>
          <Col span={6} className="gutter-row h-i-box h-i-sub-container">Total locked: {this.props.totalLocked} Eth</Col>
          <Col span={6} className="gutter-row h-i-box h-i-sub-container">Total unlocked: {this.props.totalUnlocked} Eth</Col>
        </Row>
      </Row>
    );
  }
}

export default Header;
