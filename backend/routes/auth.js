const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* ═════════════════════════════════════════════════════
   GENERATE JWT TOKEN
═════════════════════════════════════════════════════ */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "your-secret-key-change-in-prod",
    { expiresIn: "30d" }
  );
};

/* ═════════════════════════════════════════════════════
   REGISTER - POST /api/auth/register
═════════════════════════════════════════════════════ */
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      authProvider: "email"
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider
      }
    });
  } catch (err) {
    next(err);
  }
});

/* ═════════════════════════════════════════════════════
   LOGIN - POST /api/auth/login
═════════════════════════════════════════════════════ */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    if (!user.password) {
      return res.status(401).json({ error: "This account uses Google Sign-in. Please use Google to login." });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider
      }
    });
  } catch (err) {
    next(err);
  }
});

/* ═════════════════════════════════════════════════════
   VERIFY TOKEN - POST /api/auth/verify
═════════════════════════════════════════════════════ */
router.post("/verify", async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-in-prod");
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider
      }
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});


/* ═════════════════════════════════════════════════════
   GOOGLE SIGN-IN
   Client sends ID token obtained from Google Identity Services.
   Backend validates token with Google's public endpoint and
   creates or retrieves corresponding user record.
═════════════════════════════════════════════════════ */

const axios = require('axios');

router.post('/google', async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'ID token required' });
    }

    // verify token with Google
    const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    const googleResp = await axios.get(verifyUrl);
    const { email, name, sub: googleId } = googleResp.data;

    if (!email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    let user = await User.findOne({ email });
    if (user) {
      if (user.authProvider !== 'google') {
        user.authProvider = 'google';
        user.googleId = googleId;
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || 'Google User',
        email,
        googleId,
        authProvider: 'google'
      });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
