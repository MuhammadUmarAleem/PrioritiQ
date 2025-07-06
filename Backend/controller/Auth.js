const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendVerificationEmail } = require("../utils/nodemailer");

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const generateVerificationToken = () => {
  const length = 8;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  
  let raw = '';
  for (let i = 0; i < length; i++) {
    const randIndex = crypto.randomInt(0, chars.length);
    raw += chars[randIndex];
  }

  const hashed = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hashed };
};


// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = hashPassword(password);

  try {
    let user = await User.findOne({ where: { email } });
    const { raw, hashed } = generateVerificationToken();

    if (user) {
      if (user.status === "active") {
        return res.status(409).json({ success: false, message: "User already exists and is active" });
      } else {
        await sendVerificationEmail(email, name, raw);
        return res.status(200).json({
          success: true,
          message: "Verification email re-sent",
          email,
          user_id: user.id,
          verify_token: hashed
        });
      }
    }

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      status: "inactive"
    });

    await sendVerificationEmail(email, name, raw);

    res.status(201).json({
      success: true,
      message: "User registered, verification email sent",
      user_id: user.id,
      email: user.email,
      verify_token: hashed
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// VERIFY USER TOKEN
exports.verifyUser = async (req, res) => {
  const { email, encryptedToken } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const originalEncryptedToken = hashPassword(req.body.originalToken); 

    if (encryptedToken !== originalEncryptedToken) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    user.status = "active";
    await user.save();

    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token: jwtToken,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password);

  try {
    const user = await User.findOne({ where: { email, password: hashedPassword } });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is not verified or has been deactivated"
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Update Password
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user || user.password !== hashPassword(currentPassword)) {
      return res.status(401).json({ success: false, message: "Current password incorrect" });
    }

    user.password = hashPassword(newPassword);
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token missing or invalid format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      success: true,
      message: "Token is valid",
      user: decoded // contains payload like { id: ..., iat: ..., exp: ... }
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

