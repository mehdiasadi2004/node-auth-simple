const express = require("express")
const { registerUser, loginUser, changePasswordController } = require("../controller/auth-controller")
const authMiddleware = require("../middleware/auth-middleware")
const router = express.Router()



// all auth routes 

router.post("/register",registerUser)

router.post("/login",loginUser)

router.post("/changePass",authMiddleware, changePasswordController);

module.exports = router