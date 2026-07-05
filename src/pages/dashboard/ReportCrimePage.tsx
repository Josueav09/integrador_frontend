import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { apiClient } from '../../api/client'
import { getApiErrorMessage } from '../../utils/apiError'
import { AccessibilityTrigger } from '../../components/accessibility/AccessibilityTrigger'
import { StatusBanner } from '../../components/ui/StatusBanner'
import { useNotification } from '../../contexts/NotificationContext'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function MapClickHandler({ setPosition }: { setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

const SUCCESS_MESSAGE =
  'Su denuncia ha sido registrada de manera anónima y está pendiente de revisión por la PNP.'

export function ReportCrimePage() {
  const navigate = useNavigate()
  const { notifySuccess } = useNotification()
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [tipoDelito, setTipoDelito] = useState('1')
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
        hora_delito: hora.length === 5 ? `${hora}:00` : hora,
        latitud: position[0],
        longitud: position[1],
        descripcion: descripcion,
      }

      await apiClient.post('/denuncias/publica', payload)

      setMensaje({ tipo: 'success', texto: SUCCESS_MESSAGE })
      notifySuccess('Denuncia registrada correctamente')
      setDescripcion('')
      setPosition(null)
    } catch (err: unknown) {
      setMensaje({ tipo: 'error', texto: getApiErrorMessage(err, 'Error al registrar denuncia.') })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="report-crime-page">
      <div className="report-crime-page__inner">
        <div className="report-crime-page__header">
          <div>
            <h1 className="report-crime-page__title">Plataforma de Denuncia Ciudadana Anónima</h1>
            <p className="report-crime-page__intro">
              Su reporte ayuda a la Policía Nacional del Perú a identificar nuevos puntos críticos y optimizar el
              patrullaje inteligente (GNN).
            </p>
          </div>
          <div className="report-crime-page__actions">
            <AccessibilityTrigger variant="dark" />
            <button type="button" className="report-crime-page__login-btn" onClick={() => navigate('/login')}>
              Acceso PNP
            </button>
          </div>
        </div>

        {mensaje && (
          <div data-testid={mensaje.tipo === 'success' ? 'report-crime-success-message' : undefined}>
            <StatusBanner type={mensaje.tipo} message={mensaje.texto} onDismiss={() => setMensaje(null)} />
          </div>
        )}

        <form className="report-crime-page__form" onSubmit={handleSubmit}>
          <div className="report-crime-page__fields">
            <div>
              <label className="report-crime-page__label" htmlFor="report-tipo">
                Tipo de Incidente
              </label>
              <select
                id="report-tipo"
                className="report-crime-page__select"
                value={tipoDelito}
                onChange={(e) => setTipoDelito(e.target.value)}
                data-testid="report-crime-type-select"
              >
                <option value="1">Robo agravado (Con violencia/arma)</option>
                <option value="2">Hurto simple (Sin violencia)</option>
              </select>
            </div>

            <div className="report-crime-page__row">
              <div>
                <label className="report-crime-page__label" htmlFor="report-fecha">
                  Fecha
                </label>
                <input
                  id="report-fecha"
                  type="date"
                  className="report-crime-page__input"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  data-testid="report-crime-date-input"
                />
              </div>
              <div>
                <label className="report-crime-page__label" htmlFor="report-hora">
                  Hora (aprox.)
                </label>
                <input
                  id="report-hora"
                  type="time"
                  className="report-crime-page__input"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                  data-testid="report-crime-time-input"
                />
              </div>
            </div>

            <div>
              <label className="report-crime-page__label" htmlFor="report-desc">
                Descripción de los hechos
              </label>
              <textarea
                id="report-desc"
                className="report-crime-page__textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                required
                placeholder="Describa brevemente cómo ocurrieron los hechos... (Evite proporcionar datos personales)"
                data-testid="report-crime-desc-textarea"
              />
            </div>

            <button
              type="submit"
              className="report-crime-page__submit"
              disabled={loading || !position}
              data-testid="report-crime-submit-btn"
            >
              {loading ? 'Enviando reporte...' : 'Enviar Reporte a la PNP'}
            </button>
          </div>

          <div>
            <label className="report-crime-page__label">Ubicación exacta</label>
            <div
              className={`report-crime-page__map-wrap${position ? ' report-crime-page__map-wrap--ready' : ''}`}
              data-testid="report-crime-map-container"
            >
              <MapContainer center={[-12.0464, -77.0428]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <MapClickHandler setPosition={setPosition} />
                {position && <Marker position={position} />}
              </MapContainer>
            </div>
            <p className="report-crime-page__map-hint">
              Haga clic en el mapa para marcar el lugar del incidente. El borde verde confirma que la ubicación está
              seleccionada.
            </p>
            {!position && <p className="report-crime-page__map-error">* La ubicación es obligatoria.</p>}
          </div>
        </form>
      </div>
    </div>
  )
}
