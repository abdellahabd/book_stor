const { DataTypes } = require("sequelize");
const seq = require("../util/database");

const Order = seq.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = Order;
