require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}));

app.use('/api', routes);

app.get('/', (req, res) => res.send('Backend de Gestión de Reservas'));

async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB conectada');
    // Sync simple para evitar alter que dispara backups y constraints en datos sucios
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
