# Entidades y Roles (versión final)

Entidades principales

- **Usuario**
  - `id` (PK, autoincrement)
  - `name`
  - `email` (unique)
  - `passwordHash`
  - `role` (`usuario` | `admin`)
  - `createdAt`, `updatedAt`

- **Cancha**
  - `id` (PK)
  - `name`
  - `tipo` (e.g., sintética, fútbol 5)
  - `pricePerHour`
  - `status` (`Disponible` | `mantenimiento` | `ocupada`)
  - `location`
  - `createdAt`, `updatedAt`

- **Reservacion**
  - `id` (PK)
  - `usuarioId` (FK -> Usuario.id)
  - `canchaId` (FK -> Cancha.id)
  - `client`
  - `date` (YYYY-MM-DD)
  - `hours` (franja mostrada)
  - `startAt` (datetime)
  - `endAt` (datetime)
  - `price`
  - `status` (`Pendiente` | `Confirmada` | `Rechazada`)
  - `createdAt`, `updatedAt`


Roles y permisos
- **admin**: CRUD de canchas, usuarios y reservaciones; aprobar/rechazar reservas; ver todas las reservas.
- **user**: crear reservas propias, ver/eliminar sus reservas, ver canchas disponibles.
