module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear Tabla
    await queryInterface.createTable('reservaciones', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      canchaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      client: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      hours: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Pendiente','Confirmada','Rechazada'),
        allowNull: false,
        defaultValue: 'Pendiente'
      },
      startAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      endAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('reservaciones')
  }
}
