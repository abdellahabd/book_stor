const path = require("path");
const Bodypars = require("body-parser");
const express = require("express");
const sequelize = require("./util/database");

const Product = require("./models/products");
const User = require("./models/User");
const Cart = require("./models/cart");
const CartItem = require("./models/CertItem");
const Order = require("./models/Order");
const OrderItem = require("./models/OrderItem");

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

User.hasOne(Cart);
Cart.belongsTo(User);
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

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
    return user.createCart();
  })
  .then((res) => {
    app.listen(2000);
  })
  .catch((err) => {
    console.log(err);
  });
