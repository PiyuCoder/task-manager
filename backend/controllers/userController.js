const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are mandatory" });
    }

    const newUser = await new User({
      name,
      email,
      password,
    });

    await newUser.save();

    return res
      .status(200)
      .json({ success: "true", message: "Signed Up successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error creating user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are mandatory" });
    }

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found. Please register" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //jwt payload
    const payload = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error logging in " });
  }
};

exports.searchUsers = async (req, res) => {
  const { search } = req.query;

  try {
    const users = await User.find({
      $or: [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    }).limit(10);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
