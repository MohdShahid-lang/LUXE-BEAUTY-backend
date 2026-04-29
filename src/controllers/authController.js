const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { toId } = require('../utils/serializers');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'shahid@gmail.com').trim().toLowerCase();

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const role = normalizedEmail === ADMIN_EMAIL ? 'admin' : 'user';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role
    });

    return res.status(201).json({
      message: 'User registered successfully',
      userId: toId(user._id),
      role: user.role
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const effectiveRole =
      user.role === 'admin' || normalizedEmail === ADMIN_EMAIL ? 'admin' : 'user';

    if (normalizedEmail === ADMIN_EMAIL && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const token = jwt.sign({ id: toId(user._id), role: effectiveRole }, JWT_SECRET, {
      expiresIn: '1d'
    });

    return res.json({ token, role: effectiveRole, name: user.name, id: toId(user._id) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const normalizedEmail = user.email.trim().toLowerCase();
    const effectiveRole =
      user.role === 'admin' || normalizedEmail === ADMIN_EMAIL ? 'admin' : 'user';

    if (normalizedEmail === ADMIN_EMAIL && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    return res.json({
      id: toId(user._id),
      name: user.name,
      role: effectiveRole
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  me
};
