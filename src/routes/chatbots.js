const express = require('express');
const router = express.Router();

const chatbotController = require("../controllers/chatbotController");
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/list-chatbots', authMiddleware(['user', 'admin']), chatbotController.listChatbots);

module.exports = router;