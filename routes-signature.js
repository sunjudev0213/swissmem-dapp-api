const Accounts = require('web3-eth-accounts');
const models = require('./models');
const { getTermsAndConditionText } = require('./termsAndCondition');
const { getStatutesText } = require('./statutes');
const sendMail = require('./mail/dappMailer');
const { isUserWhiteListed, getMaxTrust } = require('./service/whitelist');

const accounts = new Accounts();

module.exports = (server) => {
  server.get('/signature/:key', (req, res) => {
    const { key } = req.params;

    models.signature
      .findOne({
        where: { key: key.toLowerCase() },
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

  server.get('/whitelist/:address', (req, res) => {
    const { address } = req.params;

    // console.log(`Get user is white listed for ${address}`);

    isUserWhiteListed(address)
      .then((r) => {
        // console.log('response:', r);
        return res.send(200, { whitelisted: r });
      })
      .catch((e) => res.send(500, e));
  });

  server.get('/maxtrust/:address', (req, res) => {
    const { address } = req.params;

    // console.log(`Get user is white listed for ${address}`);

    getMaxTrust(address)
      .then((r) => {
        // console.log('response:', r);
        return res.send(200, { maxtrust: r });
      })
      .catch((e) => res.send(500, e));
  });

  // eslint-disable-next-line no-unused-vars
  server.post('/signature', async (req, res, next) => {
    const { body } = req;

    if (!body) {
      return req.send(401, 'Incorrect request format');
    }

    const { signature, message, type } = body;
    const address = body.address && body.address.toLowerCase();
    if (!address) {
      return res.send(401, 'address missing');
    }
    if (!signature) {
      return res.send(401, 'signature missing');
    }
    if (!message) {
      return res.send(401, 'message missing');
    }
    if (!type) {
      return res.send(401, 'type missing');
    }

    const termsAndCondition = await getTermsAndConditionText();
    const statutes = await getStatutesText();

    switch (type) {
      case 'tandc':
        if (termsAndCondition !== message) {
          return res.send(401, "message doesn't match with terms and condition");
        }
        if (accounts.recover(message, signature).toLowerCase() !== address) {
          return res.send(401, 'message is not signed by claimed wallet address');
        }
        break;
      case 'statutes':
        if (statutes !== message) {
          return res.send(401, `message doesn't match with statutes ${statutes} !== ${message})`);
        }
        if (accounts.recover(message, signature).toLowerCase() !== address) {
          return res.send(401, 'message is not signed by claimed wallet address');
        }
        break;
      default:
        return res.send(401, 'unknown signature type');
    }

    const key = `${address}_${type}`;

    const result = await models.signature.findOne({
      where: { key },
    });

    if (!result || result.length === 0) {
      await models.signature.findOrCreate({
        where: { key },
        defaults: {
          message,
          address,
          key,
          signature,
        },
      });
      sendMail(key, signature);
      return res.send(200);
    }

    return res.send(401, 'Signature already exists');
  });
};
