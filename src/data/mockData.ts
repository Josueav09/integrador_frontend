export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/dashboard/mapa', label: 'Mapa de Delitos', icon: 'map' },
  { path: '/dashboard/predicciones', label: 'Predicciones', icon: 'predict' },
  { path: '/dashboard/analisis', label: 'Análisis', icon: 'analysis' },
  { path: '/dashboard/red-gnn', label: 'Red GNN', icon: 'network' },
  { path: '/dashboard/metricas', label: 'Métricas Modelo', icon: 'metrics' },
  { path: '/dashboard/monitor', label: 'Monitor IA', icon: 'monitor' },
  { path: '/dashboard/administracion', label: 'Administración', icon: 'admin' },
  { path: '/dashboard/denuncias', label: 'Bandeja Denuncias', icon: 'predict' },
] as const

export const DASHBOARD_KPIS = [
  { label: 'Delitos Hoy', value: '23', change: '+1.5%', icon: 'pulse', tone: 'blue' },
  { label: 'Zonas Críticas', value: '5', change: '+2', icon: 'pin', tone: 'orange' },
  { label: 'Nivel de Riesgo', value: 'Alto', sub: 'Zona Centro', icon: 'warning', tone: 'red' },
  { label: 'Predicción 24h', value: '34', change: '+10%', icon: 'trend', tone: 'purple' },
]

export const CRIMES_BY_TYPE = [
  { name: 'Robo', value: 85, color: '#ef4444' },
  { name: 'Asalto', value: 62, color: '#f97316' },
  { name: 'Vandalismo', value: 38, color: '#eab308' },
  { name: 'Fraude', value: 22, color: '#3b82f6' },
]

export const WEEKLY_TREND = [
  { day: 'Lun', value: 32 },
  { day: 'Mar', value: 28 },
  { day: 'Mié', value: 35 },
  { day: 'Jue', value: 42 },
  { day: 'Vie', value: 48 },
  { day: 'Sáb', value: 55 },
  { day: 'Dom', value: 40 },
]

export const RECENT_ALERTS = [
  { zone: 'Centro Histórico', time: 'Hace 15 min', level: 'Alta' as const },
  { zone: 'Zona Industrial', time: 'Hace 1 hora', level: 'Media' as const },
  { zone: 'Barrio Norte', time: 'Hace 2 horas', level: 'Alta' as const },
]

export const MAP_DISTRICTS = [
  { name: 'Comas', risk: 80, x: 42, y: 12 },
  { name: 'Los Olivos', risk: 75, x: 38, y: 22 },
  { name: 'San Juan de Lurigancho', risk: 92, x: 58, y: 28 },
  { name: 'San Martín de Porres', risk: 70, x: 30, y: 35 },
  { name: 'Callao', risk: 70, x: 8, y: 48 },
  { name: 'Cercado de Lima', risk: 88, x: 42, y: 48 },
  { name: 'La Victoria', risk: 85, x: 52, y: 52 },
  { name: 'San Isidro', risk: 65, x: 38, y: 62 },
  { name: 'Miraflores', risk: 72, x: 32, y: 78 },
  { name: 'Surco', risk: 58, x: 48, y: 72 },
  { name: 'Ate', risk: 77, x: 68, y: 55 },
]

export const ZONE_STATS = [
  { name: 'Centro Histórico', value: 85 },
  { name: 'Zona Industrial', value: 60 },
  { name: 'Barrio Norte', value: 72 },
]

export const CRIME_TYPES_FILTER = ['Todos los delitos', 'Robo', 'Asalto', 'Vandalismo', 'Fraude']

export const PREDICTION_VS_HISTORY = [
  { date: 'Jun 21', real: 42, pred: 45 },
  { date: 'Jun 22', real: 38, pred: 40 },
  { date: 'Jun 23', real: 45, pred: 48 },
  { date: 'Jun 24', real: 52, pred: 50 },
  { date: 'Jun 25', real: 48, pred: 55 },
  { date: 'Jun 26', real: 55, pred: 58 },
  { date: 'Jun 27', real: 50, pred: 62 },
]

