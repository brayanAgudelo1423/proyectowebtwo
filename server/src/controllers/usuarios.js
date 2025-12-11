const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

//Lista usuarios
const list = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: ['id', 'name', 'email', 'role'] });
    return res.json(usuarios);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'internal server error' });
  }
};

// Llamar usuario por id
const get = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const usuario = await Usuario.findByPk(id, { attributes: ['id', 'name', 'email', 'role'] });
    if (!usuario) return res.status(404).json({ message: 'not found' });
    return res.json(usuario);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'internal server error' });
  }
};

//Editar usuario
const update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await Usuario.findByPk(id);
    if (!user) return res.status(404).json({ message: 'not found' });

    const { name, email, password, role } = req.body || {};
    if (email && email !== user.email) {
      const exists = await Usuario.findOne({ where: { email } });
      if (exists) return res.status(409).json({ message: 'email already in use' });
      user.email = email;
    }
    if (name) user.name = name;
    if (password) {
      if (password.length < 6) return res.status(400).json({ message: 'password must be at least 6 characters' });
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    // Solo admin puede cambiar el rol
    if (role && req.user && req.user.role === 'admin') {
      if (!['usuario', 'admin'].includes(role)) return res.status(400).json({ message: 'invalid role' });
      user.role = role;
    }

    await user.save();
    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'internal server error' });
  }
};

//Eliminar usuario
const remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await Usuario.findByPk(id);
    if (!user) return res.status(404).json({ message: 'not found' });
    await user.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'internal server error' });
  }
};

module.exports = { list, get, update, remove };
