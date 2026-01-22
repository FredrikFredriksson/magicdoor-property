const { catchAsync } = require('../utils/errorHandler');
const AIChatbotService = require('../services/aiChatbotService');
const ChatbotInteraction = require('../models/ChatbotInteraction');

// FIX: Don't instantiate at module load time — create lazily on first request
let chatbotService = null;
const getChatbotService = () => {
  if (!chatbotService) chatbotService = new AIChatbotService();
  return chatbotService;
};

exports.processMessage = catchAsync(async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  const response = await getChatbotService().processMessage(userId, message);

  res.status(200).json({
    success: true,
    data: { message: response, timestamp: new Date() }
  });
});

exports.saveFeedback = catchAsync(async (req, res) => {
  const { userMessage, botResponse, isHelpful } = req.body;
  const userId = req.user._id;

  await ChatbotInteraction.create({
    user: userId, userMessage, botResponse, isHelpful, timestamp: new Date()
  });

  await getChatbotService().updateAnalytics(userId, isHelpful);

  res.status(200).json({ success: true, message: 'Feedback saved successfully' });
});