import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { apiClient } from '../../api/client'

// Fix default icon issue with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Componente para capturar clics en el mapa
function MapClickHandler({ setPosition }: { setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

export function ReportCrimePage() {
  const navigate = useNavigate()
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [tipoDelito, setTipoDelito] = useState('1') // 1: Robo, 2: Hurto
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [hora, setHora] = useState('12:00')
  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!position) {
      setMensaje({ tipo: 'error', texto: 'Por favor, marque la ubicación exacta en el mapa.' })
      return
    }

    setLoading(true)
    setMensaje(null)
    
    try {
      const payload = {
        id_tipo_delito: parseInt(tipoDelito),
        fecha_delito: fecha,
        hora_delito: hora + ':00', // API espera formato de tiempo completo
        latitud: position[0],
        longitud: position[1],
        descripcion: descripcion
      }

      await apiClient.post('/denuncias/publica', payload)
      
      setMensaje({ tipo: 'success', texto: 'Su denuncia ha sido registrada de manera anónima y está pendiente de revisión por la PNP.' })
      setDescripcion('')
      setPosition(null)
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Error al registrar denuncia. Verifique su conexión o intente más tarde.'
      setMensaje({ tipo: 'error', texto: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ margin: 0, color: '#3b82f6' }}>Plataforma de Denuncia Ciudadana Anónima</h1>
            <p style={{ color: '#aaa', marginTop: '0.5rem' }}>Su reporte ayuda a la Policía Nacional del Perú a identificar nuevos puntos críticos y optimizar el patrullaje inteligente (GNN).</p>
          </div>
          <button 
            type="button" 
            onClick={() => navigate('/login')}
            style={{ padding: '0.5rem 1rem', background: '#374151', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🔒 Acceso PNP
          </button>
        </div>

        {mensaje && (
          <div style={{ 
            padding: '1rem', 
            marginBottom: '1rem', 
            borderRadius: '8px', 
            background: mensaje.tipo === 'success' ? '#064e3b' : '#7f1d1d',
            border: `1px solid ${mensaje.tipo === 'success' ? '#10b981' : '#ef4444'}`
          }}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Columna Izquierda: Formulario */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Tipo de Incidente</label>
              <select 
                value={tipoDelito} 
                onChange={(e) => setTipoDelito(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', background: '#222', border: '1px solid #444', color: '#fff' }}
              >
                <option value="1">Robo agravado (Con violencia/arma)</option>
                <option value="2">Hurto simple (Sin violencia)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Fecha</label>
                <input 
                  type="date" 
                  value={fecha} 
                  onChange={(e) => setFecha(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', background: '#222', border: '1px solid #444', color: '#fff' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Hora (Aprox)</label>
                <input 
                  type="time" 
                  value={hora} 
                  onChange={(e) => setHora(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', background: '#222', border: '1px solid #444', color: '#fff' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Descripción de los hechos</label>
              <textarea 
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                required
                placeholder="Describa brevemente cómo ocurrieron los hechos... (Evite proporcionar datos personales)"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', background: '#222', border: '1px solid #444', color: '#fff', resize: 'vertical' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !position}
              style={{
                marginTop: 'auto',
                padding: '1rem',
                background: (!position || loading) ? '#333' : '#2563eb',
                color: (!position || loading) ? '#888' : '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: (!position || loading) ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s'
              }}
            >
              {loading ? 'Enviando reporte...' : 'Enviar Reporte a la PNP'}
            </button>
          </div>

          {/* Columna Derecha: Mapa Leaflet */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Ubicación Exacta (Haga clic en el mapa)</label>
            <div style={{ height: '400px', borderRadius: '8px', overflow: 'hidden', border: position ? '2px solid #22c55e' : '2px solid #ef4444' }}>
              <MapContainer 
                center={[-12.0464, -77.0428]} 
                zoom={12} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <MapClickHandler setPosition={setPosition} />
                {position && <Marker position={position} />}
              </MapContainer>
            </div>
            {!position && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>* La ubicación es obligatoria.</p>}
          </div>

        </form>
      </div>
    </div>
  )
}
