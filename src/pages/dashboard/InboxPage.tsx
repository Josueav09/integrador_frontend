import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatusBanner } from '../../components/ui/StatusBanner'
import { EmptyState } from '../../components/ui/EmptyState'
import { apiClient } from '../../api/client'
import { getApiErrorMessage } from '../../utils/apiError'

type Denuncia = {
  id_denuncia_ciudadana: number
  id_tipo_delito: number
  fecha_delito: string
  hora_delito: string
  descripcion: string
  estado: string
}

type Feedback = {
  type: 'error' | 'success'
  message: string
}

export function InboxPage() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [processingId, setProcessingId] = useState<number | null>(null)

  const fetchDenuncias = async () => {
    setFeedback(null)
    try {
      const res = await apiClient.get('/denuncias/pendientes')
      if (res.data?.success) {
        setDenuncias(res.data.data)
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'No se pudieron cargar las denuncias pendientes.'),
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDenuncias()
  }, [])

  const handleAction = async (id: number, action: 'aprobar' | 'rechazar') => {
    if (
      action === 'rechazar' &&
      !window.confirm(`¿Descartar la denuncia #${id}? Esta acción no se puede deshacer.`)
    ) {
      return
    }

    setProcessingId(id)
    setFeedback(null)
    try {
      await apiClient.post(`/denuncias/${action}/${id}`)
      setDenuncias((prev) => prev.filter((d) => d.id_denuncia_ciudadana !== id))
      setFeedback({
        type: 'success',
        message:
          action === 'aprobar'
            ? `Denuncia #${id} aprobada y transferida al histórico oficial.`
            : `Denuncia #${id} descartada correctamente.`,
      })
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, `No se pudo ${action} la denuncia.`),
      })
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Bandeja de Entrada - Reportes Ciudadanos"
        subtitle="Módulo de Cuarentena: Valide o descarte incidentes para alimentar el histórico oficial"
      >
        {!loading && denuncias.length > 0 && (
          <span className="dash-inbox-badge" data-testid="inbox-pending-count">
            {denuncias.length} pendiente{denuncias.length === 1 ? '' : 's'}
          </span>
        )}
      </PageHeader>
      <div className="dash-content">
        {feedback && (
          <StatusBanner
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        )}
        <div className="dash-card">
          <div className="dash-table-wrap">
            <table className="dash-table" data-testid="inbox-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Fecha/Hora</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Cargando denuncias...</td></tr>
                ) : denuncias.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState
                        title="Bandeja vacía"
                        message="No hay reportes ciudadanos pendientes en cuarentena."
                        actionLabel="Ver mapa delictivo"
                        actionHref="/dashboard/mapa"
                      />
                    </td>
                  </tr>
                ) : (
                  denuncias.map((d, index) => (
                    <tr key={d.id_denuncia_ciudadana}>
                      <td>#{d.id_denuncia_ciudadana}</td>
                      <td>
                        <span className={`dash-badge ${d.id_tipo_delito === 1 ? 'dash-badge--error' : 'dash-badge--warning'}`}>
                          {d.id_tipo_delito === 1 ? 'Robo Agravado' : 'Hurto Simple'}
                        </span>
                      </td>
                      <td>{d.fecha_delito} {d.hora_delito}</td>
                      <td style={{ maxWidth: '300px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        {d.descripcion}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="dash-btn dash-btn--primary"
                            onClick={() => handleAction(d.id_denuncia_ciudadana, 'aprobar')}
                            disabled={processingId === d.id_denuncia_ciudadana}
                            title="Validar y transferir a la DB oficial"
                            data-testid={
                              index === 0
                                ? 'inbox-approve-btn'
                                : `inbox-approve-btn-${d.id_denuncia_ciudadana}`
                            }
                          >
                            {processingId === d.id_denuncia_ciudadana ? 'Procesando...' : 'Aprobar'}
                          </button>
                          <button
                            className="dash-btn dash-btn--danger"
                            onClick={() => handleAction(d.id_denuncia_ciudadana, 'rechazar')}
                            disabled={processingId === d.id_denuncia_ciudadana}
                            style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444' }}
                            title="Descartar reporte falso"
                            data-testid={
                              index === 0
                                ? 'inbox-reject-btn'
                                : `inbox-reject-btn-${d.id_denuncia_ciudadana}`
                            }
                          >
                            {processingId === d.id_denuncia_ciudadana ? 'Procesando...' : 'Descartar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
