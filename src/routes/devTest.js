const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");


/**
 * Route de debug : accessible uniquement aux admins
 * GET /api/dev/admin-only
 */
router.get(
    '/admin-only',
    auth(['admin']),
    (req, res) => {
        res.json({ message: "Accès autorisé (admin)", user: req.user });
    }
);

module.exports = router;