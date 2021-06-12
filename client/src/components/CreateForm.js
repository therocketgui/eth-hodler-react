import React, { Component } from 'react';
import { Button, Form, Input, Col, Row, InputNumber, DatePicker, AutoComplete, Cascader } from 'antd';

const FormItem = Form.Item;

class CreateForm extends Component {
  onTrigger = (event) => {
      this.props.action({amount: event.target.amount.value, days: event.target.days.value});
      event.preventDefault();
  }

  render() {
    return (
        <Row>
        <Row>
          <form onSubmit={this.onTrigger}>
            <Input.Group compact>
              <Input defaultValue="input content" />
              <DatePicker />
            </Input.Group>
          </form>
        </Row>

        <Form onSubmit={this.handleSubmit} className="">
          <FormItem>
            <DatePicker />
          </FormItem>
          <FormItem>
            <Button
              className="Main-Cta"
              htmlType="submit"
            >
              Join Our Pre-Launch List!
            </Button>
          </FormItem>
        </Form>
        </Row>
    );
  }
}

export default CreateForm;
