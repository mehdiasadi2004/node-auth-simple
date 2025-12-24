const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  const user = req.userInfo;
    if(user.role !== "admin"){
        return res.status(403).json({
            success : false,
            message : "access denied! admin rights required."
        })

    }
    next()
};

module.exports = adminMiddleware;
