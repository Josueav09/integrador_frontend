import { useMemo } from 'react'
import { usePreferences } from '../contexts/PreferencesContext'

/** Paleta ONPE-style para modo daltonismo (negro + durazno, sin rojo/verde). */
export const COLORBLIND_CHART_COLORS = ['#e8c4a2', '#c4956a', '#a67c52', '#8b6f4e'] as const

const DEFAULT_CHART_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981']
const GRAYSCALE_CHART_COLORS = ['#1a1a1a', '#4a4a4a', '#7a7a7a', '#ababab']

export function useChartTheme() {
  const { accessibility } = usePreferences()
  const colorblind = accessibility.profile === 'colorBlind'
  const grayscale = accessibility.contrast === 'grayscale'
  const dark = accessibility.theme === 'dark'

  return useMemo(() => {
    const chartColors = grayscale
      ? [...GRAYSCALE_CHART_COLORS]
      : colorblind
        ? [...COLORBLIND_CHART_COLORS]
        : [...DEFAULT_CHART_COLORS]

    const axisFill = grayscale ? '#525252' : dark ? '#9ca3af' : colorblind ? '#c9a882' : '#6b7280'
    const gridStroke = grayscale ? '#d4d4d4' : dark ? '#374151' : colorblind ? '#3d2e22' : '#f3f4f6'
    const lineStroke = grayscale ? '#262626' : dark ? '#d1d5db' : colorblind ? '#e8c4a2' : '#8b5cf6'
    const dotFill = lineStroke

    return {
      colorblind,
      grayscale,
      dark,
      chartColors,
      chartAxisTick: { fontSize: 12, fill: axisFill },
      chartGridStroke: gridStroke,
      lineStroke,
      dotFill,
      chartTooltipStyle: {
        contentStyle: {
          borderRadius: 10,
          border: grayscale
            ? '1px solid #737373'
            : colorblind
              ? '1px solid #e8c4a2'
              : '1px solid #e5e7eb',
          boxShadow: grayscale || colorblind ? 'none' : '0 4px 12px rgba(0,0,0,0.08)',
          fontSize: 12,
          background: grayscale ? '#fff' : dark ? '#1f2937' : colorblind ? '#000' : '#fff',
          color: grayscale ? '#171717' : dark ? '#f3f4f6' : colorblind ? '#e8c4a2' : '#111827',
        },
        labelStyle: {
          fontWeight: 600,
          color: grayscale ? '#171717' : dark ? '#f3f4f6' : colorblind ? '#e8c4a2' : '#111827',
        },
      },
    }
  }, [colorblind, grayscale, dark])
}
