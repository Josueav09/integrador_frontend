# GNN Crime AI — Frontend

Frontend del sistema predictivo **GNN Crime AI** (Integrador 2).

## Inicio rápido (equipo / Selenium)

```bash
npm install
npm run dev              # Desarrollo → http://localhost:5173
npm run dev:selenium     # Suite E2E del equipo → http://localhost:3000
```

Backend en `http://localhost:8000` (ver README de `integrador_gnn`).

Opcional en `.env`:

```env
VITE_API_URL=http://localhost:8000
```

---

## Usuarios de prueba

| Email | Contraseña | Acceso |
|-------|------------|--------|
| `admin@pnp.gob.pe` | `TesisUTP2026*` | Todo el dashboard + administración |
| `analista@pnp.gob.pe` | `clave123` | Inbox, mapa, predicciones (sin admin) |
| `investigador@pnp.gob.pe` | `clave123` | Igual que admin en carga/retrain |

Ejecutar en backend: `python scripts/seed_e2e.py`

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (puerto 5173) |
| `npm run dev:selenium` | Puerto **3000** para STGNNTestSuite |
| `npm run build` | Build de producción |
| `npm run test:run` | Vitest (36 tests) |
| `npm run test:coverage` | Cobertura en `coverage/index.html` |

---

## Flujo de la app

1. **Denuncia pública** (`/reportar-denuncia`) — sin login
2. **Auth** (`/login`, `/register`, recuperación en 4 pasos)
3. **Dashboard** (`/dashboard`) — JWT en `localStorage`
4. Módulos: mapa, predicciones, análisis, red GNN, métricas, monitor, administración, inbox

---

## Cambios recientes (rama `matias`) — Usabilidad y Selenium

### Feedback uniforme
- **Denuncia pública**: `StatusBanner` + toast de éxito; mensaje con `data-testid="report-crime-success-message"`.
- **Dashboard**: spinner de carga y `data-testid="dashboard-ready"` al terminar KPIs.
- **Admin**: overlay `admin-loading`; confirmación antes de reentrenar; hint de formatos CSV/JSON.

### Navegación y roles
- **Sidebar**: enlace **Administración** visible solo para roles 1 y 3 (admin / investigador).
- **`data-testid` en menú**: `nav-dashboard`, `nav-map`, `nav-inbox`, `nav-admin`, etc.

### Inbox (cuarentena)
- Badge con cantidad de pendientes.
- Confirmación antes de **descartar** una denuncia.
- Botones con estado “Procesando…”.
- Primera fila mantiene `inbox-approve-btn` / `inbox-reject-btn` (contrato E2E); filas extra usan sufijo `-{id}`.
- Estado vacío con enlace al mapa.

### Recuperación de contraseña
- Indicador **Paso 1–4 de 4** en todo el flujo.
- Texto aclaratorio si usan `TEST_MODE` en backend (PIN en consola).

### Predicciones
- Resumen basado en datos reales de `/predict/detalles` (sin porcentajes hardcodeados).

### Denuncia pública (UX)
- Layout responsive (una columna en móvil).
- Estilos en `report-crime.css` (sin inline styles).
- Ayuda: “Haga clic en el mapa…”; borde verde cuando hay ubicación.

### Accesibilidad (previo)
- Menú ONPE: idiomas, contraste, perfiles, zoom — botón `a11y-trigger`.

### Carga de rutas
- `PageLoader` con `data-testid="page-loader"` (lazy routes).

---

## Pruebas E2E (Selenium)

Contrato congelado: `../CONTRATO_PRUEBAS_E2E.txt`

**Puerto Selenium:** `npm run dev:selenium` → `http://localhost:3000`

**Testids nuevos (aditivos, no reemplazan los congelados):**

| Testid | Uso |
|--------|-----|
| `page-loader` | Esperar carga lazy |
| `dashboard-ready` | Dashboard listo |
| `report-crime-success-message` | Éxito denuncia (test_01) |
| `nav-*` | Navegación estable |
| `inbox-pending-count` | Badge de pendientes |
| `admin-loading` | Admin cargando |

---

## Pruebas unitarias (Vitest)

```bash
npm run test:run
```

Cubre login, registro, rutas protegidas, validación de uploads y errores API.

---

## Rama y remoto

Desarrollo en **`matias`**.

- Fork: https://github.com/MB2534/Frontend---Integrador-2.git  
- Upstream equipo: https://github.com/Josueav09/integrador_frontend.git
