const configs = {
  dev: {
    environment: 'development',
    termsAndConditionsHash: 'QmYDmtmDYUPR6wjukzaNytibeNnYs41s2co4tNzkUYdd5n',
    statutesHash: 'QmcGNi9dcVgLJGtxJzjU2CyrrmVKkLnNPEK8JJC2a98zC5',
    mailTo: 'amin@giveth.io',
    rpcEndpointXdai: 'https://rpc.xdaichain.com/',
    RegistryAddress: '0x73e7427428f6C77C180d17F48909780c839954a7',
  },

  production: {
    environment: 'production',
  },
};
const config = process.env.NODE_ENV ? configs[process.env.NODE_ENV] : configs.dev;

module.exports = config;
