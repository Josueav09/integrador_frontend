import { usePreferences } from '../../contexts/PreferencesContext'

function AccessibilityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="4" r="2" />
      <path d="M19 8.5c-.6 0-1.1.2-1.5.6l-2.8 2.5-1.2-3.6c-.3-.9-1.1-1.5-2-1.5h-2.5c-.9 0-1.7.6-2 1.5L5.5 11.1 2.7 9.1C2.3 8.7 1.8 8.5 1.2 8.5.5 8.5 0 9 0 9.7s.5 1.2 1.2 1.2c.6 0 1.1-.2 1.5-.6l3.5-3.1 1.2 3.6c.3.9 1.1 1.5 2 1.5h2.5c.9 0 1.7-.6 2-1.5l1.2-3.6 3.5 3.1c.4.4.9.6 1.5.6.7 0 1.2-.5 1.2-1.2s-.5-1.2-1.2-1.2z" />
      <path d="M7 14.5c0 2.8 2.2 5 5 5s5-2.2 5-5v-1H7v1z" />
    </svg>
  )
}

type AccessibilityTriggerProps = {
  variant?: 'default' | 'dark'
}

export function AccessibilityTrigger({ variant = 'default' }: AccessibilityTriggerProps) {
  const { panelOpen, togglePanel, t } = usePreferences()

  return (
    <button
      type="button"
      className={`a11y-trigger a11y-trigger--${variant}${panelOpen ? ' a11y-trigger--active' : ''}`}
      onClick={togglePanel}
      aria-expanded={panelOpen}
      aria-controls="a11y-panel"
      aria-label={panelOpen ? t('a11y.closeMenu') : t('a11y.openMenu')}
      title={`${t('a11y.openMenu')} (Alt+A)`}
      data-testid="a11y-trigger"
    >
      <AccessibilityIcon />
    </button>
  )
}
