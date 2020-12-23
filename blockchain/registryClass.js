const { abi } = require('./contracts/registry.json');

class RegistryClass {
  constructor(web3, address) {
    this.web3 = web3;
    this.address = address;
  }

  async getContributors() {
    const contract = new this.web3.eth.Contract(abi, this.address);
    const contributors = await new Promise((resolve, reject) => {
      contract.methods.getContributors().call((err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });

    return contributors;
  }
}

module.exports = RegistryClass;
