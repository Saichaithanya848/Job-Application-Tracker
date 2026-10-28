const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware to verify JWT token and attach user to request object.
 * Protects private endpoints from unauthenticated access.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Bearer token exists in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token string after 'Bearer '
      token = req.headers.authorization.split(' ')[1];

      // Verify token signature and expiration
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_job_tracker_jwt_key_2026'
      );

      // Find user by id from decoded token payload, excluding password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: User no longer exists.',
        });
      }

      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Invalid or expired token.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided.',
    });
  }
};

module.exports = { protect };
