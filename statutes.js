const config = require('./config');

let statutesText;

const getStatutesText = async () => {
  if (!statutesText) {
    const hash = config.statutesHash;
    if (!hash) {
      //   console.error('Terms and Condition IFPS hash value is not defined!');
      return undefined;
    }

    statutesText = `I agree with statutes corresponding to IPFS hash ${hash}`;
  }

  return statutesText;
};

module.exports = { getStatutesText };
