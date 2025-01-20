const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  const userId = req.user._id;
  if (!content || !chatId) {
    return res.status(400).json({
      success: false,
      message: "Invalid Data pass into requirst",
    });
  }

  var newMessage = {
    sender: userId,
    content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(
      req.body.chatId,
      { latestMessage: message },
      { new: true }
    );

    res.json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Problem while sending message",
    });
  }
};

const allMessages = async (req, res) => {
  const chatId = req.params.chatId;

  try {
    const message = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Problem while fetching chats",
    });
  }
};

module.exports = {
  sendMessage,
  allMessages,
};
