const experss = require("express");
const path = require("path");
const shopController = require("../Controllers/shop");

const router = experss.Router();
router.get("/", shopController.GETindex);

router.get("/products", shopController.GETProducts);

router.get("/cart", shopController.GetCart);
router.post("/cart", shopController.PostCart);
router.post("/cart-delete-item", shopController.postCartDeleteProduct);

router.get("/order", shopController.GetOrder);
router.get("/chekout", shopController.Getchekout);

router.post("/add-order", shopController.PostAddOrder);

router.get("/products/:productID", shopController.GETByID);
module.exports = router;
