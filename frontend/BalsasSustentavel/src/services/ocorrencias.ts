import axios from "axios";

const API_URL = "http://localhost:5000/api";

export async function criarOcorrencia(dados: any) {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/ocorrencias`,
      dados,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { sucesso: true, dados: response.data };
  } catch (error: any) {
    return {
      sucesso: false,
      mensagem: error.response?.data?.mensagem || "Erro ao registrar ocorrência",
    };
  }
}
