const { DataTypes } = require("sequelize");
const seq = require("../util/database");

const Cart = seq.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = Cart;
