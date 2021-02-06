const Sequelize = require('sequelize');
const db = require('../db.js');

module.exports = db.sequelize.define('blockNumber', {
  networkName: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  lastCheckedBlock: Sequelize.NUMBER,
});
