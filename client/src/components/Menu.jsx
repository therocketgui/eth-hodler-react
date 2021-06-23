import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

class MenuMain extends Component {
  state = {
    current: 'mail',
  };

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <div>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
          className={this.props.className}
        >
          <Menu.Item key="hodl">
            <Link href="/" to="/">Hodl</Link>
          </Menu.Item>
          <Menu.Item key="dex" className="no-display">
            <Link href="/dex" to="/dex">Dex</Link>
          </Menu.Item>
          <Menu.Item key="play" className="no-display">
            <Link href="/play" to="/dex">Play</Link>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default MenuMain;
