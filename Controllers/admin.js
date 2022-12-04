const Products = require("../modules/products");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/add_product", {
    pagetitle: "ADD Product",
    path: "/admin/add_product",
  });
};

exports.PsotADDProduct = (req, res, next) => {
  const title = req.body.title;
  const imageurl = req.body.imageurl;
  const price = req.body.Price;
  const desciptions = req.body.desciptions;
  const prod = new Products(title, imageurl, desciptions, price);
  prod.save();
  res.redirect("/");
};

exports.GetProductsAdmin = (req, res, next) => {
  Products.fetchall((product) => {
    res.render("admin/products", {
      products: product,
      pagetitle: "Admin Product",
    });
  });
};
