import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { useNotification } from '../../contexts/NotificationContext'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { apiClient } from '../../api/client'
import { normalizeHotspot } from '../../utils/hotspotCoords'

const TIPOS_DELITO = [
  { id: 'TODOS', label: 'Todos los delitos' },
  { id: 'ROB-001', label: 'Robo Agravado' },
  { id: 'HUR-001', label: 'Hurto Simple' }
]

// Eliminado REAL_DISTRICTS mock, ahora consumimos data viva

export function CrimeMapPage() {
  const { notifyApiError } = useNotification()
  const [mode, setMode] = useState<'historico' | 'prediccion'>('historico')

  // States para Filtros Reales
  const [selectedType, setSelectedType] = useState('TODOS')
  const [distritoInput, setDistritoInput] = useState('TODOS')
  const [distritosDb, setDistritosDb] = useState<string[]>([])

  // Estado para la predicción real
  const [hotspots, setHotspots] = useState<any[]>([])

  // Estado para el histórico real
  const [historico, setHistorico] = useState<any[]>([])
  const [zoneStats, setZoneStats] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const consultaFecha = new Date().toISOString().split('T')[0]

  const fetchZoneStats = async (dist: string) => {
    try {
      const res = await apiClient.get(`/dashboard/stats-distrito/${dist}`)
      if (res.data && res.data.success) {
        setZoneStats(res.data.data)
      }
    } catch (err) {
      notifyApiError(err, 'No se pudieron cargar las estadísticas del distrito.')
    }
  }

  const fetchHistorico = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/dashboard/mapa-geojson')
      setHistorico(res.data.data ?? [])
    } catch (err) {
      notifyApiError(err, 'No se pudo cargar el mapa histórico.')
      setHistorico([])
    } finally {
      setLoading(false)
    }
  }

  const fetchDistritos = async () => {
    try {
      const res = await apiClient.get('/predict/distritos')
      if (res.data && res.data.success) {
        setDistritosDb(res.data.data)
      }
    } catch (err) {
      notifyApiError(err, 'No se pudo cargar la lista de distritos.')
    }
  }

  const fetchPredictions = async () => {
    setLoading(true)
    try {
      const distrito = distritoInput === 'TODOS' ? 'Lima' : distritoInput
      const res = await apiClient.post('/predict/predecir', {
        fecha_consulta: consultaFecha,
        distrito,
        tipo_delito: selectedType,
      })
      if (res.data?.hotspots) {
        const normalized = res.data.hotspots.map((h: any) => normalizeHotspot(h, distrito))
        setHotspots(normalized)
      }
    } catch (err) {
      notifyApiError(err, 'No se pudieron cargar las predicciones. Verifique su sesión o el backend.')
      setHotspots([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDistritos()
    fetchZoneStats(distritoInput)
  }, [])

  useEffect(() => {
    fetchZoneStats(distritoInput)
  }, [distritoInput])

  useEffect(() => {
    if (mode === 'prediccion') {
      fetchPredictions()
    } else {
      fetchHistorico()
    }
  }, [mode])

  return (
    <>
      <PageHeader
        title="Mapa de Delitos (Inteligencia Espacial)"
        subtitle="Visualización geográfica con CartoDB Dark Matter y GNN"
      />
      <div className="dash-content">
        <div className="dash-toolbar" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="dash-toggle">
            <button
              type="button"
              className={mode === 'historico' ? 'active' : ''}
              onClick={() => setMode('historico')}
              data-testid="map-mode-historical-btn"
            >
              Histórico
            </button>
            <button
              type="button"
              className={mode === 'prediccion' ? 'active' : ''}
              onClick={() => setMode('prediccion')}
              data-testid="map-mode-prediction-btn"
            >
              Predicción IA
            </button>
          </div>

          <select
            className="dash-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            data-testid="map-type-select"
          >
            {TIPOS_DELITO.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          <select
            className="dash-select"
            value={distritoInput}
            onChange={(e) => setDistritoInput(e.target.value)}
            style={{ minWidth: '200px' }}
            data-testid="map-district-select"
          >
            <option value="TODOS">TODOS (Lima Metropolitana)</option>
            {distritosDb.length === 0 && <option value="LIMA CENTRO">LIMA CENTRO</option>}
            {distritosDb.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <button
            type="button"
            className="dash-btn dash-btn--primary"
            data-testid="map-apply-filters-btn"
            disabled={loading}
            onClick={() => {
              if (mode === 'prediccion') {
                fetchPredictions()
              } else {
                fetchHistorico()
              }
            }}
          >
            {loading ? 'Cargando...' : 'Aplicar Filtros'}
          </button>
        </div>

        <div className="dash-map-wrap">
          {/* FASE 2: Leaflet + CartoDB Dark Matter */}
          <div className="dash-map" style={{ padding: 0, overflow: 'hidden', borderRadius: '1rem', position: 'relative' }}>
            {loading && (
              <div 
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}
                data-testid="map-loading-overlay"
              >
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
                historico.map((d) => (
                  <CircleMarker
                    key={d.id}
                    center={[d.lat, d.lng]}
                    radius={5}
                    pathOptions={{
                      color: '#ef4444',
                      fillColor: '#ef4444',
                      fillOpacity: 0.6,
                      weight: 1
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                      <strong>Incidente #{d.id}</strong><br />Tipo: {d.tipo}
                    </Tooltip>
                  </CircleMarker>
                ))
              ) : (
                hotspots.map((h, i) => {
                  const baseLat = h.lat
                  const baseLng = h.lng
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
                        <strong>Cuadrante {h.id_nodo + 1}</strong><br />
                        Distrito: {h.distrito}<br />
                        Alerta: {h.alerta_patrullaje}<br />
                        Score: {h.score_densidad_delictiva.toFixed(4)}
                      </Tooltip>
                    </CircleMarker>
                  )
                })
              )}
            </MapContainer>
            {!loading &&
              ((mode === 'historico' && historico.length === 0) ||
                (mode === 'prediccion' && hotspots.length === 0)) && (
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', zIndex: 1000 }}>
                  <EmptyState
                    message={
                      mode === 'historico'
                        ? 'No hay incidentes históricos para los filtros seleccionados.'
                        : 'No hay predicciones GNN disponibles para los filtros seleccionados.'
                    }
                  />
                </div>
              )}
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
              {zoneStats.map((z) => (
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
                        background: z.value >= 80 ? '#ef4444' : (z.value >= 50 ? '#f97316' : '#22c55e'),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


    </>
  )
}
