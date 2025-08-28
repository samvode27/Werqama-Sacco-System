// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import MembershipApplication from '../models/MembershipApplication.js';

// ✅ Protect route (require valid token)
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // ✅ Check if user has approved membership
      const membership = await MembershipApplication.findOne({
        member: req.user._id,
        status: 'approved',
      });

      req.user.isMember = Boolean(membership);

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ✅ Role-based access control
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied: ${req.user.role}` });
    }

    next();
  };
};

// ✅ Special case: only approved members
export const memberOnly = (req, res, next) => {
  if (req.user && req.user.role === 'member' && req.user.isMember) {
    return next();
  }
  res.status(403).json({ message: 'Only approved members can access this feature' });
};
