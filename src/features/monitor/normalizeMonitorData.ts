export interface MonitorLogEntry {
  type: string
  time: string
  msg: string
}

export interface MonitorData {
  version: string
  precision: string
  registros: number
  nodos: number
  aristas: number
  logs: MonitorLogEntry[]
}

const DEFAULT_MONITOR_DATA: MonitorData = {
  version: 'v1.2',
  precision: '94.2%',
  registros: 45320,
  nodos: 1247,
  aristas: 3821,
  logs: [],
}

function toNumber(value: unknown, fallback: number) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return fallback
}

function toPrecision(value: unknown, fallback: string) {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) {
      return fallback
    }
    return trimmed.includes('%') ? trimmed : `${trimmed}%`
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}%`
  }

  return fallback
}

function toLogs(value: unknown): MonitorLogEntry[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null
      }

      const log = entry as Record<string, unknown>
      const type = typeof log.type === 'string' ? log.type : 'info'
      const time = typeof log.time === 'string' ? log.time : 'N/A'
      const msg = typeof log.msg === 'string' ? log.msg : ''
      if (!msg) {
        return null
      }

      return { type, time, msg }
    })
    .filter((entry): entry is MonitorLogEntry => entry !== null)
}

export function normalizeMonitorData(payload: unknown): MonitorData {
  if (!payload || typeof payload !== 'object') {
    return DEFAULT_MONITOR_DATA
  }

  const input = payload as Record<string, unknown>

  return {
    version: typeof input.version === 'string' && input.version.trim() ? input.version : DEFAULT_MONITOR_DATA.version,
    precision: toPrecision(input.precision, DEFAULT_MONITOR_DATA.precision),
    registros: toNumber(input.registros, DEFAULT_MONITOR_DATA.registros),
    nodos: toNumber(input.nodos, DEFAULT_MONITOR_DATA.nodos),
    aristas: toNumber(input.aristas, DEFAULT_MONITOR_DATA.aristas),
    logs: toLogs(input.logs),
  }
}

