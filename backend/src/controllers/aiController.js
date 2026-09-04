const aiService = require('../services/aiService');
const { success, error } = require('../utils/response');

const chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return error(res, 'Message is required', 400);
    }
    const response = await aiService.chatWithAssistant(req.user.id, message.trim());
    return success(res, response);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  chat,
};
