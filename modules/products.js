const fs = require("fs");
const path = require("path");
const p = path.join(__dirname, "..", "data", "product.json");
const GETProductsfromfile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    const prods = JSON.parse(fileContent);
    return cb(prods);
  });
};

module.exports = class Product {
  constructor(title, imgaurl, description, price) {
    this.title = title;
    this.imgaurl = imgaurl;
    this.description = description;
    this.price = price;
  }
  save() {
    this.id = Math.random().toString();
    GETProductsfromfile((product) => {
      product.push(this);
      fs.writeFile(p, JSON.stringify(product), (err) => {
        console.log(err);
      });
    });
  }
  static fetchall(cb) {
    GETProductsfromfile(cb);
  }
  static findbyid(PID, cb) {
    GETProductsfromfile((products) => {
      const prodp = products.find((p) => {
        return p.id === PID;
      });
      cb(prodp);
    });
  }
};
