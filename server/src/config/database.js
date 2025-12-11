const { Sequelize } = require('sequelize');

const dialect = process.env.DB_DIALECT || 'sqlite';

const common = {
  dialect,
  logging: false,
};

let sequelize;

if (dialect === 'sqlite') {
  const storage = process.env.q || './dev.sqlite';
  sequelize = new Sequelize({ ...common, storage });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      ...common,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || undefined,
    }
  );
}

module.exports = sequelize;
