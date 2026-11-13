import React, { useMemo } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput as RNTextInput,
  type TextInputProps,
  type TextStyle,
} from 'react-native';
import { useAccessibility } from './AccessibilityContext';

/** TextInput compatível com tamanho de fonte, espaçamento e leitores de tela. */
export function AccessibleTextInput({ style, accessibilityLabel, placeholder, secureTextEntry, multiline, ...props }: TextInputProps) {
  const { fontScale, readingSpacing } = useAccessibility();

  const scaledStyle = useMemo<TextStyle | undefined>(() => {
    if (fontScale === 1 && !readingSpacing) return undefined;

    const flat = StyleSheet.flatten(style) || {};
    const baseFontSize = typeof flat.fontSize === 'number' ? flat.fontSize : 14;
    const scaledFontSize = baseFontSize * fontScale;
    const baseLineHeight = typeof flat.lineHeight === 'number' ? flat.lineHeight : baseFontSize * 1.25;
    const result: TextStyle & { wordSpacing?: number } = {
      ...(fontScale !== 1 ? { fontSize: scaledFontSize } : null),
      ...(readingSpacing
        ? { letterSpacing: Math.max(typeof flat.letterSpacing === 'number' ? flat.letterSpacing : 0, scaledFontSize * 0.04) }
        : null),
    };

    if (multiline) {
      const scaledLineHeight = baseLineHeight * fontScale;
      result.lineHeight = readingSpacing ? Math.max(scaledLineHeight, scaledFontSize * 1.6) : scaledLineHeight;
    }
    if (readingSpacing && Platform.OS === 'web') result.wordSpacing = scaledFontSize * 0.08;
    return result;
  }, [fontScale, readingSpacing, style, multiline]);

  const fallbackLabel = useMemo(() => {
    if (accessibilityLabel) return accessibilityLabel;
    if (secureTextEntry) return 'Senha';
    if (typeof placeholder === 'string' && placeholder.trim() && !/^•+$/.test(placeholder.trim())) {
      return placeholder.replace(/\.{3}$/g, '').trim();
    }
    return undefined;
  }, [accessibilityLabel, placeholder, secureTextEntry]);

  return (
    <RNTextInput
      {...props}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      accessibilityLabel={fallbackLabel}
      style={[style, scaledStyle as any]}
    />
  );
}
