const express = require('express');
const router = express.Router();
const teamCtrl = require('../controllers/teamController');

router.get('/', teamCtrl.list);
router.post('/', teamCtrl.create);
router.put('/:id', teamCtrl.update);
router.delete('/:id', teamCtrl.remove);

module.exports = router;