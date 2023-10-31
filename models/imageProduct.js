const { Sequelize } = require("sequelize");
const sequelize = require("../util/database");

const ImageProduct = sequelize.define("imagesProduct", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  width: Sequelize.INTEGER,
  height: Sequelize.INTEGER,
  productId: Sequelize.INTEGER,
  url: Sequelize.STRING,
  filename: Sequelize.STRING,
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
})

module.exports = ImageProduct