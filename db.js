const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: path.join(__dirname, './data/reststore'),
  logging: false,
});

const constants = {
  //   publicationstatus: {
  //     DRAFT: 0,
  //     PUBLISHED: 1
  //   }
};

module.exports = { sequelize, constants };
