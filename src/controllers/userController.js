const { isValidObjectId } = require('../utils/validators');
const User = require('../models/User');
const { serializeUser } = require('../utils/serializers');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1, role: 1, createdAt: 1, updatedAt: 1 }).sort({
      createdAt: -1
    });

    return res.json(users.map(serializeUser));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim(),
        email: email?.trim().toLowerCase(),
        role
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(serializeUser(user));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    if (req.user.id === req.params.id) {
      return res.status(400).json({ error: 'You cannot delete your own admin account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser
};
