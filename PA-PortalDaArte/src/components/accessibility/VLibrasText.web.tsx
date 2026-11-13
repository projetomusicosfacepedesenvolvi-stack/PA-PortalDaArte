import React, { useMemo } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
} from 'react-native';
import { useAccessibility } from './AccessibilityContext';

/** Na Web o widget oficial do VLibras traduz o DOM completo. */
export function VLibrasText({ style, ...props }: TextProps) {
  const { fontScale, readingSpacing } = useAccessibility();

  const scaledStyle = useMemo<TextStyle | undefined>(() => {
    if (fontScale === 1 && !readingSpacing) return undefined;

    const flat = StyleSheet.flatten(style) || {};
    const baseFontSize = typeof flat.fontSize === 'number' ? flat.fontSize : 14;
    const scaledFontSize = baseFontSize * fontScale;
    const baseLineHeight = typeof flat.lineHeight === 'number' ? flat.lineHeight : baseFontSize * 1.25;
    const scaledLineHeight = baseLineHeight * fontScale;

    const result: TextStyle & { wordSpacing?: number } = {
      ...(fontScale !== 1 ? { fontSize: scaledFontSize } : null),
      lineHeight: readingSpacing ? Math.max(scaledLineHeight, scaledFontSize * 1.6) : scaledLineHeight,
      ...(readingSpacing
        ? { letterSpacing: Math.max(typeof flat.letterSpacing === 'number' ? flat.letterSpacing : 0, scaledFontSize * 0.04) }
        : null),
    };

    if (readingSpacing && Platform.OS === 'web') result.wordSpacing = scaledFontSize * 0.08;
    return result;
  }, [fontScale, readingSpacing, style]);

  return <Text {...props} style={[style, scaledStyle as any]} />;
}
