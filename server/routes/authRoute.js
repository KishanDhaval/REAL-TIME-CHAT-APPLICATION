const express = require("express");
const {
  registerController,
  loginController,
  updateProfile,
  updatePhoto,
  getAllSavedSubmission,
  getAllUser,
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

// GETIING ALL SAVED ELEMENTS
router.get('/saved-submissions/',requireSignin, getAllSavedSubmission);


router.get('/users' ,requireSignin,isAdmin, getAllUser);


module.exports = router;
