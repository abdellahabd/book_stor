const experss = require("express");
const router = experss.Router();
const adminController = require("../Controllers/admin");

router.get("/add_product", adminController.getAddProduct);
router.post("/add_product", adminController.PsotADDProduct);
router.get("/products", adminController.GetProductsAdmin);

module.exports = router;
