import React, { Component } from 'react';
import { Form, Input, Col, Row } from 'antd';

class Create extends Component {
  onTrigger = (event) => {
      console.log(event);
      this.props.action({amount: event.target.amount.value, days: event.target.days.value});
      event.preventDefault();
  }

  render() {
    return (
      <Row className="create h-container">
        <Row gutter={16} className="h-c-container h-c-box">
          <h3>Start a new Hodl</h3>
          <form onSubmit={this.onTrigger}>
            <Col span={8} className="gutter-row">
              <Input type="text" name="amount" placeholder="Enter an amount of Ether" required></Input>
            </Col>
            <Col span={8} className="gutter-row">
              <Input type="text" name="days" placeholder="Enter an amount of days" required></Input>
            </Col>
            <Col span={8} className="gutter-row">
              <Input type="submit" value="Hodl"></Input>
            </Col>
          </form>
        </Row>
      </Row>
    );
  }
}

export default Create;
