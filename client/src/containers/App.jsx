import React, { Component } from "react";
import { Col } from "antd";
import HodlContract from "./../contracts/Hodler.json";
import DexContract from "./../contracts/Dex.json";
import HodlTokenContract from "./../contracts/HodlToken.json";
import getWeb3 from "./../getWeb3";
import Create from './../components/Create';
import Hodl from './../components/Hodl';
import MenuMain from './../components/Menu';
import Header from './../components/Header';
import Footer from './../components/Footer';
// import Hodls from './components/Hodls';
// import CreateForm from './components/CreateForm';
import { Row } from 'antd';
import { Link } from 'react-router-dom';

import "./../assets/App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, hodls: [], otherhodls: [], hodlTokenBalance: null};
  constructor(props) {
    super(props);
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
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

      // const _tokendeployedNetwork = HodlTokenContract.networks[networkId];
      // const token = new web3.eth.Contract(
      //   HodlTokenContract.abi,
      //   _tokendeployedNetwork && _tokendeployedNetwork.address,
      // );


      console.log(instance);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, dex: dex }, this.atStart);
      // Show Hodls.
      this.account = accounts[0];
      // this.setState({ account: accounts[0] })
      // console.log(this.account);
      await this.displayMyHodls();
      await this.displayAllHodls();
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

    this.refreshInfos();
  };

  refreshInfos = async () => {
    const { accounts, contract, dex, token } = this.state;
    this.account = accounts[0];
    console.log(this.account);
    let _myHodls = await contract.methods.getHodlsByOwner(this.account).call();

    // ISSUE THERE IS TWO DIFFERENT TOKEN CONTRACT
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

  unlockHodl = async (_hodlId) => {
    try {
      const { accounts, contract } = this.state;
      this.account = accounts[0];
      await contract.methods.unlockHodl(_hodlId).send({ from: this.account, gas: 3000000 });
      // Refresh main infos
      await this.refreshInfos();
      await this.displayMyHodls();

    } catch (err) {
      alert(err);
    }
  };

  backupAddress = async (_hodlId, _backupAddress) => {
    try {
      const { accounts, contract } = this.state;
      await contract.methods.modifyHodlBackup(_hodlId, _backupAddress).send({ from: this.account, gas: 300000 });
      // Add confirmation
      await this.refreshInfos();
      await this.displayMyHodls();
      alert(`Backup Address ${_backupAddress} added successfully!`);
    } catch (err) {
      alert(err);
    }
  };

  createHodl = async (formData) => {
    try {
      // Create Hodl when submit the form
      const { web3, accounts, contract } = this.state;
      this.account = accounts[0];

      const amountWei = web3.utils.toWei(formData.amount, 'ether');

      const { lockHodl } = contract.methods;

      await lockHodl(formData.days).send({ from: this.account, value: amountWei, gas: 6721975, gasPrice: '30000000'});
      await this.refreshInfos();
      await this.displayMyHodls();

    } catch (err) {
      alert(err);
    }
  };

  displayMyHodls = async () => {
    const { accounts, contract } = this.state;
    this.account = accounts[0];

    let _hodls = []

    let _myHodls = await contract.methods.getHodlsByOwner(this.account).call();
    _myHodls.reverse();
    for (var i = 0; i < _myHodls.length; i++) {
      let _hodl = await contract.methods.hodls(_myHodls[i]).call();
      _hodl.key = _myHodls[i];
      _hodls.push(_hodl);
    }
    this.setState({ hodls: _hodls});
  }

  displayAllHodls = async () => {
    const { accounts, contract } = this.state;
    this.account = accounts[0];

    let _hodls = []

    let _hodlsCount = await contract.methods.getHodlsCount().call();
    let _myHodls = await contract.methods.getHodlsByOwner(this.account).call();

    for (var i = _hodlsCount-1; i >= 0; i--) {
      if (_myHodls.includes(i.toString()) == false) {
        let _hodl = await contract.methods.hodls(i).call();
        _hodl.key = i;
        _hodls.push(_hodl);
      }
    }
    this.setState({ otherhodls: _hodls});
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    };

    return (
      <div className="App">
        <div>
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

        <Create action={this.createHodl} ></Create>

        { this.state.hodlCount > 0 ?
        <Row className="hodl h-container">
          <h3>My Hodls</h3>
          {this.state.hodls.map((hodl, i) => (
          <Hodl
            currAccount={this.state.accounts[0]}
            owned={true}
            action={this.unlockHodl}
            backupAddress={this.backupAddress}
            key={hodl.key}
            data={hodl}
            web3={this.state.web3}
          />
          ))}
        </Row>
        : null
        }

        <Row className="hodl h-container">
          <h3>All Hodls</h3>
          {this.state.otherhodls.map((hodl, i) => (
            <Hodl
              currAccount={this.state.accounts[0]}
              owned={false}
              action={this.unlockHodl}
              key={hodl.key}
              data={hodl}
              web3={this.state.web3}
            />
          ))}
        </Row>

        <Footer contractAddress={this.state.contract._address} />
        </div>
      </div>
    );
  }
}

export default App;
