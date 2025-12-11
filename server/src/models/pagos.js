const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Pago', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    reservacionId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
    status: { type: DataTypes.ENUM('pendiente', 'pagado', 'fallido'), defaultValue: 'pendiente' },
    method: { type: DataTypes.STRING, allowNull: true },
    transactionRef: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'pagos'
  });
};
