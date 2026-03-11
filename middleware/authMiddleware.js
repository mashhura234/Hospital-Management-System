const jwt = require('jsonwebtoken');
require('dotenv').config();

// This function protects routes — only logged in users can access them
const verifyToken = (req, res, next) => {

  // Get the token from request header
  const authHeader = req.headers['authorization'];

  // Check if token exists
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Token format is: "Bearer TOKEN_VALUE"
  // So we split by space and take the second part
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user info into request object for later use
    req.user = decoded;

    // Move on to the next function
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Extra middleware — only allow admin role
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// Extra middleware — only allow doctor role
const verifyDoctor = (req, res, next) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Access denied. Doctors only.' });
  }
  next();
};

// Extra middleware — only allow patient role
const verifyPatient = (req, res, next) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ message: 'Access denied. Patients only.' });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin, verifyDoctor, verifyPatient };