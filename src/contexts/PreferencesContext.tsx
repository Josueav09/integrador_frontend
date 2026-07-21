import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { LOCALE_LABELS, translations, type Locale, type TranslationKey } from '../i18n/translations'

const STORAGE_KEY = 'gnn_user_preferences_v1'

export type TextSizeLevel = 0 | 1 | 2
export type ContrastMode = 'normal' | 'high' | 'grayscale'
export type ThemeMode = 'light' | 'dark'
export type LineSpacingMode = 'normal' | 'relaxed' | 'loose'
export type AccessibilityProfile = 'none' | 'lowVision' | 'dyslexia' | 'adhd' | 'colorBlind'

export type AccessibilityState = {
  textSize: TextSizeLevel
  contrast: ContrastMode
  theme: ThemeMode
  largeCursor: boolean
  readingMask: boolean
  dyslexiaFont: boolean
  lineSpacing: LineSpacingMode
  reduceMotion: boolean
  profile: AccessibilityProfile
}

type StoredPreferences = {
  locale: Locale
  accessibility: AccessibilityState
}

const DEFAULT_ACCESSIBILITY: AccessibilityState = {
  textSize: 0,
  contrast: 'normal',
  theme: 'light',
  largeCursor: false,
  readingMask: false,
  dyslexiaFont: false,
  lineSpacing: 'normal',
  reduceMotion: false,
  profile: 'none',
}

const PROFILE_PRESETS: Record<Exclude<AccessibilityProfile, 'none'>, Partial<AccessibilityState>> = {
  lowVision: {
    textSize: 2,
    contrast: 'high',
    largeCursor: true,
    lineSpacing: 'relaxed',
    dyslexiaFont: false,
    readingMask: false,
    reduceMotion: false,
  },
  dyslexia: {
    textSize: 1,
    dyslexiaFont: true,
    lineSpacing: 'loose',
    contrast: 'normal',
    largeCursor: false,
    readingMask: false,
    reduceMotion: false,
  },
  adhd: {
    readingMask: true,
    reduceMotion: true,
    lineSpacing: 'relaxed',
    contrast: 'normal',
    textSize: 0,
    largeCursor: false,
    dyslexiaFont: false,
  },
  colorBlind: {
    contrast: 'normal',
    reduceMotion: false,
    textSize: 0,
    largeCursor: false,
    readingMask: false,
    dyslexiaFont: false,
    lineSpacing: 'normal',
  },
}

function normalizeAccessibility(raw: Partial<AccessibilityState> | undefined): AccessibilityState {
  const merged = { ...DEFAULT_ACCESSIBILITY, ...raw }
  const legacyContrast = merged.contrast as string
  if (legacyContrast === 'dark') {
    merged.contrast = 'normal'
    merged.theme = 'dark'
  }
  if (!['normal', 'high', 'grayscale'].includes(merged.contrast)) {
    merged.contrast = 'normal'
  }
  if (merged.theme !== 'light' && merged.theme !== 'dark') {
    merged.theme = 'light'
  }
  return merged
}

function readStored(): StoredPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { locale: 'es', accessibility: DEFAULT_ACCESSIBILITY }
    const parsed = JSON.parse(raw) as Partial<StoredPreferences>
    return {
      locale: parsed.locale ?? 'es',
      accessibility: normalizeAccessibility(parsed.accessibility),
    }
  } catch {
    return { locale: 'es', accessibility: DEFAULT_ACCESSIBILITY }
  }
}

function applyToDocument(locale: Locale, a11y: AccessibilityState) {
  const root = document.documentElement
  root.lang = locale === 'qu' ? 'qu' : locale
  root.dataset.a11yText = String(a11y.textSize)
  root.dataset.a11yContrast = a11y.contrast
  root.dataset.a11yTheme = a11y.theme
  root.dataset.a11yCursor = a11y.largeCursor ? 'large' : 'normal'
  root.dataset.a11yMask = a11y.readingMask ? 'on' : 'off'
  root.dataset.a11yDyslexia = a11y.dyslexiaFont ? 'on' : 'off'
  root.dataset.a11yLine = a11y.lineSpacing
  root.dataset.a11yMotion = a11y.reduceMotion ? 'reduced' : 'normal'
  root.dataset.a11yColorblind = a11y.profile === 'colorBlind' ? 'on' : 'off'
}

type PreferencesContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  accessibility: AccessibilityState
  setTextSize: (level: TextSizeLevel) => void
  cycleTextSize: () => void
  cycleContrast: () => void
  setTheme: (theme: ThemeMode) => void
  toggleLargeCursor: () => void
  toggleReadingMask: () => void
  toggleDyslexiaFont: () => void
  cycleLineSpacing: () => void
  toggleReduceMotion: () => void
  setProfile: (profile: AccessibilityProfile) => void
  resetAccessibility: () => void
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
  togglePanel: () => void
  t: (key: TranslationKey) => string
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

