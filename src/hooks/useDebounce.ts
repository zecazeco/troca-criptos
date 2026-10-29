import { useEffect, useState } from 'react';

function useDebounce<T>(valor: T, atraso: number) {
  const [atrasado, setAtrasado] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => setAtrasado(valor), atraso);
    return () => clearTimeout(timer);
  }, [valor, atraso]);

  return atrasado;
}

export default useDebounce;
