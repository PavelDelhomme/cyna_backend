const express = require('express');
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const ctl = require("../controllers/cartController");

// L’utilisateur authentifié récupère SES paniers
router.get('/', auth(['user', 'admin']), ctl.listCarts);

// L’utilisateur authentifié peut créer un panier
router.post('/', auth(['user', 'admin']), ctl.createCart);

// ajouter des produits côté user dans le panier (nécessaire obligatoireement pour une plateforme de e-commerce)
router.post('/:cartId/product/:productId', auth(['user','admin']), ctl.addProductToCart);
// ajouter des services côté user dans le panier (nécessaire obligatoireement pour une plateforme de e-commerce)
router.post('/:cartId/service/:serviceId', auth(['user','admin']), ctl.addServiceToCart);


module.exports = router;