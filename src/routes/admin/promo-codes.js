const promoCodeController = require('../controllers/promoCodeController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/', authMiddleware(['admin']), promoCodeController.createPromoCode);
router.get('/', authMiddleware(['admin']), promoCodeController.getAllPromoCodes);
router.post('/', authMiddleware(['admin']), promoCodeController.createPromoCode);
router.post('/:promoCodeId/roles/:roleId', authMiddleware(['admin']), promoCodeController.associatePromoToRole);

module.exports = router;
