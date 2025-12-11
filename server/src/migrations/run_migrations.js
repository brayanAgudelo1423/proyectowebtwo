const fs = require('fs')
const path = require('path')
const sequelize = require('../config/database')
const Sequelize = require('sequelize')

async function run() {
  const migrationsDir = path.join(__dirname)
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.js') && f !== 'run_migrations.js').sort()
  const qi = sequelize.getQueryInterface()
  for (const f of files) {
    const mpath = path.join(migrationsDir, f)
    const m = require(mpath)
    if (m && typeof m.up === 'function') {
      try {
        console.log('Running migration', f)
        await m.up(qi, Sequelize)
      } catch (err) {
        console.error('Migration failed', f, err.message || err)
      }
    }
  }
  await sequelize.close()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
