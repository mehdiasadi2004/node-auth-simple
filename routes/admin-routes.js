const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const router = express.Router()


router.get("/welcom",authMiddleware ,adminMiddleware ,(req,res)=>{
    try {
       const { username, userId, role } = req.userInfo;

       res.json({
         message: "welcome to admin page",
         user: {
           _id: userId,
           role,
           username,
         },
       });
    } catch (error) {
      console.log(error)
    }
})

module.exports = router