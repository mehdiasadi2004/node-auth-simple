const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const router = express.Router();

router.get("/welcom", authMiddleware, (req, res) => {
  const {username,userId,role} = req.userInfo
  
    res.json({
    message: "welcome to home page",
    user :{
        _id:userId,
        role,
        username
    }
  });
});

module.exports = router;
