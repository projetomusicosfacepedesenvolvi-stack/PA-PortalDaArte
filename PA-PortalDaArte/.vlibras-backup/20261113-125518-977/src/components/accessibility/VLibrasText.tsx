import React, { useMemo, useRef } from 'react';
import { Text as RNText, type TextProps } from 'react-native';
import { useVLibrasTouchableWrapper } from 'react-native-vlibras';

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
 * Substituto transparente do Text apenas no runtime nativo.
 * Preserva todas as props e estilos originais e só acrescenta a ação de
 * tradução quando o modo VLibras estiver ativo.
 */
export function VLibrasText({ children, onPress, ...props }: TextProps) {
  const text = useMemo(() => textFromNode(children).trim(), [children]);
  const ref = useRef<any>(null);

  const wrapped = useVLibrasTouchableWrapper({
    ref,
    text,
    onPress,
  });

  return (
    <RNText
      {...props}
      ref={wrapped.ref as any}
      onPress={text ? wrapped.onPress : onPress}
    >
      {children}
    </RNText>
  );
}
