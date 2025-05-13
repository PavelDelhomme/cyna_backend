const { Chatbot } = require('../models');

exports.listChatbots = async (req, res) => {
    try {
        const chatbots = await Chatbot.findAll();
        res.json(chatbots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
