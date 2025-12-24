const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register controller
const registerUser = async (req, res) => {
  try {
    // extract user info
    const { username, email, password, role } = req.body;

    // check if the user already exist

    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: " user with this email or user name exist",
      });
    }

    // hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user and save

    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newlyCreatedUser.save();

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "user register successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "user register failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      succsses: false,
      message: "internal server error",
    });
  }
};

// login controller
const loginUser = async (req, res) => {
  try {
    // extract user info
    const { username, password } = req.body;

    // check if the user already exist

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "invalid username",
      });
    }

    // if the password is corect

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({
        success: false,
        message: "password is wrong",
      });
    }

    // create token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );
    res.status(200).json({
      success: true,
      message: "login successfully",
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({
      succsses: false,
      message: "internal server error",
    });
  }
};


// change password controller

const changePasswordController = async (req,res)=>{
    try {
      const userId = req.userInfo.userId;
      const { oldPassword, newPassword } = req.body;

      // find user by id
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "user not found",
        });
      }

      // check old password
      const  isOldPasswordMatch = await bcrypt.compare(oldPassword,user.password)
      if (!isOldPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: "old password is incorrect",
        });
      }
      // hash new password
      const salt = await bcrypt.genSalt(10)
      const hashedNewPassword = await bcrypt.hash(newPassword,salt)

      // update password
      user.password = hashedNewPassword
      await user.save()

      res.status(200).json({
        success: true,
        message: "password changed successfully",
      });

    } catch (error) {
        res.status(500).json({
            succsses: false,
            message: "internal server error",
          });
    } 
  }

module.exports = { registerUser, loginUser, changePasswordController };
