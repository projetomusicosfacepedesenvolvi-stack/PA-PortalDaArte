import React, { useMemo } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  type TextInputProps,
  type TextStyle,
} from 'react-native';
import { useAccessibility } from './AccessibilityContext';

/**
 * TextInput compatível com a preferência de tamanho de fonte do Portal da Arte.
 * Em 100% não acrescenta nenhum estilo e mantém o componente original intacto.
 */
export function AccessibleTextInput({ style, ...props }: TextInputProps) {
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

  return <RNTextInput {...props} style={[style, scaledStyle]} />;
}
