const Accounts = require('web3-eth-accounts');
const models = require('./models');
const { getTermsAndConditionText } = require('./termsAndCondition');

const accounts = new Accounts();

module.exports = (server) => {
  // eslint-disable-next-line no-unused-vars
  server.get('/signature/:address', (req, res, next) => {
    const { address } = req.params;
    console.log(`Get signature for ${address}`);

    models.signature
      .findOne({
        where: { address: address.toLowerCase() },
      })
      .then((instance) => {
        return res.send(
          200,
          instance.get({
            plain: true,
          }),
        );
      })
      // eslint-disable-next-line no-unused-vars
      .catch((e) => {
        return res.send(404);
      });
  });

  // eslint-disable-next-line no-unused-vars
  server.post('/signature', async (req, res, next) => {
    const { body } = req;

    if (!body) {
      return req.send(401, 'Incorrect request format');
    }

    const { signature, message, address } = body;
    if (!address) {
      return res.send(401, 'address missing');
    }
    if (!signature) {
      return res.send(401, 'signature missing');
    }
    if (!message) {
      return res.send(401, 'message missing');
    }

    const termsAndCondition = await getTermsAndConditionText();

    if (termsAndCondition !== message) {
      return res.send(401, "message doesn't match with terms and condition");
    }

    const publicAddress = accounts.recover(message, signature);
    if (publicAddress.toLowerCase() !== address.toLowerCase()) {
      return res.send(401, 'message is not signed by claimed wallet address');
    }

    const result = await models.signature.findOne({
      where: { address },
    });

    if (!result || result.length === 0) {
      await models.signature.findOrCreate({
        where: { address: address.toLowerCase() },
        defaults: {
          message,
          address: address.toLowerCase(),
          signature,
        },
      });
      return res.send(200);
    }

    return res.send(401, 'Signature already exists');
  });
};
