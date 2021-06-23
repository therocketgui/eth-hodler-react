const Hodler = artifacts.require("Hodler");
// const HodlToken = artifacts.require("HodlToken");
const Dex = artifacts.require("Dex");

// module.exports = async function(deployer) {
//   deployer.deploy(HodlToken).then(function() {
//     // Give address to Dex contract on Deployment
//     return deployer.deploy(Dex, HodlToken.address);
//   });
//   deployer.deploy(Hodler);

// }

module.exports = async function(deployer) {
  deployer.deploy(Hodler).then(function() {
    // Give address to Dex contract on Deployment
    return deployer.deploy(Dex, Hodler.address);
  });
}
