const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Reservacion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, allowNull: true },
    canchaId: { type: DataTypes.INTEGER, allowNull: true },
    client: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    hours: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
    status: { type: DataTypes.ENUM('Pendiente', 'Confirmada', 'Rechazada'), defaultValue: 'Pendiente' },
    startAt: { type: DataTypes.DATE, allowNull: true },
    endAt: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'reservaciones'
  });
};
