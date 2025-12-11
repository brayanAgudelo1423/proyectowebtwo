const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Cancha', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: true },
    pricePerHour: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
    status: { type: DataTypes.ENUM('disponible', 'mantenimiento', 'ocupada'), defaultValue: 'disponible' },
    location: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'canchas'
  });
};
