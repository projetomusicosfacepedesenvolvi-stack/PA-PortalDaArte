import { useEffect } from 'react';

const VLIBRAS_SCRIPT = 'https://vlibras.gov.br/app/vlibras-plugin.js';
const SCRIPT_MARKER = 'data-portal-da-arte-vlibras';

/**
 * Integração Web.
 * O widget oficial do VLibras opera sobre o DOM da página inteira e, por isso,
 * não exige alterar Text, estilos ou o layout das telas no navegador.
 */
export default function VLibrasRoot({ children }) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const existing =
      document.querySelector(`script[${SCRIPT_MARKER}="true"]`) ||
      document.querySelector(`script[src="${VLIBRAS_SCRIPT}"]`);

    if (existing) return;

    const script = document.createElement('script');
    script.src = VLIBRAS_SCRIPT;
    script.async = true;
    script.setAttribute(SCRIPT_MARKER, 'true');
    script.onerror = () => {
      console.warn('[VLibras] Não foi possível carregar o widget oficial.');
    };
    document.body.appendChild(script);
  }, []);

  return <>{children}</>;
}
