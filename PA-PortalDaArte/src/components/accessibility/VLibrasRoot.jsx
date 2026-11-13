import { VLibrasProvider } from 'react-native-vlibras';

/**
 * Integração nativa (Android/iOS).
 * O provider do react-native-vlibras adiciona o acionador flutuante e o player
 * sem alterar a árvore visual das telas existentes.
 */
export default function VLibrasRoot({ children }) {
  return <VLibrasProvider>{children}</VLibrasProvider>;
}
