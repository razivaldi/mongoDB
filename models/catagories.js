const { Sequelize } = require("sequelize");
const sequelize = require("../util/database");

const Category = sequelize.define("category", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title : Sequelize.STRING,
  
})

module.exports = Category