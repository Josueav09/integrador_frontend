# GNN Crime AI — Frontend

Frontend del sistema predictivo **GNN Crime AI** (Integrador 2).

## Requisitos

- Node.js 18+
- npm

## Desarrollo

```bash
npm install
npm run dev
```

Abrir http://localhost:5173

## Flujo de la app

1. **Auth** (`/login`, `/register`, recuperación de contraseña)
2. Tras iniciar sesión → **Dashboard** (`/dashboard`)
3. Módulos: mapa, predicciones, análisis, red GNN, métricas, monitor IA, administración

La sesión se guarda en `localStorage` (mock). Las rutas del dashboard están protegidas.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run test` | Pruebas Vitest en modo watch |
| `npm run test:run` | Ejecutar suite de pruebas (CI) |
| `npm run test:coverage` | Pruebas + reporte HTML en `coverage/index.html` |

## Pruebas automatizadas (APF3)

Suite con **Vitest** + **Testing Library**:

- Login, registro, rutas protegidas (`ProtectedRoute` / `GuestRoute`)
- Contexto de autenticación JWT
- Validación de carga CSV/JSON (`uploadValidation`)
- Mensajes de error API (`apiError`)

Los elementos interactivos incluyen `data-testid` para pruebas E2E (Selenium/Playwright).

```bash
npm run test:coverage
```

Capturas del reporte en `coverage/index.html` para el informe APF3.

## Rama

Desarrollo en rama **`matias`**.

Remoto: https://github.com/MB2534/Frontend---Integrador-2.git
