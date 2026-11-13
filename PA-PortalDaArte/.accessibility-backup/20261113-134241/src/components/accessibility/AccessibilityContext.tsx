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

export const FONT_SCALE_OPTIONS = [1, 1.25, 1.5, 1.75, 2] as const;
export type FontScale = (typeof FONT_SCALE_OPTIONS)[number];

type AccessibilitySettings = {
  fontScale: FontScale;
  highContrast: boolean;
};

type AccessibilityContextValue = AccessibilitySettings & {
  loaded: boolean;
  setFontScale: (scale: FontScale) => void;
  setHighContrast: (enabled: boolean) => void;
  resetAccessibility: () => void;
};

const STORAGE_KEY = '@portal_da_arte:accessibility_settings_v1';
const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontScale: 1,
  highContrast: false,
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function isFontScale(value: unknown): value is FontScale {
  return FONT_SCALE_OPTIONS.includes(value as FontScale);
}

export function AccessibilityProvider({ children }: PropsWithChildren) {
  const [fontScale, setFontScaleState] = useState<FontScale>(DEFAULT_SETTINGS.fontScale);
  const [highContrast, setHighContrastState] = useState(DEFAULT_SETTINGS.highContrast);
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

  const persist = useCallback(async (settings: AccessibilitySettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('[Acessibilidade] Não foi possível salvar as preferências:', error);
    }
  }, []);

  const setFontScale = useCallback(
    (scale: FontScale) => {
      setFontScaleState(scale);
      void persist({ fontScale: scale, highContrast });
    },
    [highContrast, persist]
  );

  const setHighContrast = useCallback(
    (enabled: boolean) => {
      setHighContrastState(enabled);
      void persist({ fontScale, highContrast: enabled });
    },
    [fontScale, persist]
  );

  const resetAccessibility = useCallback(() => {
    setFontScaleState(DEFAULT_SETTINGS.fontScale);
    setHighContrastState(DEFAULT_SETTINGS.highContrast);
    void persist(DEFAULT_SETTINGS);
  }, [persist]);

  const value = useMemo(
    () => ({
      fontScale,
      highContrast,
      loaded,
      setFontScale,
      setHighContrast,
      resetAccessibility,
    }),
    [fontScale, highContrast, loaded, setFontScale, setHighContrast, resetAccessibility]
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
