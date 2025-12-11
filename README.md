# Gestión de Reserva de Canchas

Aplicación completa (frontend React + backend Express/Sequelize) para gestionar reservas de canchas de fútbol con roles de usuario y administrador.

## Funcionalidades principales
- Usuarios: registro/inicio de sesión, crear reservas, ver "Mis Reservas", eliminar reservas propias.
- Admin: panel para canchas (CRUD), usuarios (promover/eliminar), reservaciones (aprobar/rechazar).

## Estructura del proyecto
- `server/`: API Express, sesiones con `express-session`, ORM Sequelize con SQLite por defecto.
- `playtime/`: frontend React + Vite, consumo de API con cookies de sesión.
- `docs/`: documentación adicional (si aplica).

## Requisitos y dependencias
- Node.js 18+ y npm.
- Backend (server): express, express-session, sequelize, sqlite3 (por defecto), cors, dotenv, bcrypt, jsonwebtoken; nodemon (dev).
- Frontend (playtime): react, react-dom, vite (rolldown-vite), eslint opcional.

## Configuración rápida
1) Backend
	- `cd server`
	- `npm install`
	- Variables de entorno (opcional, ver sección abajo)
	- Arrancar: `npm run dev` (con nodemon) o `/server/src/node index.js`
2) Frontend
	- `cd playtime`
	- `npm install`
	- Desarrollo: `npm run dev` (Vite en http://localhost:5173 por defecto)

## Variables de entorno (backend)
- `PORT` (3000)
- `FRONTEND_ORIGIN` (default `http://localhost:5173`)
- `SESSION_SECRET` (default `changeme`)
- `DB_DIALECT` (default `sqlite`)

## Usuario admin
- "email":"admin1@example.com"
- "password":"tucontraseña"

## Manual de uso (breve)
- Acceso: inicia sesión o regístrate. Si tu rol es admin verás "Admin Dashboard".
- Reservar cancha: en el dashboard, entra a "Reservar Cancha", elige cancha, tipo, fecha y horas, confirma; verás un toast de éxito/error.
- Mis Reservas: muestra tus reservas; puedes eliminar las tuyas con confirmación.
- Admin > Reservaciones: lista completa; aprueba o rechaza reservas pendientes.
- Admin > Canchas: crea/edita/elimina canchas; visibles de inmediato al reservar.
- Admin > Usuarios: lista usuarios, promueve a admin o elimina.

## Scripts útiles
- Backend: `npm run dev`, `npm start`, `node index.js`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`

## Notas
- Las sesiones usan cookies .
