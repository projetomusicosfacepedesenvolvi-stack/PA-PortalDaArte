import React, { useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text as RNText,
  type TextProps,
  type TextStyle,
} from 'react-native';
import { useVLibrasTouchableWrapper } from 'react-native-vlibras';
import { useAccessibility } from './AccessibilityContext';

function textFromNode(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textFromNode).join('');
  }

  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return textFromNode(props.children);
  }

  return '';
}

/**
 * Text do Portal da Arte no runtime nativo.
 * Mantém VLibras e aplica apenas a escala tipográfica escolhida pelo usuário.
 */
export function VLibrasText({ children, onPress, style, ...props }: TextProps) {
  const text = useMemo(() => textFromNode(children).trim(), [children]);
  const ref = useRef<any>(null);
  const { fontScale } = useAccessibility();

  const wrapped = useVLibrasTouchableWrapper({
    ref,
    text,
    onPress,
  });

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

  return (
    <RNText
      {...props}
      style={[style, scaledStyle]}
      ref={wrapped.ref as any}
      onPress={text ? wrapped.onPress : onPress}
    >
      {children}
    </RNText>
  );
}
