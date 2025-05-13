const { ChatbotHistory } = require('../models');

exports.listChatbotHistories = async (req, res) => {
    try {
        const histories = await ChatbotHistory.findAll();
        res.json(histories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
