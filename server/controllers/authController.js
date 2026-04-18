
/* =====================================================
   4. controllers/authController.js
   ===================================================== */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

/* REGISTER */

exports.registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


/* LOGIN */

exports.loginUser = async (req, res) => {
  console.log("LOGIN ROUTE HIT");

  try {


    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
  { id: user._id, name: user.name }, // ✅ add name
  process.env.JWT_SECRET || "secret123",
  { expiresIn: "1d" }
);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


/* LOGOUT */

exports.logoutUser = async (req, res) => {

  res.json({
    message: "Logged out successfully"
  });

};


