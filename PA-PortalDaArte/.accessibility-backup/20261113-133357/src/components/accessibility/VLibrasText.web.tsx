import { Text, type TextProps } from 'react-native';

/**
 * Na Web o widget oficial do VLibras já traduz o DOM completo.
 * Este componente permanece visual e funcionalmente idêntico ao Text original.
 */
export function VLibrasText(props: TextProps) {
  return <Text {...props} />;
}
