const configs = {
  dev: {
    environment: 'development',
    termsAndConditionsHash: 'QmSFUeiDNFmMUgrm811buxSePzhMFEKkvj9L54ih7JNMsN',
    mailTo: 'amin@giveth.io',
  },

  production: {
    environment: 'production',
  },
};
const config = process.env.NODE_ENV ? configs[process.env.NODE_ENV] : configs.dev;

module.exports = config;
