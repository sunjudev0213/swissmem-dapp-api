const Sequelize = require('sequelize');
const db = require('../db.js');

module.exports = db.sequelize.define(
  'donate',
  {
    transactionHash: Sequelize.STRING,
    blockNumber: Sequelize.NUMBER,
    logIndex: Sequelize.NUMBER,

    // Return values
    sender: Sequelize.STRING,
    token: Sequelize.STRING,
    receiverId: Sequelize.STRING,
    amount: Sequelize.STRING,
    receivedCSTK: Sequelize.STRING,
    status: Sequelize.STRING,
    homeTx: Sequelize.STRING,
  },
  {
    indexes: [
      {
        fields: ['sender'],
      },
      {
        fields: ['status'],
      },
      {
        unique: true,
        fields: ['transactionHash'],
      },
    ],
  },
);
