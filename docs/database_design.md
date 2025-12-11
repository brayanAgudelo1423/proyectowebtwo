# Diseño de la Base de Datos (versión final)

Entidades activas
- `usuarios`
- `canchas`
- `reservaciones`

Relaciones
- `Usuario` 1:N `Reservacion` 
- `Cancha` 1:N `Reservacion` 

Llaves primarias y foráneas
- `usuarios.id` (PK)
- `canchas.id` (PK)
- `reservaciones.id` (PK)
  - `reservaciones.usuarioId` -> `usuarios.id` (FK)
  - `reservaciones.canchaId` -> `canchas.id` (FK)

Campos recomendados por tabla
- `usuarios`: id, name, email (unique), passwordHash, role (`usuario|admin`), createdAt, updatedAt
- `canchas`: id, name, tipo, pricePerHour, status (`disponible|mantenimiento|ocupada`), location, createdAt, updatedAt
- `reservaciones`: id, usuarioId, canchaId, client, date (YYYY-MM-DD), hours , startAt, endAt, price, status (`Pendiente|Confirmada|Rechazada`), createdAt, updatedAt

Índices y restricciones
- Índice compuesto sugerido: `(canchaId, startAt, endAt)` para chequear solapes.
- Considerar `ON DELETE SET NULL` o `RESTRICT` en FK para evitar eliminación cascada accidental.

Diagrama ER (Mermaid)

    USUARIOS {
        INTEGER id PK
        STRING name
        STRING email
        STRING passwordHash
        STRING role
        STRING phone
    }
    CANCHAS {
        INTEGER id PK
        STRING name
        STRING tipo
        DECIMAL pricePerHour
        STRING status
        STRING location
    }
    RESERVACIONES {
        INTEGER id PK
        INTEGER usuarioId FK
        INTEGER canchaId FK
        STRING client
        DATE date
        STRING hours
        DATETIME startAt
        DATETIME endAt
        DECIMAL price
        STRING status
        STRING tipo
    }

    USUARIOS ||--o{ RESERVACIONES : "tiene"
    CANCHAS ||--o{ RESERVACIONES : "recibe"
```
