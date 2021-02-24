const { getUserBalance } = require('./service/balanceWatcher');

module.exports = (server) => {
  server.get('/balance/:address', (req, res) => {
    const { address } = req.params;

    getUserBalance(address)
      .then((balance) => {
        return res.send(200, { balance });
      })
      // eslint-disable-next-line no-unused-vars
      .catch((e) => {
	console.log(e);
        return res.send(404);
      });
  });
};
