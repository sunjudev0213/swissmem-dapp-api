const config = require('./config');

let termAndConditions;

const getTermsAndConditionText = async () => {
  if (!termAndConditions) {
    const hash = config.termsAndConditionsHash;
    if (!hash) {
      console.error('Terms and Condition IFPS hash value is not defined!');
      return undefined;
    }

    termAndConditions = `I agree with Terms and Conditions corresponding to IPFS hash ${hash}`;
  }

  return termAndConditions;
};

module.exports = { getTermsAndConditionText };
