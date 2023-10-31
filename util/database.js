const Sequelize = require("sequelize");
const sequelize = new Sequelize("ecommerse", "newuser", "123456", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
