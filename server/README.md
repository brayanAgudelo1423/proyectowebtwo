# Backend — Gestión de Reserva de Canchas

Esqueleto inicial del backend en Node.js + Express + Sequelize.

Quick start (desde la carpeta `server`):

1. Instalar dependencias:

```pwsh
npm install
```

2. Copiar `.env.example` a `.env` y ajustar variables.

3. Arrancar en modo desarrollo:

```pwsh
npm run dev
```

Notas

- Por defecto el proyecto está configurado para usar `sqlite` en desarrollo (archivo `dev.sqlite`).
- Los modelos se sincronizan automáticamente al arrancar (usar migraciones reales para producción).
