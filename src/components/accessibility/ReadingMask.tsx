import { useEffect, useState } from 'react'
import { usePreferences } from '../../contexts/PreferencesContext'

const MASK_HEIGHT = 120

export function ReadingMask() {
  const { accessibility } = usePreferences()
  const [y, setY] = useState(() => window.innerHeight / 2)

  useEffect(() => {
    if (!accessibility.readingMask) return

    const onMove = (e: MouseEvent) => setY(e.clientY)
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) setY(e.touches[0].clientY)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [accessibility.readingMask])

  if (!accessibility.readingMask) return null

  const top = Math.max(0, y - MASK_HEIGHT / 2)
  const bottom = top + MASK_HEIGHT

  return (
    <div className="a11y-reading-mask" aria-hidden="true">
      <div className="a11y-reading-mask__shade" style={{ height: top }} />
      <div className="a11y-reading-mask__window" style={{ top, height: MASK_HEIGHT }} />
      <div
        className="a11y-reading-mask__shade a11y-reading-mask__shade--bottom"
        style={{ top: bottom, height: `calc(100vh - ${bottom}px)` }}
      />
    </div>
  )
}
