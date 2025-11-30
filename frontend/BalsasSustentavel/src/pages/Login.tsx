// src/pages/Login.tsx
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { usePontos } from "../context/PontosContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { atualizarSaldo } = usePontos();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = await login(email, senha);

    if (!data || !data.sucesso) {
      setErro("Email ou senha inválidos.");
      return;
    }

    // saldo real vindo do backend (usuario.pontos)
    atualizarSaldo(data.usuario?.pontos ?? 0);

    navigate("/app");
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Bem-vindo de volta</h1>
          <p>Entre e continue fazendo a diferença por Balsas.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && <p style={{ color: "#ef4444" }}>{erro}</p>}

          <button className="auth-button" type="submit">
            Entrar
          </button>
        </form>

        <div className="auth-footer">
          <span>Ainda não tem conta?</span>
          <Link to="/register">Criar cadastro</Link>
        </div>
      </div>
    </div>
  );
}
