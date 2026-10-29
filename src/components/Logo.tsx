import { useState } from 'react';
import { Moeda } from '../types';

interface LogoProps {
  moeda: Moeda;
  tamanho: number;
}

// mostra as iniciais quando a imagem da coingecko não carrega
function Logo({ moeda, tamanho }: LogoProps) {
  const [falhou, setFalhou] = useState(false);

  if (falhou || !moeda.logo) {
    return (
      <span className="logo logo--iniciais" style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.38 }} aria-hidden="true">
        {moeda.simbolo.slice(0, 3)}
      </span>
    );
  }

  return (
    <img className="logo" src={moeda.logo} alt="" width={tamanho} height={tamanho} onError={() => setFalhou(true)} />
  );
}

export default Logo;
