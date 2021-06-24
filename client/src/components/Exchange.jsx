import React, { Component } from 'react';
import { Form, Input, Col, Row } from 'antd';

class Exchange extends Component {
  state = { tokenPrice: null,
            title: null,
            input1: null,
            input2: null
          };

  componentWillMount = async () => {
    if (this.props.type == 'ethToToken') {
      this.setState({
          title: 'Exchange Eth to Hodl Tokens',
          input1: 'Enter an amount of Ether',
          input2: 'Tokens'
        });
    } else {
      this.setState({
          title: 'Exchange Hodl Tokens to Eth',
          input1: 'Enter an amount of Tokens',
          input2: 'Ethers'
        });
    }
  }

  onTrigger = (event) => {
      console.log(event);
      this.props.action({amount: event.target.amount.value});
      event.preventDefault();
  }

  handleKeyPress = async (e) => {
    // console.log(e);
    try {
      console.log(e.target.value);
      // To check if number or ".";
      if (!isNaN(e.target.value)) {
        let price;
        if (this.props.type == 'ethToToken') {
          const amountWei = this.props.web3.utils.toWei(e.target.value, 'ether');
          const dexEthBalanceWei = this.props.web3.utils.toWei(this.props.dexEthBalance, 'ether');
          price = await this.props.dex.methods.price(amountWei, dexEthBalanceWei, this.props.dexTokenBalance).call();
          console.log(price);
        } else {
          const dexEthBalanceWei = this.props.web3.utils.toWei(this.props.dexEthBalance, 'ether');
          price = await this.props.dex.methods.price(e.target.value, this.props.dexTokenBalance, dexEthBalanceWei).call();
          price = this.props.web3.utils.fromWei(price, 'ether');
          console.log(price);
        }
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
          <h3>{this.state.title}</h3>
          <form onSubmit={this.onTrigger}>
            <Col span={24} className="gutter-row">
              <Input type="text" name="amount" placeholder={this.state.input1} onChange={this.handleKeyPress}></Input>
            </Col>
            <Col span={24} className="gutter-row">
              <Input type="text" name="tokens" placeholder={this.state.input2} value={this.state.tokenPrice}></Input>
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
