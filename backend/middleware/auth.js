import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import MembershipApplication from '../models/MembershipApplication.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

// memberOnly checks only role === 'member'
export const memberOnly = (req, res, next) => {
  if (req.user && req.user.role === 'member') {
    next();
  } else {
    res.status(403).json({ message: 'Only approved members can access this feature' });
  }
};
