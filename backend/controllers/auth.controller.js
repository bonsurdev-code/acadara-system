import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { verifyGoogleToken, verifyFacebookToken } from '../services/oauth.service.js';

export const register = async (req, res) => {
  try {
    const { usr_name, usr_email, usr_password } = req.body;

    const hashedPassword = await bcrypt.hash(usr_password, 10);
    const usr_id = "USR" + Math.random().toString(36).substring(2, 8).toUpperCase()

    const user = await User.create({
      usr_id: usr_id,
      usr_name,
      usr_email,
      usr_password: hashedPassword
    });

    const token = jwt.sign(
      { usr_id: user.usr_id, usr_role: user.usr_role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.MODE === 'prod', 
      sameSite: process.env.MODE === 'prod' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }).status(201).json({ message: "User registered successfully"});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { usr_email, usr_password } = req.body;

    const user = await User.findOne({ where: { usr_email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPass = await bcrypt.compare(usr_password, user.usr_password);
    if (!validPass) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { usr_id: user.usr_id, usr_role: user.usr_role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.MODE === 'prod', 
      sameSite: process.env.MODE === 'prod' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }).status(200).json({ message: "Logged in successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token').status(200).json({ message: "Logged out successfully" });
};

export const oauthLogin = async (req, res) => {
  try {
    const { provider, token } = req.body;

    let profile;

    if (provider === "google") {
      profile = await verifyGoogleToken(token);
    } else if (provider === "facebook") {
      profile = await verifyFacebookToken(token);
    } else {
      return res.status(400).json({ message: "Invalid provider" });
    }

    const { email, name, provider_id, avatar } = profile;

    // 1. Find user by provider OR email
    let user = await User.findOne({
      where: { provider, provider_id }
    });

    if (!user && email) {
      user = await User.findOne({
        where: { usr_email: email }
      });
    }
    const hashedPassword = await bcrypt.hash('Acadara2026!', 10);
    // 2. Create if not exists
    if (!user) {
      user = await User.create({
        usr_id: "USR" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        usr_name: name,
        usr_email: email,
        provider,
        provider_id,
        usr_password: hashedPassword
      });
    }

    // 3. Generate JWT (same as your login)
    const jwtToken = jwt.sign(
      { usr_id: user.usr_id, usr_role: user.usr_role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.MODE === 'prod',
      sameSite: process.env.MODE === 'prod' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({ message: "OAuth login success" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OAuth failed" });
  }
};