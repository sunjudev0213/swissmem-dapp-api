const configs = {
  dev: {
    environment: 'development',
    termsAndConditionsHash: 'QmSFUeiDNFmMUgrm811buxSePzhMFEKkvj9L54ih7JNMsN',
    mailTo: 'amin@giveth.io',
    rpcEndpointXdai: 'https://rpc.xdaichain.com/',
    RegistryAddress: '0x26B451E9ADdf304a1261F5e5A420E6230fFFCBC7', // this is on XDAI chain
  },

  production: {
    environment: 'production',
  },
};
const config = process.env.NODE_ENV ? configs[process.env.NODE_ENV] : configs.dev;

module.exports = config;
