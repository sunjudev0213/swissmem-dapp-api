const seedData = require('../seedData/user-balance.json');

const env = process.env.NODE_ENV || 'development';
const data = seedData[env] || [];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const now = new Date();
      data.forEach((item) => {
        item.createdAt = now;
        item.updatedAt = now;
      });
      await queryInterface.bulkInsert('balances', data, {});
    } catch (e) {
      console.error(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'balances',
      {
        address: data.map((item) => item.address),
      },
      {},
    );
  },
};
