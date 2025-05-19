const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const profCtrl = require('../controllers/profileController');
const addrCtrl = require('../controllers/addressController');

// Toutes les routes dans ce fichier exigent user ou admin
router.use(auth(['user', 'admin']));
router.use(require('../middlewares/loadUserProfile'));
// Profile
// GET      /api/profile    -> récupérer mon profil
// PATCH    /api/profile    -> mettre à jour mon profil
// DELETE   /api/profile    -> supprimer mon profil
router
    .route('/')
    .get(profCtrl.getMyProfile)
    .patch(profCtrl.updateMyProfile)
    .delete(profCtrl.deleteMyProfile);
router.get('/me', profCtrl.getMyProfile);

// Adresses liées à mon profil
// GET    /api/profile/addresses        -> lister mes adresses
// POST   /api/profile/addresses        -> créer une nouvelle adresse
// PATCH  /api/profile/addresses/:id    -> modifier l’adresse n°:id
// DELETE /api/profile/addresses/:id    -> supprimer l’adresse n°:id
router
    .route('/addresses')
    .get(addrCtrl.getUserAddresses)
    .post(addrCtrl.addAddressToUser);

router
    .route('/addresses/:id')
    .patch(addrCtrl.updateUserAddress)
    .delete(addrCtrl.deleteUserAddress);

module.exports = router;