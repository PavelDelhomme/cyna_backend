const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const chat    = require('../../controllers/chatbotController');

router.use(auth(['admin']));

router.get('/', chat.listChatbots);

module.exports = router;
