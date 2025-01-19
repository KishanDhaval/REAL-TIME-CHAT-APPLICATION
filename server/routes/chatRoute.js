const express = require("express");
const { requireSignin } = require("../middlewares/authMiddleware");
const { accessChat, getChats, createGroupChat ,renameGroup , removeFromGroup ,addToGroup} = require("../controllers/chatController");

const router = express.Router();


router.post("/",requireSignin, accessChat);

router.get("/",requireSignin, getChats);

router.post("/group",requireSignin, createGroupChat);

router.put("/group/rename",requireSignin, renameGroup);

router.put("/group/add",requireSignin, addToGroup);

router.put("/group/remove",requireSignin, removeFromGroup);


module.exports = router;