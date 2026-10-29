import { ReactNode, useEffect, useId, useRef } from 'react';

interface DialogoProps {
  titulo: ReactNode;
  icone?: ReactNode;
  className?: string;
  onFechar: () => void;
  children: ReactNode;
}

// popup modal: fecha no x, no esc ou clicando fora
function Dialogo({ titulo, icone, className = '', onFechar, children }: DialogoProps) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();

  useEffect(() => {
    dialogo.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogo}
      className={`detalhe ${className}`.trim()}
      aria-labelledby={idTitulo}
      onClose={onFechar}
      onClick={(evento) => {
        if (evento.target === dialogo.current) dialogo.current.close();
      }}
    >
      <div className="detalhe__conteudo">
        <div className="detalhe__topo">
          {icone}
          <h2 id={idTitulo} className="detalhe__titulo">{titulo}</h2>
          <button type="button" className="detalhe__fechar" aria-label="Fechar" onClick={() => dialogo.current?.close()}>
            ×
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

export default Dialogo;
