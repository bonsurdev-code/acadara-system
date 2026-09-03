import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { User } from '../models/index.js';
import { verifyGoogleToken } from '../services/oauth.service.js';
import { sendOTPEmail } from '../services/email.service.js';

export const register = async (req, res) => {
  try {
    const { usr_name, usr_email, usr_password } = req.body;
    if (!validator.isEmail(usr_email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }
    const domain = usr_email.split('@')[1];
    if (['example.com', 'example.us', 'mailinator.com'].includes(domain)) {
      return res.status(400).json({ message: 'Domain not allowed for registration.' });
    }
    const existingUser = await User.findOne({ where: { usr_email } });
    if (existingUser) {
      // FIX: Use usr_is_verified instead of is_verified
      if (!existingUser.usr_is_verified) {
        return res.status(400).json({
          message: 'Email registered but not verified. Please verify your OTP.',
          is_unverified: true,
          usr_email
        });
      }

      return res.status(400).json({
        message: 'Email already registered and verified.'
      });
    }

    const hashedPassword = await bcrypt.hash(usr_password, 10);
    const usr_id = "USR" + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Generate 6-digit numeric OTP and set 10-min expiration
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await User.create({
      usr_id,
      usr_name,
      usr_email,
      usr_password: hashedPassword,
      usr_otp: otp,
      usr_otp_expires_at: otpExpires,
      usr_is_verified: false
    });

    await sendOTPEmail({ to: usr_email, otp });

    res.status(201).json({ 
      message: "Registration successful. OTP sent to your email.",
      usr_email 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { usr_email, otp } = req.body;

    if (!usr_email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ where: { usr_email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.usr_is_verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.usr_otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    if (new Date() > new Date(user.usr_otp_expires_at)) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    user.usr_is_verified = true;
    user.usr_otp = null;
    user.usr_otp_expires_at = null;
    await user.save();

    // Auto-login upon successful verification
    const token = jwt.sign(
      { usr_id: user.usr_id, usr_role: user.usr_role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.MODE === 'prod',
      sameSite: process.env.MODE === 'prod' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }).status(200).json({ message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { usr_email } = req.body;

    const user = await User.findOne({ where: { usr_email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.usr_is_verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.usr_otp = otp;
    user.usr_otp_expires_at = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail({ to: usr_email, otp });

    res.status(200).json({ message: "New OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { usr_email, usr_password } = req.body;

    const user = await User.findOne({ where: { usr_email } });
    if (!user) return res.status(404).json({ message: "User not found, Please sign up first" });

    if (!user.usr_is_verified) {
      return res.status(403).json({ message: "Please verify your email before logging in.", is_unverified: true });
    }

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
      maxAge: 24 * 60 * 60 * 1000
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
    } else {
      return res.status(400).json({ message: "Invalid provider" });
    }

    const { email, name, provider_id } = profile;

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