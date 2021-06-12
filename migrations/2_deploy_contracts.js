const Hodler = artifacts.require("Hodler");

module.exports = function(deployer) {
  deployer.deploy(Hodler);
}
