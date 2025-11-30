import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  isAuthenticated: boolean;  
  onLogout?: () => void;
}

export default function Header({ isAuthenticated, onLogout }: HeaderProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="header">
      <nav className="nav">
        <ul>
          <li><Link to="/">Balsas Sustentável</Link></li>

          {/* Se NÃO estiver na Home e estiver logado → mostra menu interno */}
          {!isHome && isAuthenticated && (
            <>
              <li><Link to="/app?tab=registrar">Registrar Ocorrência</Link></li>
              <li><Link to="/app?tab=entregar">Entregar Resíduos</Link></li>
              <li><Link to="/app?tab=pontos">Meus Pontos</Link></li>
            </>
          )}

          {/* Se NÃO estiver autenticado → mostrar Login */}
          {!isAuthenticated && (
            <li><Link to="/login">Login</Link></li>
          )}

          {/* Se estiver autenticado → mostrar Sair */}
          {isAuthenticated && (
            <li><button className="logout-btn" onClick={onLogout}>Sair</button></li>
          )}
        </ul>
      </nav>
    </header>
  );
}
