const experss = require("express");
const router = experss.Router();
const adminController = require("../Controllers/admin");

router.get("/add_product", adminController.getAddProduct);
router.post("/add_product", adminController.PsotADDProduct);
router.get("/products", adminController.GetProductsAdmin);
router.get("/edit_products/:id", adminController.GetEditProduct);
router.post("/edit_products", adminController.PostEditProduct);
router.get("/delete_products/:id", adminController.DeleteProduct);

module.exports = router;
