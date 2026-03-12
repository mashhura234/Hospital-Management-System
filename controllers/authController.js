const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// -----------------------------------------------
// REGISTER
// -----------------------------------------------
const register = async (req, res) => {
  try {
    // Get data sent from frontend
    const { name, email, password, role } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if email already exists in database
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE email = ?', [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Hash the password before saving (never save plain text password!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user to database
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    // Send success response
    res.status(201).json({
      message: 'User registered successfully!',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// -----------------------------------------------
// LOGIN
// -----------------------------------------------
const login = async (req, res) => {
  try {
    // Get data sent from frontend
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user by email in database
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?', [email]
    );

    // If no user found
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];

    // Compare entered password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Create JWT token (expires in 7 days)
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send token and user info to frontend
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

module.exports = { register, login };