export const RISK_BY_HOUR = [
  { hour: '00:00', risk: 35 },
  { hour: '03:00', risk: 28 },
  { hour: '06:00', risk: 42 },
  { hour: '09:00', risk: 55 },
  { hour: '12:00', risk: 68 },
  { hour: '15:00', risk: 72 },
  { hour: '18:00', risk: 85 },
  { hour: '21:00', risk: 78 },
]

export const ZONE_COMPARISON = [
  { zone: 'Centro Histórico', risk: 'Alto', value: 88, color: '#ef4444' },
  { zone: 'Zona Industrial', risk: 'Medio', value: 55, color: '#f97316' },
  { zone: 'Barrio Norte', risk: 'Alto', value: 82, color: '#ef4444' },
  { zone: 'Sector Sur', risk: 'Bajo', value: 18, color: '#22c55e' },
  { zone: 'Zona Comercial', risk: 'Alto', value: 80, color: '#ef4444' },
]

export const ANALYSIS_KPIS = [
  { label: 'Total Delitos', value: '1,247', change: '+12% vs mes anterior' },
  { label: 'Promedio Diario', value: '42', change: '+12% vs mes anterior' },
  { label: 'Pico Horario', value: '18:00', change: '42 delitos promedio' },
  { label: 'Zona Más Afectada', value: 'Comercial', change: '72 incidentes' },
]

export const MONTHLY_BY_TYPE = [
  { month: 'Ene', robo: 120, asalto: 80, vandalismo: 40, fraude: 30 },
  { month: 'Feb', robo: 140, asalto: 90, vandalismo: 45, fraude: 35 },
  { month: 'Mar', robo: 130, asalto: 95, vandalismo: 50, fraude: 40 },
  { month: 'Abr', robo: 160, asalto: 100, vandalismo: 55, fraude: 42 },
  { month: 'May', robo: 170, asalto: 110, vandalismo: 60, fraude: 45 },
  { month: 'Jun', robo: 180, asalto: 115, vandalismo: 65, fraude: 48 },
]

export const HOURLY_PATTERN = [
  { hour: '0', v: 12 }, { hour: '3', v: 8 }, { hour: '6', v: 15 },
  { hour: '9', v: 28 }, { hour: '12', v: 35 }, { hour: '15', v: 40 },
  { hour: '18', v: 52 }, { hour: '21', v: 38 },
]

export const WEEKDAY_PATTERN = [
  { day: 'Lun', v: 35 }, { day: 'Mar', v: 38 }, { day: 'Mié', v: 42 },
  { day: 'Jue', v: 45 }, { day: 'Vie', v: 55 }, { day: 'Sáb', v: 62 }, { day: 'Dom', v: 48 },
]

export const CRIME_DISTRIBUTION = [
  { name: 'Robo', value: 42, color: '#ef4444' },
  { name: 'Asalto', value: 32, color: '#f97316' },
  { name: 'Vandalismo', value: 14, color: '#eab308' },
  { name: 'Fraude', value: 12, color: '#3b82f6' },
]

export const ZONE_TABLE = [
  { zone: 'Centro', ene: 45, feb: 52, mar: 48, abr: 55, may: 60 },
  { zone: 'Industrial', ene: 32, feb: 35, mar: 38, abr: 40, may: 42 },
  { zone: 'Norte', ene: 50, feb: 55, mar: 58, abr: 62, may: 65 },
  { zone: 'Sur', ene: 18, feb: 20, mar: 22, abr: 19, may: 21 },
  { zone: 'Comercial', ene: 60, feb: 65, mar: 68, abr: 70, may: 72 },
]

export const GNN_NODES = [
  { id: 'norte', label: 'Norte', risk: 'high', x: 120, y: 80, size: 50 },
  { id: 'centro', label: 'Centro', risk: 'high', x: 220, y: 120, size: 65 },
  { id: 'comercial', label: 'Comercial', risk: 'high', x: 320, y: 80, size: 55 },
  { id: 'residencial', label: 'Residencial', risk: 'medium', x: 380, y: 180, size: 45 },
  { id: 'sur', label: 'Sur', risk: 'low', x: 180, y: 220, size: 40 },
  { id: 'industrial', label: 'Industrial', risk: 'medium', x: 80, y: 180, size: 42 },
]

