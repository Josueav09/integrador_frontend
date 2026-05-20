import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { CRIME_TYPES_FILTER, ZONE_STATS } from '../../data/mockData'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { apiClient } from '../../api/client'

// Coordenadas reales aproximadas de Lima
const REAL_DISTRICTS = [
  { name: 'Comas', lat: -11.930, lng: -77.046, risk: 80 },
  { name: 'Los Olivos', lat: -11.976, lng: -77.074, risk: 75 },
  { name: 'San Juan de Lurigancho', lat: -11.980, lng: -76.994, risk: 92 },
  { name: 'San Martín de Porres', lat: -12.010, lng: -77.070, risk: 70 },
  { name: 'Callao', lat: -12.056, lng: -77.118, risk: 70 },
  { name: 'Cercado de Lima', lat: -12.043, lng: -77.028, risk: 88 },
  { name: 'La Victoria', lat: -12.065, lng: -77.030, risk: 85 },
  { name: 'San Isidro', lat: -12.097, lng: -77.026, risk: 65 },
  { name: 'Miraflores', lat: -12.111, lng: -77.031, risk: 72 },
  { name: 'Surco', lat: -12.140, lng: -76.999, risk: 58 },
  { name: 'Ate', lat: -12.025, lng: -76.918, risk: 77 },
]

function getMarkerColor(risk: number) {
  if (risk >= 80) return '#ef4444' // Rojo
  if (risk >= 50) return '#f97316' // Naranja
  return '#22c55e' // Verde
}

