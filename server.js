const path = require("path");
const Bodypars = require("body-parser");
const multer = require("multer");
const express = require("express");
const sequelize = require("./util/database");
const session = require("express-session");
const SequelizeStor = require("connect-session-sequelize")(session.Store);
const mystor = new SequelizeStor({
  db: sequelize,
});

const flash = require("connect-flash");

const Product = require("./models/products");
const User = require("./models/User");
const Cart = require("./models/cart");
const CartItem = require("./models/CertItem");
const Order = require("./models/Order");
const OrderItem = require("./models/OrderItem");

const shopRoute = require("./Router/shop");
const adminRoute = require("./Router/admiin");
const authRoute = require("./Router/auth");

const eruerRoute = require("./Controllers/eruer");

const app = express();

const filestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Math.random().toString() + "-" + file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "EJS");
app.set("views", "Views");

app.use(Bodypars.urlencoded({ extended: false }));
app.use(multer({ storage: filestorage, fileFilter: filter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "abdellah2002",
    resave: true,
    saveUninitialize: false,
    store: mystor,
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.LogIn = req.session.logidIn;
  next();
});

app.use((req, res, next) => {
  const id = req.session.user_id;
  if (!id) {
    return next();
  }
  User.findByPk(id).then((user) => {
    req.user = user;
    next();
  });
});
app.use("/admin", adminRoute);

app.use(shopRoute);

app.use(authRoute);

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
  .then((res) => {
    return mystor.sync();
  })

  .then((result) => {
    app.listen(2000);
  })
  .catch((err) => {
    console.log(err);
  });
