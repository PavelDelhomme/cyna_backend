const { Chatbot, ChatbotHistory } = require('../models');


exports.listChatbots = async (req, res) => {
    const chatbots = await Chatbot.findAll();
    res.json(chatbots);
};

exports.listChatbotHistories = async (req, res) => {
    const histories = await ChatbotHistory.findAll();
    res.json(histories);
};
