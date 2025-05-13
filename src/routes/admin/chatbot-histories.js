const express = require('express');
const router = express.Router();
const chatbotHistoryController = require('../../controllers/chatbotHistoryController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/list-chatbot-histories', authMiddleware(['admin']), chatbotHistoryController.listChatbotHistories);

module.exports = router;
