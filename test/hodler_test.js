
const Hodler = artifacts.require("Hodler");

var expect = require('chai').expect;
const utils = require('./helpers/utils');
// const time = require("./helpers/time");
const { time } = require('@openzeppelin/test-helpers');

contract("Hodl", (accounts) => {
  let owner = accounts[1];
  let otherAddress = accounts[5];
  let randomAddress = accounts[8];
  let contractInstance;
  let amount = web3.utils.toWei('0.0001', 'ether');
  console.log(accounts);

  beforeEach(async () => {
    contractInstance = await Hodler.new();
  })

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

  xit("should get the current price (feed)", async () => {

    // r = await contractInstance.getThePrice({from: owner});
    r = await contractInstance.getThePrice().then((roundData) => {
        // Do something with roundData
        console.log("Latest Round Data", roundData.toNumber())
    });;
    // console.log(r);
    // console.log(r.);
  });

  xit("should add a locked Hodl", async () => {

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

  xit("should add two locks with two accounts and have appropriate ownership", async () => {
    let result = await contractInstance.lockHodl(1, {value: amount, from: owner});
    let hodlId = result.logs[0].args.hodlId.toNumber();

    await time.increase(172800);
    // Trying to unlock with a random address
    await utils.shouldThrow(contractInstance.unlockHodl(hodlId, {from: otherAddress}));
  });

  xit("it should add a backup address", async () => {
    let result = await contractInstance.lockHodl(1, {value: amount, from: owner});
    const _hodlId = result.logs[0].args.hodlId.toNumber();

    _r = await contractInstance.modifyHodlBackup(_hodlId, otherAddress, {from: owner});
    _t = await contractInstance.hodls(_hodlId);
    // console.log(_t);

    expect(_r.receipt.status).to.equal(true);
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
