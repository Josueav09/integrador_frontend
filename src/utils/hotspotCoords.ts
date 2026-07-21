/** Cuadrícula aproximada de Lima para visualizar nodos GNN sin lat/lng del backend. */
const LIMA_CENTER = { lat: -12.0464, lng: -77.0428 }
const GRID_COLS = 20
const GRID_ROWS = 20
const LAT_STEP = 0.004
const LNG_STEP = 0.004

export function coordsFromNodeId(idNodo: number): { lat: number; lng: number } {
  const row = Math.floor(idNodo / GRID_COLS)
  const col = idNodo % GRID_COLS
  const offsetLat = (row - GRID_ROWS / 2) * LAT_STEP
  const offsetLng = (col - GRID_COLS / 2) * LNG_STEP
  return {
    lat: LIMA_CENTER.lat + offsetLat,
    lng: LIMA_CENTER.lng + offsetLng,
  }
}

export function normalizeHotspot<T extends { id_nodo: number; lat?: number; lng?: number; distrito?: string }>(
  hotspot: T,
  distritoFallback: string,
): T & { lat: number; lng: number; distrito: string } {
  const coords =
    typeof hotspot.lat === 'number' && typeof hotspot.lng === 'number'
      ? { lat: hotspot.lat, lng: hotspot.lng }
      : coordsFromNodeId(hotspot.id_nodo)

  return {
    ...hotspot,
    ...coords,
    distrito: hotspot.distrito ?? distritoFallback,
  }
}
