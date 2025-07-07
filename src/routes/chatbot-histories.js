const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const hist    = require('../controllers/chatbotHistoryController');

router.get('/', auth(['user','admin']), hist.listChatbotHistories);

module.exports = router;
