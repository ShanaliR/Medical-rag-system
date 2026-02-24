const express = require("express");
const router = express.Router();
const {
  signupDoctor,
  loginDoctor,
} = require("../controllers/authController");

router.post("/signup", signupDoctor);
router.post("/login", loginDoctor);

module.exports = router;