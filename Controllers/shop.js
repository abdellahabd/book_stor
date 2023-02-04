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
  req.user.getCart().then((cart) => {
    return cart.getProducts().then((cartProducts) => {
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
  let fetchcart;
  req.user
    .getCart()
    .then((cart) => {
      fetchcart = cart;
      return cart.getProducts({ where: { id: prodid } });
    })
    .then((Product) => {
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
    })
    .then((r) => {
      res.redirect("/cart");
    });
};
exports.Getchekout = (req, res, next) => {
  res.render("shop/chekout", { pagetitle: "chekout" });
};

exports.GetOrder = (req, res, next) => {
  req.user.getOrders({ include: ["products"] }).then((orders) => {
    res.render("shop/orders", { pagetitle: "Your order", orders: orders });
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
  req.user.getCart().then((user) => {
    return user
      .getProducts({ where: { id: prodId } })
      .then((Prods) => {
        console.log(Prods);
        return Prods[0].cartItem.destroy();
      })
      .then((resg) => {
        res.redirect("/cart");
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
