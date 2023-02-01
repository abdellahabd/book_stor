const Products = require("../models/products");
const User = require("../models/User");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-products", {
    pagetitle: "ADD Product",
    editmod: false,
    path: "/admin/add_product",
  });
};
exports.GetEditProduct = (req, res, next) => {
  const editmod = req.query.edit;
  const Pid = req.params.id;
  if (editmod) {
    Products.findByPk(Pid).then((prod) => {
      res.render("admin/edit-products", {
        pagetitle: "edit Products",
        editmod: editmod,
        prod: prod,
      });
    });
  }
};
exports.PostEditProduct = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const imageurl = req.body.imageurl;
  const Price = req.body.Price;
  const desciptions = req.body.desciptions;
  Products.update(
    {
      title: title,
      imageurl: imageurl,
      price: Price,
      desciptions: desciptions,
    },
    { where: { id: id } }
  ).then(() => {
    res.redirect("/admin/products");
  });
};
exports.PsotADDProduct = (req, res, next) => {
  const title = req.body.title;
  const imageurl = req.body.imageurl;
  const price = req.body.Price;
  const desciptions = req.body.desciptions;
  req.user
    .createProduct({
      title: title,
      price: price,
      description: desciptions,
      imageurl: imageurl,
    })
    .then(() => {
      console.log("tuble created ");
      res.redirect("/");
    })
    .catch((errr) => {
      console.log(errr);
    });
};

exports.GetProductsAdmin = (req, res, next) => {
  Products.findAll()
    .then((products) => {
      res.render("admin/products", {
        products: products,
        pagetitle: "Admin Product",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.DeleteProduct = (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Products.findByPk(id)
    .then((p) => {
      return p.destroy();
    })
    .then((result) => {
      res.redirect("/admin/products");
    });
};
