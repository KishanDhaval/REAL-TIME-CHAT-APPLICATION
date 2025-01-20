const express = require('express');
const { requireSignin } = require('../middlewares/authMiddleware');
const { sendMessage, allMessages } = require('../controllers/messageController');

const router = express.Router();


router.post('/' ,requireSignin, sendMessage)


router.get('/:chatId' ,requireSignin, allMessages)

module.exports = router