const Products = require("../models/products");
const Cart = require("../models/cart");
const { where } = require("sequelize");

exports.GETindex = (req, res, next) => {
  Products.findAll()
    .then((Products) => {
      res.render("shop/index", { products: Products, pagetitle: "shop" });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.GETProducts = (req, res, next) => {
  Products.findAll().then((Products) => {
    res.render("shop/product-list", {
      products: Products,
      pagetitle: "Products",
    });
  });
};

exports.GetCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Products.findAll().then((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pagetitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};
exports.PostCart = (req, res, next) => {
  const prodid = req.body.productID;
  Products.findByPk(prodid, (product) => {
    Cart.addPROd(prodid, product.price);
  });
  res.redirect("/cart");
};
exports.Getchekout = (req, res, next) => {
  res.render("shop/chekout", { pagetitle: "chekout" });
};

exports.GetOrder = (req, res, next) => {
  res.render("shop/orders", { pagetitle: "Your order" });
};
exports.GETByID = (req, res, next) => {
  const PID = req.params.productID;
  Products.findByPk(PID)
    .then((product) => {
      res.render("shop/product-details", {
        pagetitle: product.title,
        pro: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Products.findbyid(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};
