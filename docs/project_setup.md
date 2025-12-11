# Setup del Proyecto (estado final)

Backend
- Ruta: `server/`
- Stack: Node.js + Express + Sequelize + SQLite (default) + sesiones (`express-session`).
- Dependencias clave: `express`, `express-session`, `sequelize`, `sqlite3`, `cors`, `dotenv`, `bcrypt`, `jsonwebtoken`; `nodemon` en dev.
- Estructura actual: `src/index.js`, `src/models/*`, `src/routes/*`, `src/config/database.js`.

Frontend
- Ruta: `playtime/`
- Stack: React + Vite.
- Dependencias clave: `react`, `react-dom`, `vite`,.

Instalación
- Backend: `cd server && npm install`
- Frontend: `cd playtime && npm install`

Ejecución
- Backend: `npm run dev` desde `server/` → http://localhost:3000
- Frontend: `npm run dev` desde `playtime/` → http://localhost:5173

Variables de entorno (backend)
- `PORT` (default 3000)
- `FRONTEND_ORIGIN` (default `http://localhost:5173`)
- `SESSION_SECRET` (default `changeme`)
- `DB_DIALECT` (default `sqlite`)
- `q` (ruta SQLite; default `./dev.sqlite`)

Notas prácticas
- Sesiones con cookie httpOnly, sameSite=lax.
- `sequelize.sync()` se ejecuta al inicio; para producción usar migraciones formales.