function persist(locale: Locale, accessibility: AccessibilityState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ locale, accessibility }))
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const stored = useMemo(() => readStored(), [])
  const [locale, setLocaleState] = useState<Locale>(stored.locale)
  const [accessibility, setAccessibility] = useState<AccessibilityState>(stored.accessibility)
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    applyToDocument(locale, accessibility)
    persist(locale, accessibility)
  }, [locale, accessibility])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        setPanelOpen((open) => !open)
      }
      if (e.key === 'Escape') setPanelOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const updateA11y = useCallback((patch: Partial<AccessibilityState>) => {
    setAccessibility((prev) => ({ ...prev, ...patch, profile: patch.profile ?? 'none' }))
  }, [])

  const setLocale = useCallback((next: Locale) => setLocaleState(next), [])

  const setTextSize = useCallback((textSize: TextSizeLevel) => {
    updateA11y({ textSize, profile: 'none' })
  }, [updateA11y])

  const cycleTextSize = useCallback(() => {
    setAccessibility((prev) => {
      const next = ((prev.textSize + 1) % 3) as TextSizeLevel
      return { ...prev, textSize: next, profile: 'none' }
    })
  }, [])

  const cycleContrast = useCallback(() => {
    setAccessibility((prev) => {
      const order: ContrastMode[] = ['normal', 'high', 'grayscale']
      const idx = order.indexOf(prev.contrast)
      const contrast = order[(idx + 1) % order.length]
      return { ...prev, contrast, profile: 'none' }
    })
  }, [])

  const setTheme = useCallback((theme: ThemeMode) => {
    setAccessibility((prev) => ({ ...prev, theme, profile: 'none' }))
  }, [])

  const toggleLargeCursor = useCallback(() => {
    setAccessibility((prev) => ({
      ...prev,
      largeCursor: !prev.largeCursor,
      profile: 'none',
    }))
  }, [])

  const toggleReadingMask = useCallback(() => {
    setAccessibility((prev) => ({
      ...prev,
      readingMask: !prev.readingMask,
      profile: 'none',
    }))
  }, [])

  const toggleDyslexiaFont = useCallback(() => {
    setAccessibility((prev) => ({
      ...prev,
      dyslexiaFont: !prev.dyslexiaFont,
      profile: 'none',
    }))
  }, [])

  const cycleLineSpacing = useCallback(() => {
    setAccessibility((prev) => {
      const order: LineSpacingMode[] = ['normal', 'relaxed', 'loose']
      const idx = order.indexOf(prev.lineSpacing)
      const lineSpacing = order[(idx + 1) % order.length]
      return { ...prev, lineSpacing, profile: 'none' }
    })
  }, [])

  const toggleReduceMotion = useCallback(() => {
    setAccessibility((prev) => ({
      ...prev,
      reduceMotion: !prev.reduceMotion,
      profile: 'none',
    }))
  }, [])

  const setProfile = useCallback((profile: AccessibilityProfile) => {
    if (profile === 'none') {
      setAccessibility(DEFAULT_ACCESSIBILITY)
      return
    }
    setAccessibility({
      ...DEFAULT_ACCESSIBILITY,
      ...PROFILE_PRESETS[profile],
      profile,
    })
  }, [])

  const resetAccessibility = useCallback(() => {
    setAccessibility(DEFAULT_ACCESSIBILITY)
  }, [])

  const togglePanel = useCallback(() => setPanelOpen((o) => !o), [])

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key] ?? translations.es[key],
    [locale],
  )

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      accessibility,
      setTextSize,
      cycleTextSize,
      cycleContrast,
      setTheme,
      toggleLargeCursor,
      toggleReadingMask,
      toggleDyslexiaFont,
      cycleLineSpacing,
      toggleReduceMotion,
      setProfile,
      resetAccessibility,
      panelOpen,
      setPanelOpen,
      togglePanel,
      t,
    }),
    [
      locale,
      accessibility,
      setTextSize,
      cycleTextSize,
      cycleContrast,
      setTheme,
      toggleLargeCursor,
      toggleReadingMask,
      toggleDyslexiaFont,
      cycleLineSpacing,
      toggleReduceMotion,
      setProfile,
      resetAccessibility,
      panelOpen,
      togglePanel,
      t,
    ],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider')
  return ctx
}

export function useTranslation() {
  const { t, locale } = usePreferences()
  return { t, locale, localeLabel: LOCALE_LABELS[locale] }
}
