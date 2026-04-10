const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token' });
  }
};

const adminAuth = (req, res, next) => {
  try {
    auth(req, res, () => {
      try {
        if (req.user.role !== 'admin') {
          return res.status(403).json({ error: 'Admin access required' });
        }

        return next();
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  auth,
  adminAuth
};
