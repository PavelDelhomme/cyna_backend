// routes/devTest.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

app.use("/api/dev", require('./routes/devTest'));
app.use("/api/admin/dev", require('./routes/admin/devTest'));

router.get('/admin-only', auth('admin'), (req, res) => {
  res.json({ message: "Accès autorisé (admin)", user: req.user });
});

module.exports = router;
