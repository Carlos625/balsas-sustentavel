import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type PontosContextType = {
  saldo: number;
  atualizarSaldo: (novoSaldo: number) => void;
  adicionarPontos: (pontos: number) => void;
  removerPontos: (pontos: number) => void;
};

const PontosContext = createContext<PontosContextType | undefined>(undefined);

export function PontosProvider({ children }: { children: ReactNode }) {
  const [saldo, setSaldo] = useState(0);

  function atualizarSaldo(novoSaldo: number) {
    setSaldo(novoSaldo >= 0 ? novoSaldo : 0);
  }

  function adicionarPontos(pontos: number) {
    if (isNaN(pontos)) return;
    setSaldo((atual) => atual + pontos);
  }

  function removerPontos(pontos: number) {
    if (isNaN(pontos)) return;
    setSaldo((atual) => Math.max(atual - pontos, 0));
  }

  return (
    <PontosContext.Provider
      value={{ saldo, atualizarSaldo, adicionarPontos, removerPontos }}
    >
      {children}
    </PontosContext.Provider>
  );
}

export function usePontos() {
  const ctx = useContext(PontosContext);
  if (!ctx) {
    throw new Error("usePontos deve ser usado dentro de um PontosProvider");
  }
  return ctx;
}
