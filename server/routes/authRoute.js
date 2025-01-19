const express = require("express");
const {
  registerController,
  loginController,
  updateProfile,
  updatePhoto,
  getUsers,
} = require("../controllers/authController");
const { requireSignin, isAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// router object
const router = express.Router();

// REGISTER || METHOD POST
router.post("/register", upload.single('pic'), registerController);

// LOGIN || METHOD POST
router.post("/login", loginController);

// UPDATE PROFILE
router.put("/update-profile",requireSignin, updateProfile);

// UPDATE PROFILE PHOTO
router.put('/update-photo/',requireSignin, upload.single('photo'), updatePhoto);

router.get('/users' ,requireSignin, getUsers);

module.exports = router;
