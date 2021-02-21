const configs = {
  dev: {
    environment: 'development',
    termsAndConditionsHash: 'QmYDmtmDYUPR6wjukzaNytibeNnYs41s2co4tNzkUYdd5n',
    statutesHash: 'QmcGNi9dcVgLJGtxJzjU2CyrrmVKkLnNPEK8JJC2a98zC5',
    mailTo: 'amin@giveth.io',
    rpcEndpointXdai: 'https://rpc.xdaichain.com/',
    RegistryAddress: '0x73e7427428f6C77C180d17F48909780c839954a7',
    MinterAddress: '0x7b2708986699565c87C9832Efa12bC6DBDC141d7',
    minterDeployedBlock: 1000,
    requiredConfirmationXdai: 1,
  },

  production: {
    environment: 'production',
    termsAndConditionsHash: 'QmYDmtmDYUPR6wjukzaNytibeNnYs41s2co4tNzkUYdd5n',
    statutesHash: 'QmcGNi9dcVgLJGtxJzjU2CyrrmVKkLnNPEK8JJC2a98zC5',
    mailTo: 'amin@giveth.io',
    rpcEndpointXdai: 'https://rpc.xdaichain.com/',
    RegistryAddress: '0x73e7427428f6C77C180d17F48909780c839954a7',
    MinterAddress: '0x9f92813542Fc66Cd0e530501b4ec62B982B0dEb9',
    minterDeployedBlock: 1000,
    requiredConfirmationXdai: 1,
  },
};
const config = process.env.NODE_ENV ? configs[process.env.NODE_ENV] : configs.dev;

module.exports = config;
