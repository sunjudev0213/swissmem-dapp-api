const Web3 = require('web3');
const { RegistryAddress, rpcEndpointXdai } = require('../config');
const RegistryClass = require('../blockchain/registryClass');

const web3 = new Web3(rpcEndpointXdai);

const registry = new RegistryClass(web3, RegistryAddress);

let contributorsCache = new Set();

const updateCache = async () => {
  const contributors = await registry.getContributors();
  contributorsCache = new Set(contributors.map((c) => c.toLowerCase()));
};

updateCache();

setInterval(() => {
  updateCache();
}, 60000); // Update every minute

const isUserWhiteListed = async (userAddress = '') => {
  return contributorsCache.has(userAddress.toLowerCase());
};
const getMaxTrust = async (userAddress) => {
  return registry.getMaxTrust(userAddress);
};

module.exports = {
  isUserWhiteListed,
  getMaxTrust,
}
