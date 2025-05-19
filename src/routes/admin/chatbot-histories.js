const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const hist    = require('../../controllers/chatbotHistoryController');

router.use(auth(['admin']));

router.get('/', hist.listChatbotHistories);

module.exports = router;
