const Products = require("../models/products");

const fs = require("fs");
const path = require("path");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-products", {
    pagetitle: "ADD Product",
    editmod: false,
    path: "/admin/add_product",
    errue: "",
    oldData: { title: "", price: "", desciptions: "" },
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
  const image = req.file;
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
  const image = req.file;
  const price = req.body.Price;
  const desciptions = req.body.desciptions;
  if (!image) {
    return res.status(400).render("admin/edit-products", {
      pagetitle: "Sing up",
      editmod: false,
      oldData: {
        title: title,
        price: price,
        desciptions: desciptions,
      },
      errue: "invalide image file",
    });
  }
  const imageurl = image.path;
  Products.create({
    title: title,
    price: price,
    description: desciptions,
    imageurl: imageurl,
  })
    .then(() => {
      console.log("Product created");
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

exports.GetDownload = (req, res, next) => {
  const filepath = path.join(
    "data",
    "invoices",
    "git-cheat-sheet-education.pdf"
  );
  const file = fs.createReadStream(filepath);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename='github sheet' ");
  file.pipe(res);
};
