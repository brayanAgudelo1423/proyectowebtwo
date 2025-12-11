const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Usuario = require('./usuarios')(sequelize);
const Cancha = require('./canchas')(sequelize);
const Reservacion = require('./reservaciones')(sequelize);
const Pago = require('./pagos')(sequelize);

// Relaciones
Usuario.hasMany(Reservacion, { foreignKey: 'usuarioId' });
Reservacion.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Cancha.hasMany(Reservacion, { foreignKey: 'canchaId' });
Reservacion.belongsTo(Cancha, { foreignKey: 'canchaId' });

Reservacion.hasOne(Pago, { foreignKey: 'reservacionId' });
Pago.belongsTo(Reservacion, { foreignKey: 'reservacionId' });

module.exports = { sequelize, Sequelize, Usuario, Cancha, Reservacion, Pago };