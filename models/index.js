const db = require('../db.js').sequelize;
const signature = require('./signature');
const balance = require('./balance');
const blockNumber = require('./blockNumber');
const donate = require('./donate');

const models = {
  signature,
  balance,
  blockNumber,
  donate,
};

const init = () => {
/*  models['balance'].destroy({ truncate: true });
  models['blockNumber'].destroy({ truncate: true });
  models['donate'].destroy({ truncate: true });
*/
  return Promise.all([
    Object.keys(models).map((key) => {
      console.log('model', key, typeof models[key]);
      return models[key].sync();
    }),
  ]);
};

module.exports = {
  sequelize: db,
  init,
  ...models,
};
