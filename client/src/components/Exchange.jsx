import React, { Component } from 'react';
import { Form, Input, Col, Row } from 'antd';

class Exchange extends Component {
  state = {tokenPrice: null};

  onTrigger = (event) => {
      console.log(event);
      this.props.action({amount: event.target.amount.value});
      event.preventDefault();
  }

  handleKeyPress = async (e) => {
    // console.log(e);
    try {
      console.log(e.target.value);
      if (!isNaN(e.target.value)) {
        const amountWei = this.props.web3.utils.toWei(e.target.value, 'ether');
        const dexEthBalanceWei = this.props.web3.utils.toWei(this.props.dexEthBalance, 'ether');
        let price = await this.props.dex.methods.price(amountWei, dexEthBalanceWei, this.props.dexTokenBalance).call();
        console.log(price);

        this.setState({tokenPrice: price});
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <Row className="create h-container">
        <Row gutter={16} className="h-c-container h-c-box">
          <h3>Exchange Eth to Hodl Tokens</h3>
          <form onSubmit={this.onTrigger}>
            <Col span={24} className="gutter-row">
              <Input type="text" name="amount" placeholder="Enter an amount of Ether" onChange={this.handleKeyPress}></Input>
            </Col>
            <Col span={24} className="gutter-row">
              <Input type="text" name="tokens" placeholder="Tokens" value={this.state.tokenPrice}></Input>
            </Col>
            <Col span={24} className="gutter-row">
              <Input type="submit" value="Exchange"></Input>
            </Col>
          </form>
        </Row>
      </Row>
    );
  }
}

export default Exchange;
