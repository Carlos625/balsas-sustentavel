import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    try {
      setCarregando(true);
      setErro("");
      setSucesso("");

      const resp = await fetch("http://localhost:5000/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha,
          telefone
        }),
      });

      const data = await resp.json();

      if (!data.sucesso) {
        setErro(data.mensagem || "Erro no cadastro.");
        return;
      }

      setSucesso("Cadastro realizado com sucesso! Redirecionando...");

      // redireciona para login após 1s
      setTimeout(() => navigate("/login"), 1200);

    } catch (err) {
      setErro("Erro ao conectar com a API.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Criar conta</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Nome</label>
            <input 
              type="text" 
              placeholder="Seu nome" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="seuemail@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Telefone</label>
            <input 
              type="text" 
              placeholder="(99) 98765-4321"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="Crie uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Confirmar senha</label>
            <input 
              type="password" 
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          {erro && <p style={{ color: "red" }}>{erro}</p>}
          {sucesso && <p style={{ color: "lightgreen" }}>{sucesso}</p>}

          <button className="auth-button" type="submit" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Já tem conta?</span> <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  );
}
