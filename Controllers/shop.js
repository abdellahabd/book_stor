const Products = require("../modules/products");
const Cart = require("../modules/cart");

exports.GETindex = (req, res, next) => {
  Products.fetchall((product) => {
    res.render("shop/index", { products: product, pagetitle: "shop" });
  });
};
exports.GETProducts = (req, res, next) => {
  Products.fetchall((product) => {
    res.render("shop/product-list", {
      products: product,
      pagetitle: "Products",
    });
  });
};

exports.GetCart = (req, res, next) => {
  res.render("shop/cart", { pagetitle: "Cart" });
};
exports.PostCart = (req, res, next) => {
  const prodid = req.body.productID;
  Products.findbyid(prodid, (product) => {
    Cart.addPROd(prodid, product.price);
  });
  res.redirect("/");
};
exports.Getchekout = (req, res, next) => {
  res.render("shop/chekout", { pagetitle: "chekout" });
};

exports.GetOrder = (req, res, next) => {
  res.render("shop/orders", { pagetitle: "Your order" });
};
exports.GETByID = (req, res, next) => {
  const PID = req.params.productID;
  Products.findbyid(PID, (product) => {
    res.render("shop/product-details", {
      pagetitle: "Details",
      pro: product,
    });
  });
};