export const GNN_EDGES = [
  { from: 'centro', to: 'comercial', strength: 'high' },
  { from: 'centro', to: 'norte', strength: 'high' },
  { from: 'comercial', to: 'residencial', strength: 'medium' },
  { from: 'norte', to: 'comercial', strength: 'medium' },
  { from: 'centro', to: 'residencial', strength: 'medium' },
  { from: 'centro', to: 'sur', strength: 'low' },
  { from: 'centro', to: 'industrial', strength: 'medium' },
  { from: 'norte', to: 'industrial', strength: 'low' },
  { from: 'sur', to: 'industrial', strength: 'low' },
  { from: 'comercial', to: 'sur', strength: 'low' },
]

export const GNN_CORRELATIONS = [
  { pair: 'Centro ↔ Comercial', value: 92 },
  { pair: 'Centro ↔ Norte', value: 85 },
  { pair: 'Comercial ↔ Residencial', value: 78 },
  { pair: 'Norte ↔ Comercial', value: 72 },
  { pair: 'Centro ↔ Residencial', value: 68 },
]

export const METRICS_KPIS = [
  { label: 'MAE', value: '8.4', sub: 'Mean Absolute Error' },
  { label: 'RMSE', value: '12.7', sub: 'Root Mean Square Error' },
  { label: 'Precisión', value: '94.2%', sub: 'Precisión General' },
  { label: 'R² Score', value: '0.89', sub: 'Coeficiente de Determinación' },
]

export const METRICS_MONTHLY = [
  { month: 'Feb', pred: 320, real: 315 },
  { month: 'Mar', pred: 350, real: 345 },
  { month: 'Abr', pred: 380, real: 375 },
  { month: 'May', pred: 420, real: 410 },
  { month: 'Jun', pred: 450, real: 445 },
]

export const DISTRICT_COMPARISON = [
  { distrito: 'San Juan de Lurigancho', predicho: 92, real: 88, error: 4.5, estado: 'Bueno' },
  { distrito: 'Cercado de Lima', predicho: 85, real: 82, error: 3.7, estado: 'Bueno' },
  { distrito: 'La Victoria', predicho: 78, real: 85, error: 8.2, estado: 'Revisar' },
  { distrito: 'Callao', predicho: 70, real: 72, error: 2.8, estado: 'Bueno' },
  { distrito: 'Comas', predicho: 80, real: 75, error: 6.7, estado: 'Revisar' },
  { distrito: 'Los Olivos', predicho: 75, real: 73, error: 2.7, estado: 'Bueno' },
  { distrito: 'Miraflores', predicho: 72, real: 70, error: 2.9, estado: 'Bueno' },
  { distrito: 'Surco', predicho: 58, real: 60, error: 3.3, estado: 'Bueno' },
  { distrito: 'San Isidro', predicho: 65, real: 63, error: 3.1, estado: 'Bueno' },
  { distrito: 'Ate', predicho: 77, real: 74, error: 4.1, estado: 'Bueno' },
  { distrito: 'San Martín de Porres', predicho: 70, real: 68, error: 2.9, estado: 'Bueno' },
  { distrito: 'Villa El Salvador', predicho: 55, real: 58, error: 5.2, estado: 'Revisar' },
]

export const PRECISION_OVER_TIME = [
  { date: '10 May', value: 92 },
  { date: '11 May', value: 93 },
  { date: '12 May', value: 91 },
  { date: '13 May', value: 94 },
  { date: '14 May', value: 93 },
  { date: '15 May', value: 95 },
  { date: '16 May', value: 94 },
  { date: '17 May', value: 95 },
]

export const MODEL_VERSIONS = [
  { version: 'v1.2', desc: 'Optimizador GNN + Nuevos nodos', status: 'Activa' },
  { version: 'v1.1', desc: 'Mejora en pesos de aristas', status: 'Deprecated' },
  { version: 'v1.0', desc: 'Versión inicial', status: 'Deprecated' },
]

