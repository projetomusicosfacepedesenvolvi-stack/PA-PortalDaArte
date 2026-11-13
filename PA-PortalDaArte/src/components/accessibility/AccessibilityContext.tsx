import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { AccessibilityInfo } from 'react-native';

export const FONT_SCALE_OPTIONS = [1, 1.25, 1.5, 1.75, 2] as const;
export type FontScale = (typeof FONT_SCALE_OPTIONS)[number];

type AccessibilitySettings = {
  fontScale: FontScale;
  highContrast: boolean;
  readingSpacing: boolean;
};

type AccessibilityContextValue = AccessibilitySettings & {
  loaded: boolean;
  screenReaderEnabled: boolean;
  setFontScale: (scale: FontScale) => void;
  setHighContrast: (enabled: boolean) => void;
  setReadingSpacing: (enabled: boolean) => void;
  announce: (message: string) => void;
  resetAccessibility: () => void;
};

// Mantemos a mesma chave da primeira versão para preservar as preferências já salvas.
const STORAGE_KEY = '@portal_da_arte:accessibility_settings_v1';
const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontScale: 1,
  highContrast: false,
  readingSpacing: false,
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function isFontScale(value: unknown): value is FontScale {
  return FONT_SCALE_OPTIONS.includes(value as FontScale);
}

export function AccessibilityProvider({ children }: PropsWithChildren) {
  const [fontScale, setFontScaleState] = useState<FontScale>(DEFAULT_SETTINGS.fontScale);
  const [highContrast, setHighContrastState] = useState(DEFAULT_SETTINGS.highContrast);
  const [readingSpacing, setReadingSpacingState] = useState(DEFAULT_SETTINGS.readingSpacing);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw || !active) return;
        const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>;
        if (isFontScale(parsed.fontScale)) setFontScaleState(parsed.fontScale);
        if (typeof parsed.highContrast === 'boolean') setHighContrastState(parsed.highContrast);
        if (typeof parsed.readingSpacing === 'boolean') setReadingSpacingState(parsed.readingSpacing);
      } catch (error) {
        console.warn('[Acessibilidade] Não foi possível carregar as preferências:', error);
      } finally {
        if (active) setLoaded(true);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isScreenReaderEnabled()
      .then((enabled) => {
        if (active) setScreenReaderEnabled(Boolean(enabled));
      })
      .catch(() => undefined);

    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (enabled) => setScreenReaderEnabled(Boolean(enabled))
    );

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  const persist = useCallback(async (settings: AccessibilitySettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('[Acessibilidade] Não foi possível salvar as preferências:', error);
    }
  }, []);

  const announce = useCallback((message: string) => {
    if (!message.trim()) return;
    AccessibilityInfo.announceForAccessibility(message);
  }, []);

  const setFontScale = useCallback(
    (scale: FontScale) => {
      setFontScaleState(scale);
      void persist({ fontScale: scale, highContrast, readingSpacing });
      if (screenReaderEnabled) announce(`Tamanho da fonte alterado para ${Math.round(scale * 100)} por cento.`);
    },
    [highContrast, readingSpacing, screenReaderEnabled, persist, announce]
  );

  const setHighContrast = useCallback(
    (enabled: boolean) => {
      setHighContrastState(enabled);
      void persist({ fontScale, highContrast: enabled, readingSpacing });
      if (screenReaderEnabled) announce(`Alto contraste ${enabled ? 'ativado' : 'desativado'}.`);
    },
    [fontScale, readingSpacing, screenReaderEnabled, persist, announce]
  );

  const setReadingSpacing = useCallback(
    (enabled: boolean) => {
      setReadingSpacingState(enabled);
      void persist({ fontScale, highContrast, readingSpacing: enabled });
      if (screenReaderEnabled) announce(`Espaçamento de leitura ampliado ${enabled ? 'ativado' : 'desativado'}.`);
    },
    [fontScale, highContrast, screenReaderEnabled, persist, announce]
  );

  const resetAccessibility = useCallback(() => {
    setFontScaleState(DEFAULT_SETTINGS.fontScale);
    setHighContrastState(DEFAULT_SETTINGS.highContrast);
    setReadingSpacingState(DEFAULT_SETTINGS.readingSpacing);
    void persist(DEFAULT_SETTINGS);
    if (screenReaderEnabled) announce('Configurações de acessibilidade restauradas para o padrão.');
  }, [screenReaderEnabled, persist, announce]);

  const value = useMemo(
    () => ({
      fontScale,
      highContrast,
      readingSpacing,
      loaded,
      screenReaderEnabled,
      setFontScale,
      setHighContrast,
      setReadingSpacing,
      announce,
      resetAccessibility,
    }),
    [
      fontScale,
      highContrast,
      readingSpacing,
      loaded,
      screenReaderEnabled,
      setFontScale,
      setHighContrast,
      setReadingSpacing,
      announce,
      resetAccessibility,
    ]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de AccessibilityProvider.');
  }
  return context;
}
