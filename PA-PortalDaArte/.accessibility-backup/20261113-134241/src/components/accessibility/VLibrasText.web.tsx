import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
} from 'react-native';
import { useAccessibility } from './AccessibilityContext';

/**
 * Na Web o widget oficial do VLibras traduz o DOM completo.
 * Este wrapper também aplica a escala tipográfica selecionada nas configurações.
 */
export function VLibrasText({ style, ...props }: TextProps) {
  const { fontScale } = useAccessibility();

  const scaledStyle = useMemo<TextStyle | undefined>(() => {
    if (fontScale === 1) return undefined;

    const flat = StyleSheet.flatten(style) || {};
    const baseFontSize = typeof flat.fontSize === 'number' ? flat.fontSize : 14;
    const baseLineHeight = typeof flat.lineHeight === 'number' ? flat.lineHeight : undefined;

    return {
      fontSize: baseFontSize * fontScale,
      ...(baseLineHeight ? { lineHeight: baseLineHeight * fontScale } : null),
    };
  }, [fontScale, style]);

  return <Text {...props} style={[style, scaledStyle]} />;
}
