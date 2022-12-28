const Products = require("../models/products");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-products", {
    pagetitle: "ADD Product",
    editmod: false,
    path: "/admin/add_product",
  });
};
//hfezfezgdnr
exports.GetEditProduct = (req, res, next) => {
  const editmod = req.query.edit;
  const Pid = req.params.id;
  if (editmod) {
    Products.findbyid(Pid, (prod) => {
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
  const newprod = new Products(id, title, imageurl, Price, desciptions);
  newprod.save();
  res.redirect("/admin/products");
};
exports.PsotADDProduct = (req, res, next) => {
  const title = req.body.title;
  const imageurl = req.body.imageurl;
  const price = req.body.Price;
  const desciptions = req.body.desciptions;
  const prod = new Products(null, title, imageurl, price, desciptions);

  prod
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.GetProductsAdmin = (req, res, next) => {
  Products.fetchall((product) => {
    res.render("admin/products", {
      products: product,
      pagetitle: "Admin Product",
    });
  });
};

exports.DeleteProduct = (req, res, next) => {
  const id = req.params.id;
  Products.deletebyid(id);
  res.redirect("/admin/products");
};
