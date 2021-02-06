const { abi } = require('./contracts/minter.json');

class MinterClass {
  constructor(web3, address) {
    this.contract = new web3.eth.Contract(abi, address);
  }

  async getPastEvents(from = 0, to = 'latest') {
    return this.contract.getPastEvents('Donate', {
      fromBlock: String(from),
      toBlock: String(to),
    });
  }
}

module.exports = MinterClass;
