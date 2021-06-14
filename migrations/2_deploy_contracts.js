const Hodler = artifacts.require("Hodler");
const HodlToken = artifacts.require("HodlToken");

module.exports = function(deployer) {
  deployer.deploy(HodlToken);
  deployer.deploy(Hodler);
}
