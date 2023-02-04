const { DataTypes } = require("sequelize");
const seq = require("../util/database");

const CartItem = seq.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  qnt: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = CartItem;
