const userController = require('../controllers/userController');
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.get('/me', authMiddleware(['user', 'admin']), userController.getCurrentUser);
router.get('/me/addresses', authMiddleware(['user', 'admin']), addressController.getUserAddresses);
router.post('/me/addresses', authMiddleware(['user', 'admin']), addressController.addAddressToUser);
router.patch('/me/addresses/:id', authMiddleware(['user', 'admin']), addressController.updateUserAddress);
router.delete('/me/addresses/:id', authMiddleware(['user', 'admin']), addressController.deleteUserAddress);


module.exports = router;
