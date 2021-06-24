import React, { Component } from 'react';
import { Form, Input, Col, Row } from 'antd';

class Withdraw extends Component {
  state = { tokenPrice: null };

  componentWillMount = async () => {

  }

  onTrigger = (event) => {
      console.log(event.target.amount.value);
      console.log(event.target.tokens.value);
      this.props.action({amount: event.target.amount.value, tokens: event.target.tokens.value});
      event.preventDefault();
  }

  handleKeyPress = async (e) => {
    // console.log(e);
    try {
      console.log(e.target.value);
      // To check if number or ".";
      if (!isNaN(e.target.value)) {
        const amountWei = this.props.web3.utils.toWei(e.target.value, 'ether');
        const dexEthBalanceWei = this.props.web3.utils.toWei(this.props.dexEthBalance, 'ether');
        // let price = await this.props.dex.methods.price(amountWei, dexEthBalanceWei, this.props.dexTokenBalance).call();
        let tokenAmount = (amountWei * this.props.dexTokenBalance / dexEthBalanceWei) + 1;
        // console.log(amountWei * this.props.dexTokenBalance / dexEthBalanceWei);

        this.setState({tokenPrice: tokenAmount});
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <Row className="create h-container">
        <Row gutter={16} className="h-c-container h-c-box">
          <h3>Withdraw</h3>
          <p>My Liquidity: {this.props.myLiquidity} Eth</p>
          <form onSubmit={this.onTrigger}>
            <Col span={24} className="gutter-row">
              <Input type="text" name="amount" placeholder="Withdraw Eth" onChange={this.handleKeyPress}></Input>
            </Col>
            <Col span={24} className="gutter-row">
              <Input type="text" name="tokens" placeholder="Withdraw Tokens" value={this.state.tokenPrice}></Input>
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

export default Withdraw;
