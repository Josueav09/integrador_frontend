import { useState } from 'react'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { CRIME_TYPES_FILTER, MAP_DISTRICTS, ZONE_STATS } from '../../data/mockData'

function riskClass(risk: number) {
  if (risk >= 80) return 'high'
  if (risk >= 50) return 'mid'
  return 'low'
}

export function CrimeMapPage() {
  const [mode, setMode] = useState<'historico' | 'prediccion'>('historico')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('Todos los delitos')

  return (
    <>
      <PageHeader
        title="Mapa de Delitos"
        subtitle="Visualización espacial de actividad delictiva"
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
              Predicción
            </button>
          </div>
          <select className="dash-select" defaultValue="all">
            <option>Todos los delitos</option>
          </select>
          <select className="dash-select" defaultValue="zones">
            <option>Todas las zonas</option>
          </select>
          <input className="dash-select dash-select--date" readOnly value="17/04/2024 - 24/04/2024" />
          <button type="button" className="dash-btn dash-btn--primary" onClick={() => setFiltersOpen(true)}>
            Filtros Avanzados
          </button>
        </div>

        <div className="dash-map-wrap">
          <div className="dash-map">
            <div className="dash-map__hex" aria-hidden />
            <div className="dash-map__glow dash-map__glow--1" aria-hidden />
            <div className="dash-map__glow dash-map__glow--2" aria-hidden />
            <div className="dash-map__glow dash-map__glow--3" aria-hidden />
            <div className="dash-map__overlay">
              <strong>Lima Metropolitana</strong>
              <br />
              12 distritos monitoreados · Modo {mode === 'historico' ? 'Histórico' : 'Predicción'}
            </div>
            {MAP_DISTRICTS.map((d) => (
              <div
                key={d.name}
                className={`dash-map__district dash-map__district--${riskClass(d.risk)}`}
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
                title={`${d.name}: ${d.risk}% riesgo`}
              >
                {d.name} {d.risk}%
              </div>
            ))}
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
        <button
          type="button"
          className="dash-btn dash-btn--ghost dash-btn--block"
          onClick={() => {
            setSelectedType('Todos los delitos')
          }}
        >
          Limpiar Filtros
        </button>
      </div>
    </>
  )
}
