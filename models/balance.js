const Sequelize = require('sequelize');
const db = require('../db.js');

module.exports = db.sequelize.define(
  'balance',
  {
    address: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    balance: Sequelize.STRING,
  },
  {
    indexes: [
      {
        fields: ['address'],
      },
    ],
  },
);
