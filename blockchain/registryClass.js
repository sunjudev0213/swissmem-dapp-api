const { abi } = require('./contracts/registry.json');

class RegistryClass {
  constructor(web3, address) {
    this.contract = new web3.eth.Contract(abi, address);
  }

  async getContributors() {
    return new Promise((resolve, reject) => {
      this.contract.methods.getContributors().call((err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }

  async getMaxTrust(address) {
    return new Promise((resolve, reject) => {
      this.contract.methods.getMaxTrust(address).call((err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }
}

module.exports = RegistryClass;
