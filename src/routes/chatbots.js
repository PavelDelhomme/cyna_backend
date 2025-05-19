const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const chat    = require('../controllers/chatbotController');

router.get('/', auth(['user','admin']), chat.listChatbots);

module.exports = router;
