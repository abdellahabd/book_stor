const path = require("path");
const Bodypars = require("body-parser");
const express = require("express");
const sequelize = require("./util/database");

const Product = require("./models/products");
const User = require("./models/User");

const shopRoute = require("./Router/shop");
const adminRoute = require("./Router/admiin");
const eruerRoute = require("./Controllers/eruer");

const app = express();

app.set("view engine", "EJS");
app.set("views", "Views");

app.use(Bodypars.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findByPk(1).then((user) => {
    req.user = user;
    next();
  });
});
app.use("/admin", adminRoute);

app.use(shopRoute);

app.use(eruerRoute);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  .sync({ force: false })
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name_user: "abdellah",
        email: "abdellahouazene2002@gmal.com",
      });
    }
    return user;
  })
  .then((user) => {
    app.listen(2000);
  })
  .catch((err) => {
    console.log(err);
  });
