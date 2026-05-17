import bcrypt from 'bcrypt';

import User from '../../models/User.js';

import { generateToken } from '../../services/auth/jwtService.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(user);

    const sanitizedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      subscriptionStatus: user.subscriptionStatus,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      token,
      user: sanitizedUser
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user);

    const sanitizedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      subscriptionStatus: user.subscriptionStatus,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      token,
      user: sanitizedUser
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};