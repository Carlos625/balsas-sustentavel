// src/services/entregas.ts
import { api } from "./api";

export type CriarEntregaPayload = {
  tipoResiduo: string;
  peso: number;
  postoColeta: string;
  horario: string;
  dataEntrega: string;
  observacoes?: string;
};

export type CriarEntregaResposta = {
  sucesso: boolean;
  mensagem?: string;
  entrega?: any;
};

export async function criarEntrega(
  payload: CriarEntregaPayload
): Promise<CriarEntregaResposta> {
  // pega o token salvo no login (ajuste a chave se for diferente)
  const token = localStorage.getItem("token");

  const { data } = await api.post("/entregas", payload, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });

  return data;
}
