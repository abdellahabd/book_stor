const experss = require("express");
const router = experss.Router();
const adminController = require("../Controllers/admin");

const isAuth = require("../middleware/is_auth");

router.get("/add_product", isAuth, adminController.getAddProduct);
router.post("/add_product", adminController.PsotADDProduct);
router.get("/products", isAuth, adminController.GetProductsAdmin);
router.get("/edit_products/:id", isAuth, adminController.GetEditProduct);
router.post("/edit_products", adminController.PostEditProduct);
router.get("/delete_products/:id", isAuth, adminController.DeleteProduct);
router.get("/Download", isAuth, adminController.GetDownload);
module.exports = router;
