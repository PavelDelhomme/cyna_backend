const express = require('express');
const router = express.Router();
const roles = require('../controllers/roleController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware(['admin']));

router
    .route('/')
    .get(roles.getAllRoles)
    .post(roles.createRole);

router.delete('/:id', roles.deleteRole);

module.exports = router;
