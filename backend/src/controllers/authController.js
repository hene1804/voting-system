const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { secretKey } = require('../config');
const { v4: uuidv4 } = require('uuid');

// nodemailer
const nodemailer = require('nodemailer');

// Configure the transporter for Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'mmu.university11@gmail.com',
    pass: 'hsix qipc fuqh olsz',
  },
});

exports.createAdmin = async (req, res) => {
  try {
    // Verify JWT token - only existing admins can create other admins
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied, token missing' });
    }

    const decoded = jwt.verify(token, secretKey);
    
    // Find user by decoded email
    const requestingUser = await User.findOne({ email: decoded.email });
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied, only admins can create admins' });
    }

    const { firstName, lastName, email } = req.body;
    
    // Validate inputs
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required.' });
    }

    // Create admin user (with role set to 'admin')
    const adminUser = new User({
      firstName,
      lastName,
      email,
      emailVerified: true, // Admins created by admins are pre-verified
      role: 'admin'  // Set the role to admin
    });

    await adminUser.save();
    
    res.status(201).json({ message: 'Admin user created successfully', user: adminUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const emailCode = uuidv4().slice(0, 6);

    // Check for empty fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required.' });
    }

    // Custom validation for firstName
    if (!/^[a-zA-Z]+$/.test(firstName)) {
      return res.status(400).json({ error: 'First name must only contain alphabetical characters.' });
    }

    // Custom validation for lastName
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      return res.status(400).json({ error: 'Last name must only contain alphabetical characters.' });
    }

    // Custom validation for email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    // Check for unique email
    const isEmailUnique = await User.findOne({ email });
    if (isEmailUnique) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      emailVerified: false,
      emailVerificationCode: emailCode,
    });

    await user.save();

    // Send verification email
    const mailOptions = {
      from: 'mmu.university11@gmail.com',
      to: email,
      subject: 'Email Verification Code',
      text: `Welcome to YouVote, ${firstName} ${lastName}!\n\nThank you for registering on our platform. To complete your registration, please verify your email address by entering the following verification code in the app:\n\nVerification Code: ${emailCode}\n\nIf you did not request this code, please ignore this email.\n\nBest regards,\nThe YouVote Team`,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(201).json({ message: 'User registered successfully. Verification code sent to email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verification endpoint
exports.verify = async (req, res) => {
  try {
    const { email, emailCode } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify email if code provided
    if (emailCode && user.emailVerificationCode) {
      if (user.emailVerificationCode === emailCode) {
        user.emailVerified = true;
        await user.save();
        return res.status(200).json({ message: 'Email verified successfully.' });
      } else {
        return res.status(400).json({ error: 'Invalid email verification code' });
      }
    }

    res.status(400).json({ error: 'No verification code provided or needed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({ error: 'Email not verified' });
    }

    const loginId = uuidv4().slice(0, 18);
    const loginPassword = uuidv4().slice(0, 8);

    // Save the login ID and password temporarily
    user.loginId = loginId;
    user.loginPassword = loginPassword;
    await user.save();

    // Send login ID and password to email
    const mailOptions = {
      from: 'mmu.university11@gmail.com',
      to: user.email,
      subject: 'Login ID and Password',
      text: `Your login ID is:\n\n${loginId}\n\nand your password is:\n\n${loginPassword}\n\n`,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'Login credentials sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Endpoint to validate login ID and password
exports.validateLogin = async (req, res) => {
  try {
    const { email, loginId, loginPassword } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.loginId === loginId && user.loginPassword === loginPassword) {
      // Generate a JWT token
      const token = jwt.sign(
        { 
          id: user._id,
          email: user.email
        }, 
        secretKey, 
        { expiresIn: '1h' }
      );

      // Clear temporary login credentials
      user.loginId = undefined;
      user.loginPassword = undefined;
      await user.save();

      res.status(200).json({ message: 'Login successful', user, token });
    } else {
      res.status(400).json({ error: 'Invalid login ID or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};