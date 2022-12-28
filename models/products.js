const Sequelize=require('sequelize');

const sequelize=require("../util/database");

const Product=sequelize.

// const Cart = require("../modules/cart");
// const db = require("../util/database");
// module.exports = class Product {
//   constructor(id, title, imgaurl, price, description) {
//     this.id = id;
//     this.title = title;
//     this.imgaurl = imgaurl;
//     this.description = description;
//     this.price = price;
//   }
//   save() {
//     return db.execute(
//       "Insert into products (title,price,description,imageurl) values(?,?,?,?)",
//       [this.title, this.price, this.description, this.imgaurl]
//     );
//   }

//   static fetchall() {
//     return db.execute("Select * from products");
//   }

//   static findbyid(PID) {
//     return db.execute("select * from products where id=? ", [PID]);
//   }
//   static deletebyid(id) {

//   }
// };
