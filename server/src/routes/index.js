const express = require('express');
const router = express.Router();

// Importar rutas
const authRoutes = require('./auth');
const usuariosRoutes = require('./usuarios');
const { requireRole } = require('../middleware/auth');


router.get('/canchas', async (req, res) => {
  const { Cancha } = require('../models');
  const canchas = await Cancha.findAll();
  res.json(canchas);
});

// Create cancha (admin only)
router.post('/canchas', requireRole('admin'), async (req, res) => {
  try {
    const { Cancha } = require('../models');
    const body = req.body || {};

    // Normalize input
    const name = body.name && body.name.trim();
    const type = body.type || null;
    const pricePerHour = body.pricePerHour != null ? body.pricePerHour : body.price; // allow price alias
    const status = body.status || undefined;
    const location = body.location || null;

    if (!name) return res.status(400).json({ message: 'name is required' });
    const priceValue = pricePerHour != null ? Number(pricePerHour) : 0;
    if (Number.isNaN(priceValue)) return res.status(400).json({ message: 'pricePerHour must be a number' });
    if (status && !['disponible','mantenimiento','ocupada'].includes(status)) return res.status(400).json({ message: 'invalid status' });

    const c = await Cancha.create({ name, type, pricePerHour: priceValue, status, location });
    res.status(201).json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating cancha' });
  }
});

// Update cancha (admin only)
router.put('/canchas/:id', requireRole('admin'), async (req, res) => {
  try {
    const { Cancha } = require('../models');
    const id = Number(req.params.id);
    const cancha = await Cancha.findByPk(id);
    if (!cancha) return res.status(404).json({ message: 'Cancha not found' });
    await cancha.update(req.body);
    res.json(cancha);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating cancha' });
  }
});

// Delete cancha (admin only)
router.delete('/canchas/:id', requireRole('admin'), async (req, res) => {
  try {
    const { Cancha } = require('../models');
    const id = Number(req.params.id);
    const cancha = await Cancha.findByPk(id);
    if (!cancha) return res.status(404).json({ message: 'Cancha not found' });
    await cancha.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting cancha' });
  }
});

router.post('/reservaciones', async (req, res) => {
  try {
    const { Reservacion } = require('../models');
    const body = req.body || {}

    // Accept aliases: name -> client, pricePerHour/price -> price
    const client = body.client || body.name
    const date = body.date
    const hours = body.hours
    const priceRaw = body.price != null ? body.price : body.pricePerHour
    const price = priceRaw != null ? Number(priceRaw) : null
    const usuarioId = body.usuarioId != null ? Number(body.usuarioId) : null
    const canchaId = body.canchaId != null ? Number(body.canchaId) : null
    const startAt = body.startAt || null
    const endAt = body.endAt || null

    if (!client || !date || !hours) return res.status(400).json({ message: 'client, date y hours son requeridos' })
    if (canchaId === null || Number.isNaN(canchaId)) return res.status(400).json({ message: 'canchaId es requerido y debe ser numérico' })
    if (price === null || Number.isNaN(price)) return res.status(400).json({ message: 'price es requerido y debe ser numérico' })

    const r = await Reservacion.create({ client, date, hours, price, usuarioId, canchaId, startAt, endAt, status: 'Pendiente' })
    res.status(201).json(r)
  } catch (err) {
    console.error('Error creating reservacion:', err)
    res.status(500).json({ message: 'Error creating reservacion', error: err.message })
  }
});

// List all reservaciones
router.get('/reservaciones', async (req, res) => {
  try {
    const { Reservacion } = require('../models');
    const list = await Reservacion.findAll();
    res.json(list);
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error listing reservaciones' })
  }
});

// Update reservation status (admin only)
router.put('/reservaciones/:id/status', requireRole('admin'), async (req, res) => {
  try {
    const { Reservacion } = require('../models')
    const id = Number(req.params.id)
    const { status } = req.body
    if (!['Pendiente','Confirmada','Rechazada'].includes(status)) return res.status(400).json({ message: 'Invalid status' })
    const r = await Reservacion.findByPk(id)
    if (!r) return res.status(404).json({ message: 'Reservacion not found' })
    r.status = status
    await r.save()
    res.json(r)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating status' })
  }
})

// Delete reservation
router.delete('/reservaciones/:id', async (req, res) => {
  try {
    const { Reservacion } = require('../models')
    const id = Number(req.params.id)
    const r = await Reservacion.findByPk(id)
    if (!r) return res.status(404).json({ message: 'Reservacion not found' })
    
    // Verify ownership: user can only delete their own reservation
    const user = req.session && req.session.user
    if (user && user.id !== r.usuarioId) return res.status(403).json({ message: 'Cannot delete other users reservations' })
    
    await r.destroy()
    res.json({ message: 'Reservacion deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error deleting reservacion', error: err.message })
  }
})

router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);

module.exports = router;
