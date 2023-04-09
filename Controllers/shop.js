const Products = require("../models/products");
const Cart = require("../models/cart");
const User = require("../models/User");

exports.GETindex = (req, res, next) => {
  let page = req.query.page;
  if (!page) {
    page = 1;
  }
  const skipped = (page - 1) * 2;
  Products.findAll({ offset: skipped, limit: 2 })
    .then((Products) => {
      res.render("shop/index", {
        products: Products,
        pagetitle: "shop",
      });
    })
    .catch((err) => {
      console.log("from Get INdex" + err);
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
  req.user
    .getCart()
    .then((cart) => {
      if (!cart) {
        if (!cart) {
          return req.user.createCart();
        }
      }
      return cart.getProducts().then((cartProducts) => {
        res.render("shop/cart", {
          path: "/cart",
          pagetitle: "Your Cart",
          products: cartProducts,
        });
      });
    })
    .catch((err) => {
      res.redirect("/");
      console.log(err);
    });
};
exports.PostCart = (req, res, next) => {
  const prodid = req.body.productID;
  let fetchcart;

  req.user
    .getCart()
    .then((cart) => {
      if (!cart) {
        return req.user.createCart();
      }
      fetchcart = cart;
      return cart.getProducts({ where: { id: prodid } }).then((Product) => {
        prd = Product[0];
        let newqtn = 1;
        if (!prd) {
          return Products.findByPk(prodid).then((prd1) => {
            return fetchcart.addProducts(prd1, { through: { qnt: newqtn } });
          });
        } else {
          let oldqnt = prd.CartItem.qnt;
          newqtn = oldqnt + 1;
          return fetchcart.addProducts(prd, { through: { qnt: newqtn } });
        }
      });
    })
    .then((r) => {
      res.redirect("/cart");
    });
};
exports.Getchekout = (req, res, next) => {
  res.render("shop/chekout", {
    pagetitle: "chekout",
    LogIn: req.session.logidIn,
  });
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
  req.user.getCart().then((cart) => {
    return cart
      .getProducts({ where: { id: prodId } })
      .then((Prods) => {
        console.log(Prods[0]);
        return Prods[0].CartItem.destroy();
      })
      .then((resg) => {
        res.redirect("/cart");
      });
  });
};
exports.GetOrder = (req, res, next) => {
  req.user.getOrders({ include: ["products"] }).then((orders) => {
    res.render("shop/orders", {
      pagetitle: "Your order",
      orders: orders,
    });
  });
};
exports.PostAddOrder = (req, res, next) => {
  let fetchcart;
  req.user
    .getCart()
    .then((cart) => {
      fetchcart = cart;
      return cart.getProducts();
    })
    .then((Prods) => {
      return req.user.createOrder().then((order) => {
        return order.addProducts(
          Prods.map((pre) => {
            pre.OrderItem = { qnt: pre.CartItem.qnt };
            return pre;
          })
        );
      });
    })
    .then((res) => {
      return fetchcart.setProducts(null);
    })
    .then(res.redirect("/order"));
};