export function CrimeMapPage() {
  const [mode, setMode] = useState<'historico' | 'prediccion'>('historico')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('Todos los delitos')
  
  // Estado para la predicción real
  const [hotspots, setHotspots] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // FASE 3: Consumo del Motor GNN
  const fetchPredictions = async () => {
    setLoading(true)
    try {
      // Llamada real al backend enviando la fecha y distrito (simulado a nivel global por ahora)
      const res = await apiClient.post('/predict/predecir', {
        fecha_consulta: '2026-05-20',
        distrito: 'Lima'
      })
      if (res.data && res.data.hotspots) {
        setHotspots(res.data.hotspots)
      }
    } catch (err) {
      console.error("Error al obtener predicciones GNN:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mode === 'prediccion') {
      fetchPredictions()
    }
  }, [mode])

  return (
    <>
      <PageHeader
        title="Mapa de Delitos (Inteligencia Espacial)"
        subtitle="Visualización geográfica con CartoDB Dark Matter y GNN"
      />
      <div className="dash-content">
        <div className="dash-toolbar">
          <div className="dash-toggle">
            <button
              type="button"
              className={mode === 'historico' ? 'active' : ''}
              onClick={() => setMode('historico')}
            >
              Histórico
            </button>
            <button
              type="button"
              className={mode === 'prediccion' ? 'active' : ''}
              onClick={() => setMode('prediccion')}
            >
              Predicción IA
            </button>
          </div>
          <select className="dash-select" defaultValue="all">
            <option>Todos los delitos</option>
          </select>
          <input className="dash-select dash-select--date" readOnly value="17/04/2024 - 24/04/2024" />
          <button type="button" className="dash-btn dash-btn--primary" onClick={() => setFiltersOpen(true)}>
            Filtros Avanzados
          </button>
        </div>

        <div className="dash-map-wrap">
          {/* FASE 2: Leaflet + CartoDB Dark Matter */}
          <div className="dash-map" style={{ padding: 0, overflow: 'hidden', borderRadius: '1rem', position: 'relative' }}>
            {loading && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
                Ejecutando Inferencia GNN...
              </div>
            )}
            
            <MapContainer 
              center={[-12.0464, -77.0428]} 
              zoom={11} 
              style={{ height: '100%', width: '100%', background: '#111' }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              
              {mode === 'historico' ? (
                REAL_DISTRICTS.map((d) => (
                  <CircleMarker
                    key={d.name}
                    center={[d.lat, d.lng]}
                    radius={Math.max(10, d.risk / 4)}
                    pathOptions={{ 
                      color: getMarkerColor(d.risk), 
                      fillColor: getMarkerColor(d.risk), 
                      fillOpacity: 0.6,
                      weight: 2
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                      <strong>{d.name}</strong><br/>Riesgo: {d.risk}%
                    </Tooltip>
                  </CircleMarker>
                ))
              ) : (
                hotspots.slice(0, 30).map((h, i) => {
                  // Mapeo rudimentario de nodos a lat/lng para la demo visual si el backend no manda coords
                  const baseLat = -12.0464 + (Math.random() - 0.5) * 0.1
                  const baseLng = -77.0428 + (Math.random() - 0.5) * 0.1
                  const color = h.alerta_patrullaje === 'Roja' ? '#ef4444' : (h.alerta_patrullaje === 'Amarilla' ? '#f97316' : '#22c55e')
                  
                  return (
                    <CircleMarker
                      key={`hotspot-${i}`}
                      center={[baseLat, baseLng]}
                      radius={15}
                      pathOptions={{ 
                        color: color, 
                        fillColor: color, 
                        fillOpacity: 0.8,
                        weight: 2
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                        <strong>Nodo: {h.id_nodo}</strong><br/>
                        Alerta: {h.alerta_patrullaje}<br/>
                        Score: {h.score_densidad_delictiva.toFixed(4)}
                      </Tooltip>
                    </CircleMarker>
                  )
                })
              )}
            </MapContainer>
          </div>
          
          <div>
            <div className="dash-card dash-card--compact">
              <h3>Leyenda de Intensidad</h3>
              <div className="dash-legend-item">
                <span className="dash-legend-dot" style={{ background: '#ef4444' }} />
                Alto Riesgo (80-100%)
              </div>
              <div className="dash-legend-item">
                <span className="dash-legend-dot" style={{ background: '#f97316' }} />
                Riesgo Medio (50-79%)
              </div>
              <div className="dash-legend-item">
                <span className="dash-legend-dot" style={{ background: '#22c55e' }} />
                Bajo Riesgo (0-49%)
              </div>
            </div>
            <div className="dash-card">
              <h3>Estadísticas de Zona</h3>
              {ZONE_STATS.map((z) => (
                <div key={z.name} className="dash-progress-row">
                  <div className="dash-progress-row__head">
                    <span>{z.name}</span>
                    <span>{z.value}%</span>
                  </div>
                  <div className="dash-progress-bar">
                    <div
                      className="dash-progress-bar__fill"
                      style={{
                        width: `${z.value}%`,
                        background: z.value >= 80 ? '#ef4444' : '#f97316',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`dash-filters-backdrop ${filtersOpen ? 'open' : ''}`}
        aria-label="Cerrar filtros"
        onClick={() => setFiltersOpen(false)}
      />

      <div className={`dash-filters-panel ${filtersOpen ? 'open' : ''}`}>
        <div className="dash-filters-panel__head">
          <h3>Filtros Dinámicos</h3>
          <button type="button" className="dash-modal__close" onClick={() => setFiltersOpen(false)}>
            ×
          </button>
        </div>
        <p className="dash-filter-label">Tipo de Delito</p>
        <div className="dash-filter-chips">
          {CRIME_TYPES_FILTER.map((t) => (
            <button
              key={t}
              type="button"
              className={`dash-filter-chip ${selectedType === t ? 'selected' : ''}`}
              onClick={() => setSelectedType(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="dash-filter-label">Rango de Fechas</p>
        <div className="dash-filter-row">
          <input className="dash-select" placeholder="Desde" />
          <input className="dash-select" placeholder="Hasta" />
        </div>
        <p className="dash-filter-label">Horario</p>
        <input type="range" min={0} max={24} defaultValue={12} className="dash-range" />
        <p className="dash-filter-hint">0:00 — 24:00</p>
        <p className="dash-filter-label">Zona / Distrito</p>
        <input className="dash-select dash-select--full" placeholder="Buscar distrito..." />
        <div className="dash-card dash-preview-box">
          <strong>Vista Previa</strong>
          <p>496 registros coinciden con los filtros seleccionados</p>
        </div>
        <button
          type="button"
          className="dash-btn dash-btn--purple dash-btn--block"
          onClick={() => setFiltersOpen(false)}
        >
          Aplicar Filtros
        </button>
      </div>
    </>
  )
}
