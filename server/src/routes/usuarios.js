const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios');
const { verifySession, requireRole, allowSelfOrRole } = require('../middleware/auth');

router.get('/', verifySession, requireRole('admin'), usuariosController.list);
router.get('/:id', verifySession, allowSelfOrRole('admin'), usuariosController.get);
router.put('/:id', verifySession, allowSelfOrRole('admin'), usuariosController.update);
router.delete('/:id', verifySession, requireRole('admin'), usuariosController.remove);

module.exports = router;
