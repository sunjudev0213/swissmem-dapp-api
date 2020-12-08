const db = require('../db.js').sequelize;
const signature = require('./signature');

const models = {
  signature,
};

const init = () => {
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
