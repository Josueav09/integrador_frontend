import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { LOCALE_LABELS, type Locale } from '../../i18n/translations'
import {
  usePreferences,
  type AccessibilityProfile,
  type ThemeMode,
} from '../../contexts/PreferencesContext'
import { ReadingMask } from './ReadingMask'

type OptionCardProps = {
  label: string
  active: boolean
  onClick: () => void
  children: React.ReactNode
  status?: string
}

function OptionCard({ label, active, onClick, children, status }: OptionCardProps) {
  return (
    <button
      type="button"
      className={`a11y-card${active ? ' a11y-card--active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={status ? `${label}: ${status}` : label}
    >
      <span className="a11y-card__icon" aria-hidden="true">
        {children}
      </span>
      <span className="a11y-card__label">{label}</span>
      {status && <span className="a11y-card__status">{status}</span>}
    </button>
  )
}

function PanelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="4" r="2" />
      <path d="M19 8.5c-.6 0-1.1.2-1.5.6l-2.8 2.5-1.2-3.6c-.3-.9-1.1-1.5-2-1.5h-2.5c-.9 0-1.7.6-2 1.5L5.5 11.1 2.7 9.1C2.3 8.7 1.8 8.5 1.2 8.5.5 8.5 0 9 0 9.7s.5 1.2 1.2 1.2c.6 0 1.1-.2 1.5-.6l3.5-3.1 1.2 3.6c.3.9 1.1 1.5 2 1.5h2.5c.9 0 1.7-.6 2-1.5l1.2-3.6 3.5 3.1c.4.4.9.6 1.5.6.7 0 1.2-.5 1.2-1.2s-.5-1.2-1.2-1.2z" />
      <path d="M7 14.5c0 2.8 2.2 5 5 5s5-2.2 5-5v-1H7v1z" />
    </svg>
  )
}

const PROFILE_OPTIONS: AccessibilityProfile[] = ['none', 'lowVision', 'dyslexia', 'adhd', 'colorBlind']

function profileLabel(t: (k: import('../../i18n/translations').TranslationKey) => string, p: AccessibilityProfile) {
  const map: Record<AccessibilityProfile, import('../../i18n/translations').TranslationKey> = {
    none: 'a11y.profile.none',
    lowVision: 'a11y.profile.lowVision',
    dyslexia: 'a11y.profile.dyslexia',
    adhd: 'a11y.profile.adhd',
    colorBlind: 'a11y.profile.colorBlind',
  }
  return t(map[p])
}

function roleLabel(
  t: (k: import('../../i18n/translations').TranslationKey) => string,
  rolId?: number,
) {
  if (rolId === 1) return t('header.role.admin')
  if (rolId === 2) return t('header.role.analyst')
  if (rolId === 3) return t('header.role.investigator')
  if (rolId === 4) return t('header.role.manager')
  return t('header.role.analyst')
}

/** Panel lateral y máscara de lectura (el botón va en PageHeader / AuthLayout). */
export function AccessibilityPanel() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, rolId } = useAuth()
  const {
    locale,
    setLocale,
    accessibility,
    cycleTextSize,
    cycleContrast,
    toggleLargeCursor,
    toggleReadingMask,
    toggleDyslexiaFont,
    cycleLineSpacing,
    toggleReduceMotion,
    setProfile,
    resetAccessibility,
    panelOpen,
    setPanelOpen,
    setTheme,
    t,
  } = usePreferences()

  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!panelOpen) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.a11y-trigger') || target.closest('.a11y-panel')) return
      setPanelOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [panelOpen, setPanelOpen])

  const textSizeLabels = [t('a11y.size.normal'), t('a11y.size.large'), t('a11y.size.xlarge')]
  const contrastLabels: Record<string, string> = {
    normal: t('a11y.contrast.normal'),
    high: t('a11y.contrast.high'),
    grayscale: t('a11y.contrast.grayscale'),
  }
  const themeLabels: Record<ThemeMode, string> = {
    light: t('a11y.theme.light'),
    dark: t('a11y.theme.dark'),
  }
  const spacingLabels: Record<string, string> = {
    normal: t('a11y.spacing.normal'),
    relaxed: t('a11y.spacing.relaxed'),
    loose: t('a11y.spacing.loose'),
  }

  return createPortal(
    <div className="a11y-portal">
      <ReadingMask />

      {panelOpen && (
        <div className="a11y-backdrop" aria-hidden="true" onClick={() => setPanelOpen(false)} />
      )}

      <aside
        id="a11y-panel"
        ref={panelRef}
        className={`a11y-panel${panelOpen ? ' a11y-panel--open' : ''}`}
        aria-hidden={!panelOpen}
        aria-label={t('a11y.menuTitle')}
      >
        <header className="a11y-panel__header">
          <PanelIcon />
          <h2>{t('a11y.menuTitle')}</h2>
          <button
            type="button"
            className="a11y-panel__close"
            onClick={() => setPanelOpen(false)}
            aria-label={t('a11y.closeMenu')}
          >
            ×
          </button>
        </header>

        <div className="a11y-panel__body">
          <label className="a11y-select-wrap">
            <span className="a11y-select-wrap__label">{t('a11y.language')}</span>
            <select
              className="a11y-select"
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              aria-label={t('a11y.language')}
            >
              {(Object.keys(LOCALE_LABELS) as Locale[]).map((code) => (
                <option key={code} value={code}>
                  {LOCALE_LABELS[code]}
                </option>
              ))}
            </select>
          </label>

          <label className="a11y-select-wrap">
            <span className="a11y-select-wrap__label">{t('a11y.theme')}</span>
            <select
              className="a11y-select"
              value={accessibility.theme}
              onChange={(e) => setTheme(e.target.value as ThemeMode)}
              aria-label={t('a11y.theme')}
            >
              {(Object.keys(themeLabels) as ThemeMode[]).map((mode) => (
                <option key={mode} value={mode}>
                  {themeLabels[mode]}
                </option>
              ))}
            </select>
          </label>

          <label className="a11y-select-wrap">
            <span className="a11y-select-wrap__label">{t('a11y.profile')}</span>
            <select
              className="a11y-select"
              value={accessibility.profile}
              onChange={(e) => setProfile(e.target.value as AccessibilityProfile)}
              aria-label={t('a11y.profile')}
            >
              {PROFILE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {profileLabel(t, p)}
                </option>
              ))}
            </select>
          </label>

          <div className="a11y-grid">
            <OptionCard
              label={t('a11y.textSize')}
              active={accessibility.textSize > 0}
              onClick={cycleTextSize}
              status={textSizeLabels[accessibility.textSize]}
            >
              <span className="a11y-icon-text">T<small>t</small></span>
            </OptionCard>

            <OptionCard
              label={t('a11y.contrast')}
              active={accessibility.contrast !== 'normal'}
              onClick={cycleContrast}
              status={contrastLabels[accessibility.contrast]}
            >
              <span className="a11y-icon-contrast" />
            </OptionCard>

            <OptionCard
              label={t('a11y.cursor')}
              active={accessibility.largeCursor}
              onClick={toggleLargeCursor}
              status={accessibility.largeCursor ? t('a11y.on') : t('a11y.off')}
            >
              <span className="a11y-icon-cursor">↖</span>
            </OptionCard>

            <OptionCard
              label={t('a11y.readingMask')}
              active={accessibility.readingMask}
              onClick={toggleReadingMask}
              status={accessibility.readingMask ? t('a11y.on') : t('a11y.off')}
            >
              <span className="a11y-icon-mask" />
            </OptionCard>

            <OptionCard
              label={t('a11y.dyslexiaFont')}
              active={accessibility.dyslexiaFont}
              onClick={toggleDyslexiaFont}
              status={accessibility.dyslexiaFont ? t('a11y.on') : t('a11y.off')}
            >
              <span className="a11y-icon-dyslexia">A<span>Z</span></span>
            </OptionCard>

            <OptionCard
              label={t('a11y.lineSpacing')}
              active={accessibility.lineSpacing !== 'normal'}
              onClick={cycleLineSpacing}
              status={spacingLabels[accessibility.lineSpacing]}
            >
              <span className="a11y-icon-spacing" />
            </OptionCard>

            <OptionCard
              label={t('a11y.reduceMotion')}
              active={accessibility.reduceMotion}
              onClick={toggleReduceMotion}
              status={accessibility.reduceMotion ? t('a11y.on') : t('a11y.off')}
            >
              <span className="a11y-icon-motion">◎</span>
            </OptionCard>
          </div>

          <section className="a11y-user" aria-label={t('a11y.userSection')}>
            <h3>{t('a11y.userSection')}</h3>
            {isAuthenticated && user ? (
              <div className="a11y-user__card">
                <p className="a11y-user__name">{user.name}</p>
                <p className="a11y-user__email">{user.email}</p>
                <p className="a11y-user__role">{roleLabel(t, rolId ?? user.rol_id)}</p>
                <div className="a11y-user__actions">
                  <button
                    type="button"
                    className="a11y-user__btn"
                    onClick={() => {
                      setPanelOpen(false)
                      navigate('/dashboard')
                    }}
                  >
                    {t('a11y.goDashboard')}
                  </button>
                  <button
                    type="button"
                    className="a11y-user__btn a11y-user__btn--ghost"
                    onClick={() => {
                      logout()
                      setPanelOpen(false)
                      navigate('/login')
                    }}
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="a11y-user__card">
                <p className="a11y-user__guest">—</p>
                <Link
                  to="/login"
                  className="a11y-user__btn"
                  onClick={() => setPanelOpen(false)}
                >
                  {t('a11y.goLogin')}
                </Link>
              </div>
            )}
          </section>

          <button type="button" className="a11y-reset" onClick={resetAccessibility}>
            <span aria-hidden="true">↺</span>
            {t('a11y.reset')}
          </button>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
