import React, { Component, useState } from 'react';
import { Row, Col, Space, Input } from 'antd';
import { Layers } from 'react-bootstrap-icons';
import { Modal, Button } from "react-bootstrap";

class Hodl extends Component {
  state = {
    owned: false,
    owner: null,
    otherOwner: null,
    amount: 0,
    timelocked: 0,
    createdAt: null,
    closed: null,
    isUnlocked: false
  }

  componentDidMount() {
    const owner = this.props.data.owner.substring(0, 8);

    // console.log(this.props.data.otherOwner.substring(0,8));
    let otherOwner = null;
    if (this.props.data.otherOwner.substring(0,8) != "0x000000") {
      otherOwner = this.props.data.otherOwner.substring(0, 8);
    } else {
      otherOwner = null;
    }
    // console.log(otherOwner);
    console.log(this.props.currAccount);
    console.log(this.props.data.otherOwner);

    if (this.props.currAccount == this.props.data.otherOwner || this.props.owned == true) {
      this.state.owned = true;
    }

    const amount = this.props.web3.utils.fromWei(this.props.data.amount, 'ether');
    const closed = this.props.data.closed.toString();
    const currTime = Math.ceil(new Date().getTime() / 1000);
    const createdAt = this.props.data.createdAt;
    const timelocked = this.props.data.timelocked;

    const timeDiffDays = Math.ceil((timelocked - currTime) / (60*60*24)); // days

    if (timelocked < currTime) {
      this.state.isUnlocked = true;
    }

    this.setState({
      owned: this.state.owned,
      owner: owner,
      otherOwner: otherOwner,
      amount: amount,
      closed: closed,
      timelocked: timelocked,
      timeDiffDays: timeDiffDays,
      isUnlocked: this.state.isUnlocked
    });
  }

  onTrigger = (event) => {
      // console.log(event);
      this.props.backupAddress(this.props.data.key, event.target.address.value);
      event.preventDefault();
      this.closeModal();
  }

  state = {
    isOpen: false
  };

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  render() {
    if (!this.state) {
      return <p>Loading...</p>;
    }

    return (
      <div className="space-align-container hodl-box">
        <div className="space-align-block">
          <Space align="center">
            <Row className="hodl">
              <Col span={6}>
                Owner: {this.state.owner}
              </Col>

              <Col span={6}>
                {this.state.amount} Eth
              </Col>

              { !this.state.isUnlocked ? <Col span={6}>{this.state.timeDiffDays} days left</Col>
              : <Col span={6}>Unlocked</Col>
              }

              {this.state.isUnlocked == true && this.state.owned && !this.props.data.closed ?
                <Col span={6}><button onClick={() => this.props.action(this.props.data.key)}>Unlock</button></Col>
              : <Col span={6}>Closed: {this.state.closed}
                  {this.props.backupAddress && this.state.otherOwner == null && !this.props.data.closed ?
                    <Layers onClick={this.openModal} />
                  : null
                  }
              </Col>
              }
            </Row>

            <Modal show={this.state.isOpen} onHide={this.closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Update Address</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={this.onTrigger}>
                  <Col span={12}>
                    <Input type="text" name="address" placeholder="Enter Backup Address"></Input>
                  </Col>
                  <Col span={12}>
                    <Input type="submit" value="submit"></Input>
                  </Col>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.closeModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Space>
        </div>
      </div>
    );
  }
}

export default Hodl;
