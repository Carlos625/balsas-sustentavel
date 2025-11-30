import { createContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  pontos: number;
  role?: string;
}

interface LoginResponse {
  sucesso: boolean;
  mensagem: string;
  token: string;
  usuario: Usuario;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<LoginResponse | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  usuario: null,
  login: async () => null,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Carregar token + usuário salvo ao abrir app
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) return;

    setToken(savedToken);

    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
      .then((response) => {
        // backend: { sucesso, usuario }
        setUsuario(response.data.usuario);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUsuario(null);
      });
  }, []);

  async function login(email: string, senha: string): Promise<LoginResponse | null> {
    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:5000/api/auth/login",
        { email, senha }
      );

      const data = response.data;

      if (!data?.token) {
        return null;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUsuario(data.usuario);

      // devolve tudo pro Login.tsx
      return data;
    } catch (error) {
      console.error("Erro no login:", error);
      return null;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        usuario,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
