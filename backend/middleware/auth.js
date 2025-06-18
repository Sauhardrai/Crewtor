import User from '../models/user.js'
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user info now available
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};



export const checkplan = async (req, res, next) => {
  const user = await User.findById(req.user.id); // assuming user is attached via auth middleware

  if ( new Date(user.planexp) < Date.now()||!user.isplan ) {
    user.isplan = false;
    await user.save();
  }

  next();
};
