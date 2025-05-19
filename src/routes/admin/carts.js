const express   = require("express");
const router    = express.Router();
const auth      = require("../../middlewares/authMiddleware");
const ctrl      = require("../../controllers/cartController");

router.use(auth(["admin"]));

router.get("/",                             ctrl.listCarts);
router.post("/",                            ctrl.createCart);
router.post("/user/:userId",                ctrl.createCartForUser);
router.post("/:cartId/product/:productId",  ctrl.addProductToCart);
router.post("/:cartId/service/:serviceId",  ctrl.addServiceToCart);

module.exports = router;