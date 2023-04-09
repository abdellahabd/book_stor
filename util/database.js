const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "new_schema",
  "root",
  "abdellah2002",
  {
    dialect: "mysql",
    host: "localhost",
    storage: "./session.mysql",
  },
  { logging: false }
);

module.exports = sequelize;
