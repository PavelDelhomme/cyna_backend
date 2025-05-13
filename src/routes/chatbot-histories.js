const express = require('express');
const router = express.Router();
const chatbotHistoryController = require('../controllers/chatbotHistoryController');
const authMiddleware = require('../middlewares/authMiddleware');

// Lister les historiques de chatbots (user/admin)
router.get('/list-chatbot-histories', authMiddleware(['user', 'admin']), chatbotHistoryController.listChatbotHistories);

module.exports = router;
