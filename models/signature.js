const Sequelize = require("sequelize");
const db = require("../db.js");

module.exports = db.sequelize.define("signature", {
    address: Sequelize.STRING,
    signature: Sequelize.TEXT,
});
