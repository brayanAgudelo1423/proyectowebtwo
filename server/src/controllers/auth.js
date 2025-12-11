const bcrypt = require('bcrypt');
const { Usuario } = require('../models');


//Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password are required' });
    if (password.length < 6) return res.status(400).json({ message: 'password must be at least 6 characters' });

    const existing = await Usuario.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'email already in use' });

    // Siempre crea usuarios con rol 'usuario'
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await Usuario.create({ name, email, passwordHash, role: 'usuario' });

    // Create session for the new user (auto-login)
    req.session.user = { id: user.id, role: user.role, name: user.name, email: user.email };
    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'internal server error' });
  }
};


//Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });

    const user = await Usuario.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'invalid password' });

    // Create session for the user
    req.session.user = { id: user.id, role: user.role, name: user.name, email: user.email };
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'internal server error' });
  }
};

// Return current logged-in user from session
const me = async (req, res) => {
  try {
    if (!req.session || !req.session.user) return res.status(401).json({ message: 'not authenticated' });
    return res.json({ user: req.session.user });
  } catch (err) {
    console.error('Error in me:', err);
    return res.status(500).json({ message: 'internal server error' });
  }
};

// Logout: destroy session and clear cookie
const logout = (req, res) => {
  if (!req.session) return res.status(200).json({ message: 'logged out' });
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session', err);
      return res.status(500).json({ message: 'logout failed' });
    }
    // Best effort clear (default cookie name connect.sid)
    res.clearCookie('connect.sid');
    return res.json({ message: 'logged out' });
  });
};

module.exports = { register, login, me, logout };
