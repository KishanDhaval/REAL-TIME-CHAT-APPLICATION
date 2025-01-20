const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// create or access chat
const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId param not sent with request");
      res.status(400).json({
        success: false,
        message: "UserId param not sent with request",
        error: error.message,
      });
    }
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      res.status(200).send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send({
        success: true,
        message: "done",
        FullChat,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Problem while in chat stuff",
      error: error.message,
    });
  }
};

const getChats = async (req, res) => {
  try {
    var chats = await Chat.find({ users: req.user._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json({
      success: true,
      message: "Succesefully fetched!!!",
      chats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Problem while fething chats",
      error: error.message,
    });
  }
};

const createGroupChat = async (req, res) => {
  try {
    const {  name , users } = req.body;

    if (!users || !name)
      res.status(400).json({
        success: false,
        message: "Please Fill all the fields",
      });

    var modUsers = JSON.parse(users);

    if (modUsers.length < 2) {
      return res.status(400).json({
        success: false,
        message: "More than 2 users are required to form a group chat",
      });
    }

    modUsers.push(req.user);

    const groupChat = await Chat.create({
      chatName: name,
      users: modUsers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json({
      success: true,
      message: "Succesefully create!!!",
      fullGroupChat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Problem while creating group chats",
      error: error.message,
    });
  }
};

const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json({
        success: false,
        message: "Chat not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Succesefully changed!!!",
      updatedChat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Problem while changing group name",
      error: error.message,
    });
  }
};

const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const added =await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.status(404).json({
        success: false,
        message: "Chat not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Succesefully Added!!!",
      added,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Problem while adding to group",
      error: error.message,
    });
  }
};

const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const remove =await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!remove) {
      return res.status(404).json({
        success: false,
        message: "Chat not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Succesefully Added!!!",
      remove,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Problem while changing group name",
      error: error.message,
    });
  }
};

module.exports = {
  accessChat,
  getChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