export const TRAINING_LOGS = [
  { time: '10:30:15.234', type: 'info', msg: 'Iniciando proceso de reentrenamiento del modelo GNN v1.2' },
  { time: '10:30:15.456', type: 'info', msg: 'Configuración cargada desde config.json' },
  { time: '10:30:15.678', type: 'info', msg: 'GPU detectada: NVIDIA Tesla V100 - 16GB VRAM' },
  { time: '10:30:16.012', type: 'info', msg: 'Conectando a base de datos PostgreSQL...' },
  { time: '10:30:16.234', type: 'success', msg: 'Conexión a base de datos establecida exitosamente' },
  { time: '10:30:18.456', type: 'info', msg: "Ejecutando query: SELECT * FROM delitos WHERE fecha >= '2025-01-01'" },
  { time: '10:30:19.123', type: 'success', msg: '45,320 registros cargados correctamente' },
  { time: '10:30:19.234', type: 'info', msg: 'Iniciando validación de calidad de datos...' },
  { time: '10:30:20.456', type: 'info', msg: 'Verificando campos obligatorios: fecha, hora, tipo, distrito, lat, lng' },
  { time: '10:30:21.789', type: 'warning', msg: '512 registros con coordenadas fuera de rango - marcados para revisión' },
  { time: '10:30:22.012', type: 'info', msg: 'Eliminando duplicados por timestamp y ubicación...' },
  { time: '10:30:23.234', type: 'success', msg: '189 duplicados eliminados' },
  { time: '10:30:25.456', type: 'success', msg: 'Validación completada - 98.7% de registros válidos (44,619 de 45,320)' },
  { time: '10:30:30.789', type: 'info', msg: 'Iniciando construcción del grafo espacio-temporal...' },
  { time: '10:30:31.012', type: 'info', msg: 'Creando nodos por distrito: 43 distritos de Lima Metropolitana' },
]

export const USERS = [
  { name: 'Carlos Mendoza', email: 'carlos@gnn.com', role: 'administrador', status: 'Activo', date: '2024-01-15' },
  { name: 'Ana García', email: 'ana@gnn.com', role: 'Analista', status: 'Activo', date: '2024-02-10' },
  { name: 'Luis Torres', email: 'luis@gnn.com', role: 'Operario', status: 'Activo', date: '2024-03-05' },
  { name: 'María Flores', email: 'maria@gnn.com', role: 'Investigador', status: 'Activo', date: '2024-03-20' },
  { name: 'Jorge Ramos', email: 'jorge@gnn.com', role: 'Analista', status: 'Inactivo', date: '2024-01-28' },
]

export const UPLOAD_HISTORY = [
  { fecha: '2024-05-15 10:30', archivo: 'delitos_mayo_2024.csv', registros: '15,420', estado: 'Exitoso' },
  { fecha: '2024-04-20 14:15', archivo: 'delitos_abril_2024.json', registros: '14,230', estado: 'Exitoso' },
  { fecha: '2024-04-01 09:00', archivo: 'delitos_marzo_2024.csv', registros: '16,180', estado: 'Exitoso' },
  { fecha: '2024-03-15 16:45', archivo: 'delitos_feb_2024.csv', registros: '13,950', estado: 'Advertencia' },
]

export const PIPELINE_STEPS = [
  { name: 'Extracción', time: '2min 15s', done: true },
  { name: 'Limpieza', time: '5min 30s', done: true },
  { name: 'Construcción Grafo', time: '12min 45s', done: true },
  { name: 'Entrenamiento', time: 'Pendiente', done: false },
]

export const RETRAIN_LOGS = [
  '[10:30:15] Iniciando reentrenamiento GNN v1.2...',
  '[10:30:18] Cargando 45,320 registros desde PostgreSQL',
  '[10:30:25] Validación completada: 98.7% registros válidos',
  '[10:30:31] Construyendo grafo: 1,247 nodos, 3,821 aristas',
  '[10:30:45] Iniciando entrenamiento GNN - 150 epochs',
]
