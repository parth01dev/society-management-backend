import User from '../models/User.js';
import jwt from 'jsonwebtoken';
const { verify } = jwt;


export default async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found. Token invalid.' });
    }

    req.user = user; // attach user info for next handlers
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
