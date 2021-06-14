
const Hodler = artifacts.require("Hodler");
const HodlToken = artifacts.require("HodlToken");

var expect = require('chai').expect;
const utils = require('./helpers/utils');
const keccak256 = require('keccak256');
// const time = require("./helpers/time");
const { time } = require('@openzeppelin/test-helpers');

contract("Hodl", (accounts) => {
  let owner = accounts[1];
  let otherAddress = accounts[5];
  let randomAddress = accounts[8];
  let contractInstance;
  let hodlTokenInstance;
  let amount = web3.utils.toWei('0.1', 'ether');
  console.log(accounts);

  beforeEach(async () => {
    contractInstance = await Hodler.new();
    hodlTokenInstance = await HodlToken.new();
  })

  xcontext("with the constructor and role ownership scenarios", async () => {
    it("should give Hodler appropriate ownerships", async () => {
      /// After the constructor, verify ownerships
      const contractAddress = contractInstance.address;
      console.log(contractAddress);

      minter = await contractInstance.hasRole(keccak256("MINTER_ROLE"), contractAddress);
      burner = await contractInstance.hasRole(keccak256("BURNER_ROLE"), contractAddress);
      // deployer
      admin = await contractInstance.hasRole(keccak256("DEFAULT_ADMIN_ROLE"), accounts[0]);

      expect(minter).to.equal(true);
      expect(burner).to.equal(true);
      expect(admin).to.equal(false);
    });

    it("should check if token init properly", async () => {
      expect(await contractInstance.symbol()).to.equal('HODL');
      expect(await contractInstance.name()).to.equal('Hodl');
      expect(parseInt(await contractInstance.totalSupply())).to.equal(0);
    });

  });

  context("with the tokens and minting scenarios", async () => {
    xit("should allow the contract to mint tokens", async () => {
      // r = await contractInstance.mintHodlToken(otherAddress, '10000', {from: otherAddress});
      r = await contractInstance.mintCalculator(web3.utils.toWei(amount) ,4);
      console.log(parseInt(r))
      b = await contractInstance.balanceOf(otherAddress);
      console.log(parseInt(b));

      // expect(parseInt(b)).to.equal(4*amount);
    });

    it("should allow the contract to mint tokens", async () => {
      // r = await contractInstance.mintHodlToken(otherAddress, '10000', {from: otherAddress});
      // r0 = await contractInstance.lockHodl(1, {value: amount, from: otherAddress});
      // console.log(parseInt(await contractInstance.balanceOf(otherAddress)));
      r = await contractInstance.lockHodl(1095, {value: web3.utils.toWei('0.3', 'ether'), from: otherAddress});
      console.log("1 / 180 :"+console.log(parseInt(await contractInstance.balanceOf(otherAddress))));
      // r = await contractInstance.lockHodl(420, {value: web3.utils.toWei('0.1', 'ether'), from: otherAddress});
      // console.log("1 / 420 :"+console.log(parseInt(await contractInstance.balanceOf(otherAddress))));
      // r = await contractInstance.lockHodl(720, {value: web3.utils.toWei('0.1', 'ether'), from: otherAddress});
      // console.log("1 / 720 :"+console.log(parseInt(await contractInstance.balanceOf(otherAddress))));
      // r = await contractInstance.lockHodl(1070, {value: web3.utils.toWei('0.1', 'ether'), from: otherAddress});
      // console.log("1 / 1070 :"+console.log(parseInt(await contractInstance.balanceOf(otherAddress))));
      // r = await contractInstance.lockHodl(1230, {value: web3.utils.toWei('0.1', 'ether'), from: otherAddress});
      // console.log("1 / 1230 :"+console.log(parseInt(await contractInstance.balanceOf(otherAddress))));

      // r2 = await contractInstance.lockHodl(1, {value: web3.utils.toWei('1', 'ether'), from: otherAddress});
      // console.log("0.15 / 1 :"+console.log(parseInt(await contractInstance.balanceOf(otherAddress))));
      // r3 = await contractInstance.lockHodl(90, {value: web3.utils.toWei('0.1', 'ether'), from: otherAddress});
      // console.log("0.1 / 90 :"+console.log(parseInt(await contractInstance.balanceOf(otherAddress))));
      // r4 = await contractInstance.lockHodl(365, {value: web3.utils.toWei('1', 'ether'), from: otherAddress});
      // console.log("0.1 / 365 :"+console.log(parseInt(await contractInstance.balanceOf(otherAddress))));
      // expect(parseInt(b)).to.equal(4*amount);
    });

    xit("shouldn't allow msg.sender or anyone to mint tokens", async () => {
      await utils.shouldThrow(contractInstance.mint(otherAddress, '10000', {from: otherAddress}));
    });
  });

  xcontext("with the Lock scenario and BackupAddress", async () => {
    it("should get the total locked value", async () => {

      // r = await contractInstance.getThePrice({from: owner});
      let result = await contractInstance.lockHodl(1, {value: amount, from: owner});
      // let r = await contractInstance.totalLocked()
      // let g = await contractInstance.getTotalLockedByOwner(owner);
      // console.log(parseInt(r));
      // console.log(parseInt(g));
      let x = await contractInstance.hodls().length;
      console.log(x);

    });

    it("should get the current price (feed)", async () => {

      // r = await contractInstance.getThePrice({from: owner});
      r = await contractInstance.getThePrice().then((roundData) => {
          // Do something with roundData
          console.log("Latest Round Data", roundData.toNumber())
      });;
      // console.log(r);
      // console.log(r.);
    });

    it("should add a locked Hodl", async () => {

      // Check balance, lock, re-check balance.
      contractBalance = await web3.eth.getBalance(contractInstance.address);
      accBalance = await web3.eth.getBalance(owner);
      let result = await contractInstance.lockHodl(1, {value: amount, from: owner});
      newContractBalance = await web3.eth.getBalance(contractInstance.address);
      newAccBalance = await web3.eth.getBalance(owner);

      expect(result.receipt.status).to.equal(true);
      expect(parseInt(newAccBalance)).to.be.below(parseInt(accBalance));
      expect(parseInt(newContractBalance)).to.be.above(parseInt(contractBalance));
    });

    it("should add two locks with two accounts and have appropriate ownership", async () => {
      let result = await contractInstance.lockHodl(1, {value: amount, from: owner});
      let hodlId = result.logs[0].args.hodlId.toNumber();

      await time.increase(172800);
      // Trying to unlock with a random address
      await utils.shouldThrow(contractInstance.unlockHodl(hodlId, {from: otherAddress}));
    });

    it("it should add a backup address", async () => {
      let result = await contractInstance.lockHodl(1, {value: amount, from: owner});
      const _hodlId = result.logs[0].args.hodlId.toNumber();

      _r = await contractInstance.modifyHodlBackup(_hodlId, otherAddress, {from: owner});
      _t = await contractInstance.hodls(_hodlId);
      // console.log(_t);

      expect(_r.receipt.status).to.equal(true);
    });
  });

  xcontext("with the Unlock scenario", async () => {
    it("should not allow to unlock straight away", async () => {
      let result = await contractInstance.lockHodl(1, {value: amount, from: owner});
      let hodlId = result.logs[0].args.hodlId.toNumber();
      await utils.shouldThrow(contractInstance.unlockHodl(hodlId, {from: owner}));
    });

    it("should not allow to unlock after a time travel pre timelocked timestamp", async () => {
      let result = await contractInstance.lockHodl(1, {value: amount, from: owner});
      let hodlId = result.logs[0].args.hodlId.toNumber();

      // Time Travel: 1/2 days
      await time.increase(43200);
      await utils.shouldThrow(contractInstance.unlockHodl(hodlId, {from: owner}));
    });

    it("should allow to unlock after a time travel post timelocked timestamp", async () => {
      let result = await contractInstance.lockHodl(1, {value: amount, from: owner});
      let hodlId = result.logs[0].args.hodlId.toNumber();
      // Time travel: 2 days
      await time.increase(172800);
      r = await contractInstance.unlockHodl(hodlId, {from: owner});

      expect(r.receipt.status).to.equal(true);
    });

    it("should allow the backup address to unlock after a time travel post timelocked timestamp", async () => {
      // Create one hodl
      let r = await contractInstance.lockHodl(1, {value: amount, from: owner});
      let h = r.logs[0].args.hodlId.toNumber();

      // Modify address
      await contractInstance.modifyHodlBackup(h, otherAddress, {from: owner});
      // Time Travel: 2 days
      await time.increase(172800);
      // Unlock from other address
      await contractInstance.unlockHodl(h, {from: otherAddress});

      let hodl = await contractInstance.hodls(h);

      // It should be closed
      expect(hodl.closed).to.equal(true);

    });

    it("should not allow to unlock twice (once it has been unlocked)", async () => {
      let result = await contractInstance.lockHodl(1, {value: amount, from: owner});
      let hodlId = result.logs[0].args.hodlId.toNumber();
      await time.increase(172800);
      // Trying to unlock twice
      await contractInstance.unlockHodl(hodlId, {from: owner});
      await utils.shouldThrow(contractInstance.unlockHodl(hodlId, {from: owner}));
    });

    it("should not allow any non-owner to unlock after a time travel", async () => {
      let result = await contractInstance.lockHodl(1, {value: amount, from: owner});
      let hodlId = result.logs[0].args.hodlId.toNumber();

      await time.increase(172800);
      // Trying to unlock with a random address
      await utils.shouldThrow(contractInstance.unlockHodl(hodlId, {from: otherAddress}));
    });
  });

})
