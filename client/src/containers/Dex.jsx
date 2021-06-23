import React, { Component } from "react";
import { Col } from "antd";
import HodlContract from "./../contracts/Hodler.json";
import DexContract from "./../contracts/Dex.json";
import getWeb3 from "./../getWeb3";
import Create from './../components/Create';
import Hodl from './../components/Hodl';
import MenuMain from './../components/Menu';
import Header from './../components/Header';
import Exchange from './../components/Exchange';

// import Hodls from './components/Hodls';
// import CreateForm from './components/CreateForm';
import { Row } from 'antd';

import "./../assets/App.css";

class Dex extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, hodls: [], otherhodls: [], hodlTokenBalance: null};

  constructor(props) {
    super(props);
  };

  componentWillMount = async () => {
    try {
      console.log("Hey")
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      console.log(web3);
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = HodlContract.networks[networkId];
      const instance = new web3.eth.Contract(
        HodlContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const _deployedNetwork = DexContract.networks[networkId];
      const dex = new web3.eth.Contract(
        DexContract.abi,
        _deployedNetwork && _deployedNetwork.address,
      );


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, dex: dex }, this.atStart);
      // Show Hodls.
      this.account = accounts[0];

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  atStart = async () => {
    // Set initial State value for page display
    // Hodls, Total locked / unlocked / Curr Address / Contract address...
    const { accounts, contract } = this.state;
    this.account = accounts[0];
    console.log(this.account);

    this.refreshInfos();
  };

  refreshInfos = async () => {
    const { accounts, contract, dex } = this.state;
    this.account = accounts[0];
    console.log(this.account);
    let _myHodls = await contract.methods.getHodlsByOwner(this.account).call();
    let _hodlTokenBalance = await contract.methods.balanceOf(this.account).call();
    let _hodlTokenTotalSupply = await contract.methods.totalSupply().call();
    // Refresh main infos
    let _totalLocked = await contract.methods.totalLocked().call();
    let _totalUnlocked = await contract.methods.totalUnlocked().call();

    let _myTotalLocked = await contract.methods.getTotalLockedByOwner(this.account).call();
    let _myTotalUnlocked = await contract.methods.getTotalUnlockedByOwner(this.account).call();

    let dexEthBalance = await this.state.web3.eth.getBalance(dex.options.address); // Dex's Eth balance
    let dexTokenBalance = await contract.methods.balanceOf(dex.options.address).call(); // Dex's Token balance

    this.setState({ hodlCount: _myHodls.length,
                    hodlTokenTotalSupply: parseInt(_hodlTokenTotalSupply),
                    hodlTokenBalance: parseInt(_hodlTokenBalance),
                    totalLocked: this.state.web3.utils.fromWei(_totalLocked, 'ether'),
                    totalUnlocked: this.state.web3.utils.fromWei(_totalUnlocked, 'ether'),
                    myTotalLocked: this.state.web3.utils.fromWei(_myTotalLocked, 'ether'),
                    myTotalUnlocked: this.state.web3.utils.fromWei(_myTotalUnlocked, 'ether'),
                    dexEthBalance: this.state.web3.utils.fromWei(dexEthBalance, 'ether'),
                    dexTokenBalance: dexTokenBalance
                  });
  }

  ethExchange = async (formData) => {
    try {
      const { web3, accounts, contract, dex } = this.state;
      this.account = accounts[0];

      const amountWei = web3.utils.toWei(formData.amount, 'ether');

      await dex.methods.ethToHodlToken().send({from: this.account, value: amountWei, gas: 6721975, gasPrice: '30000000'})
      this.refreshInfos();
    } catch (err) {
      alert(err);
    }
  };

  getPrice = async () => {

  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    };

    return (
      <div className="App">
        <MenuMain />
        <Header
          hodlTokenBalance={this.state.hodlTokenBalance}
          hodlTokenTotalSupply={this.state.hodlTokenTotalSupply}
          myTotalLocked={this.state.myTotalLocked}
          myTotalUnlocked={this.state.myTotalUnlocked}
          totalLocked={this.state.totalLocked}
          totalUnlocked={this.state.totalUnlocked}
          dexEthBalance={this.state.dexEthBalance}
          dexTokenBalance={this.state.dexTokenBalance}
        />
        <Row>
          <h3>Dex</h3>
          <Exchange
            action={this.ethExchange}
            dex={this.state.dex}
            dexEthBalance={this.state.dexEthBalance}
            dexTokenBalance={this.state.dexTokenBalance}
            web3={this.state.web3}
          />
        </Row>
      </div>
    );
  }
}

export default Dex;
