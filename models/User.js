const { DataTypes } = require("sequelize");
const Sequelize = require("../util/database");

const User = Sequelize.define("user", {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    allownull: false,
  },
  restToken: { type: DataTypes.STRING },
  restTokenExperation: { type: DataTypes.DATE },
});

module.exports = User;
