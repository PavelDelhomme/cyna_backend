const express = require('express');
const router = express.Router();

const promoCodeController = require('../controllers/promoCodeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/promoCodes', authMiddleware(['admin']), promoCodeController.listPromoCodes);
router.post('/promoCodes/create', authMiddleware(['admin']), promoCodeController.listPromoCodes);

router.post('/promoCodes/:promoCodeId/associatePromoToRole/:promoCodeId', authMiddleware(['admin']), promoCodeController.associatePromoToRole);
router.post('/promoCodes/:promoCodeId/assignPromoToProduct/:productId', authMiddleware(['admin']), promoCodeController.assignPromoToProduct);
router.post('/promoCodes/:promoCodeId/assignPromoToService/:serviceId', authMiddleware(['admin']), promoCodeController.assignPromoToService);
router.post('/promoCodes/:promoCodeId/assignPromoToProductCategory/:categoryId', authMiddleware(['admin']), promoCodeController.assignPromoToProductCategory);


router.patch('/promoCodes/update/:promoCodeId', authMiddleware(['admin']), promoCodeController.updatePromoCode);
router.delete('/promoCodes/delete/:promoCodeId', authMiddleware(['admin']), promoCodeController.deletePromoCode);


module.exports = router;
