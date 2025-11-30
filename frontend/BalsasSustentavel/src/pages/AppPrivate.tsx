import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { criarOcorrencia } from "../services/ocorrencias";
import { criarEntrega } from "../services/entregas";
import { usePontos } from "../context/PontosContext";

export default function AppPrivate() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { saldo, atualizarSaldo, adicionarPontos } = usePontos();

  // ===== ESTADOS – OCORRÊNCIA =====
  const [bairro, setBairro] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingOcorrencia, setLoadingOcorrencia] = useState(false);
  const [mensagemOcorrencia, setMensagemOcorrencia] = useState<string | null>(null);

  // ===== ESTADOS – ENTREGA DE RESÍDUOS =====
  const [tipoResiduo, setTipoResiduo] = useState("");
  const [peso, setPeso] = useState<string>(""); // string p/ input number
  const [postoColeta, setPostoColeta] = useState("");
  const [horario, setHorario] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [observacoesEntrega, setObservacoesEntrega] = useState("");
  const [pontosPrevia, setPontosPrevia] = useState(0);
  const [loadingEntrega, setLoadingEntrega] = useState(false);
  const [mensagemEntrega, setMensagemEntrega] = useState<string | null>(null);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // ===== HELPER LOCALIZAÇÃO (OCORRÊNCIA) =====
  function obterLocalizacao(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    });
  }

  // ===== FOTO OCORRÊNCIA =====
  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setFotoArquivo(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }

  // ===== SUBMIT OCORRÊNCIA =====
  async function handleDenunciaSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMensagemOcorrencia(null);
    setLoadingOcorrencia(true);

    try {
      const localizacao = await obterLocalizacao();

      const formData = new FormData();
      formData.append("bairro", bairro);
      formData.append("tipo", tipo);
      formData.append("descricao", descricao);

      if (fotoArquivo) {
        formData.append("foto", fotoArquivo);
      }

      if (localizacao) {
        formData.append("latitude", String(localizacao.latitude));
        formData.append("longitude", String(localizacao.longitude));
      } else {
        formData.append("latitude", "");
        formData.append("longitude", "");
      }

      const resposta = await criarOcorrencia(formData);

      if (!resposta.sucesso) {
        const msg =
          ("mensagem" in resposta && resposta.mensagem) ||
          "Erro ao registrar ocorrência";
        throw new Error(msg);
      }

      setMensagemOcorrencia("Ocorrência registrada com sucesso!");

      setBairro("");
      setTipo("");
      setDescricao("");
      setFotoArquivo(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);

      const fileInput = document.getElementById("foto") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    } catch (erro: any) {
      console.error("Erro ao enviar ocorrência:", erro);
      setMensagemOcorrencia(
        erro?.message || "Não foi possível registrar a ocorrência. Tente novamente."
      );
    } finally {
      setLoadingOcorrencia(false);
    }
  }

  // ===== CÁLCULO PRÉVIA DE PONTOS (ENTREGA) =====
  function calcularPontos(tipoR: string, pesoStr: string): number {
    const pesoNumber = parseFloat(pesoStr.replace(",", "."));
    if (!tipoR || isNaN(pesoNumber) || pesoNumber <= 0) return 0;

    const pontosPorKg: Record<string, number> = {
      latinhas: 50,
      plastico: 20,
      papel: 15,
      vidro: 10,
      metal: 30,
      eletronicos: 100,
    };

    const valor = pontosPorKg[tipoR] ?? 0;
    return Math.floor(valor * pesoNumber);
  }

  function handleTipoResiduoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setTipoResiduo(value);
    setPontosPrevia(calcularPontos(value, peso));
  }

  function handlePesoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPeso(value);
    setPontosPrevia(calcularPontos(tipoResiduo, value));
  }

  // ===== SUBMIT ENTREGA DE RESÍDUOS =====
  async function handleEntregaSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMensagemEntrega(null);
    setLoadingEntrega(true);

    try {
      const body = {
        tipoResiduo,
        peso: Number(peso),
        postoColeta,
        horario,
        dataEntrega,
        observacoes: observacoesEntrega || "Informações adicionais (opcional)",
      };

      const resposta: any = await criarEntrega(body);

      if (!resposta.sucesso) {
        const msg = resposta.mensagem || "Erro ao agendar entrega";
        throw new Error(msg);
      }

      // 🔹 Atualiza os pontos com base na resposta do backend
      if (typeof resposta.novoSaldoPontos === "number") {
        atualizarSaldo(resposta.novoSaldoPontos);
      } else if (typeof resposta.pontosGanhos === "number") {
        adicionarPontos(resposta.pontosGanhos);
      }

      setMensagemEntrega("Entrega agendada com sucesso!");

      // limpa form
      setTipoResiduo("");
      setPeso("");
      setPostoColeta("");
      setHorario("");
      setDataEntrega("");
      setObservacoesEntrega("");
      setPontosPrevia(0);
    } catch (erro: any) {
      console.error("Erro ao agendar entrega:", erro);
      setMensagemEntrega(
        erro?.message || "Não foi possível agendar a entrega. Tente novamente."
      );
    } finally {
      setLoadingEntrega(false);
    }
  }

  return (
    <div className="app-wrapper">
      {/* Header interno */}
      <header className="app-header">
        <div className="app-logo">Balsas Sustentável</div>

        <nav className="app-nav">
          <button
            onClick={() =>
              document
                .getElementById("denuncia")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Registrar ocorrência
          </button>

          <button
            onClick={() =>
              document
                .getElementById("entrega")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Entregar resíduos
          </button>

          <button
            onClick={() =>
              document
                .getElementById("pontos")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Meus pontos
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </nav>
      </header>

      {/* Conteúdo principal */}
      <main className="app-main">
        <h1 className="app-title">Olá! Vamos cuidar de Balsas juntos 🌱</h1>
        <p className="app-subtitle">
          Aqui você pode registrar ocorrências ambientais, agendar entregas de
          resíduos e acompanhar seus pontos acumulados.
        </p>

        {/* === GRID DOS 3 CARDS (RESUMO) === */}
        <div className="app-grid">
          {/* Card 1 */}
          <section className="app-card">
            <div>
              <h3>Registrar ocorrência</h3>
              <p>
                Denuncie queimadas, descarte irregular de lixo, esgoto a céu
                aberto e outras situações que impactam o meio ambiente.
              </p>
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("denuncia")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Registrar agora
            </button>
          </section>

          {/* Card 2 */}
          <section className="app-card">
            <div>
              <h3>Entregar resíduos</h3>
              <p>
                Agende a entrega de recicláveis nos pontos de coleta parceiros e
                acumule pontos a cada entrega realizada.
              </p>
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("entrega")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Agendar entrega
            </button>
          </section>

          {/* Card 3 */}
          <section className="app-card">
            <div>
              <h3>Meus pontos</h3>
              <div className="points-value">{saldo} pts</div>
              <p>
                Veja seu saldo de pontos e descubra como trocar por benefícios
                com os parceiros do programa.
              </p>
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("pontos")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Ver detalhes
            </button>
          </section>
        </div>

        {/* === SEÇÕES COMPLETAS (UMA EMBAIXO DA OUTRA) === */}
        <div className="app-sections">
          {/* === SEÇÃO 1 – REGISTRAR OCORRÊNCIA === */}
          <section id="denuncia" className="section-dark">
            <div className="container">
              <h2>Registre uma Ocorrência</h2>
              <p className="section-subtitle">
                Viu um descarte irregular, foco de lixo ou queimada? Nos ajude a
                mapear o problema.
              </p>

              <form onSubmit={handleDenunciaSubmit}>
                <div className="form-group">
                  <label htmlFor="bairro">Bairro:</label>
                  <input
                    type="text"
                    id="bairro"
                    name="bairro"
                    placeholder="Ex: Centro"
                    required
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tipo">Tipo de problema:</label>
                  <select
                    id="tipo"
                    name="tipo"
                    required
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="queimada">Queimada</option>
                    <option value="acumulo">Acúmulo de lixo</option>
                    <option value="descarte">Descarte irregular</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="descricao">Descrição:</label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    rows={5}
                    placeholder="Descreva o que você viu..."
                    required
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="foto" className="file-label">
                    Anexar Foto
                    <input
                      type="file"
                      id="foto"
                      name="foto"
                      className="input-file"
                      accept="image/*"
                      onChange={handleFotoChange}
                    />
                  </label>
                </div>

                {previewUrl && (
                  <div className="image-preview">
                    <p>Pré-visualização da imagem:</p>
                    <img
                      src={previewUrl}
                      alt="Pré-visualização da ocorrência"
                      style={{ maxWidth: "100%", borderRadius: "8px", marginTop: "8px" }}
                    />
                  </div>
                )}

                {mensagemOcorrencia && (
                  <p className="feedback-message">
                    {mensagemOcorrencia}
                  </p>
                )}

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loadingOcorrencia}
                >
                  {loadingOcorrencia ? "Enviando..." : "Enviar Ocorrência"}
                </button>
              </form>
            </div>
          </section>

          {/* === SEÇÃO 2 – ENTREGA DE RESÍDUOS === */}
          <section id="entrega" className="section-light">
            <div className="container">
              <h2>Entrega de Resíduos</h2>
              <p className="section-subtitle">
                Agende a entrega dos seus resíduos e acumule pontos que podem
                ser trocados por benefícios!
              </p>

              <form id="formEntrega" onSubmit={handleEntregaSubmit}>
                <div className="form-group">
                  <label htmlFor="tipoResiduo">Tipo de Resíduo:</label>
                  <select
                    id="tipoResiduo"
                    name="tipoResiduo"
                    required
                    value={tipoResiduo}
                    onChange={handleTipoResiduoChange}
                  >
                    <option value="">Selecione o tipo de resíduo</option>
                    <option value="latinhas">Latinhas (50 pts/kg)</option>
                    <option value="plastico">Plástico (20 pts/kg)</option>
                    <option value="papel">Papel/Papelão (15 pts/kg)</option>
                    <option value="vidro">Vidro (10 pts/kg)</option>
                    <option value="metal">Metal (30 pts/kg)</option>
                    <option value="eletronicos">Eletrônicos (100 pts/kg)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="peso">Peso (kg):</label>
                  <input
                    type="number"
                    id="peso"
                    name="peso"
                    min={0.1}
                    step={0.1}
                    placeholder="Ex: 2.5"
                    required
                    value={peso}
                    onChange={handlePesoChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="postoColeta">Posto de Coleta:</label>
                  <select
                    id="postoColeta"
                    name="postoColeta"
                    required
                    value={postoColeta}
                    onChange={(e) => setPostoColeta(e.target.value)}
                  >
                    <option value="">Selecione o posto de coleta</option>
                    <option value="centro">
                      Posto Centro - Av. Principal
                    </option>
                    <option value="jk">Posto JK - Rua JK</option>
                    <option value="caic">Posto CAIC</option>
                    <option value="camara">Posto Câmara</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="horario">Horário Preferencial:</label>
                  <select
                    id="horario"
                    name="horario"
                    required
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                  >
                    <option value="">Selecione o horário</option>
                    <option value="manha">Manhã</option>
                    <option value="tarde">Tarde</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="dataEntrega">Data da Entrega:</label>
                  <input
                    type="date"
                    id="dataEntrega"
                    name="dataEntrega"
                    required
                    value={dataEntrega}
                    onChange={(e) => setDataEntrega(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="observacoesEntrega">Observações:</label>
                  <textarea
                    id="observacoesEntrega"
                    name="observacoesEntrega"
                    rows={4}
                    placeholder="Informações adicionais (opcional)"
                    value={observacoesEntrega}
                    onChange={(e) => setObservacoesEntrega(e.target.value)}
                  />
                </div>

                <div className="pontos-preview">
                  <h3>Prévia de Pontos</h3>
                  <p className="pontos-valor" id="pontosPrevia">
                    {pontosPrevia} pontos
                  </p>
                  <p className="pontos-descricao">
                    Os pontos exatos podem ser recalculados pelo sistema na confirmação.
                  </p>
                </div>

                {mensagemEntrega && (
                  <p className="feedback-message">
                    {mensagemEntrega}
                  </p>
                )}

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loadingEntrega}
                >
                  {loadingEntrega ? "Agendando..." : "Agendar Entrega"}
                </button>
              </form>
            </div>
          </section>

          {/* === SEÇÃO 3 – MEUS PONTOS === */}
          <section id="pontos" className="section-dark">
            <div className="container">
              <h2>Meus Pontos e Benefícios</h2>
              <p className="section-subtitle">
                Troque seus pontos por benefícios em estabelecimentos parceiros
              </p>

              <div className="saldo-pontos">
                <h3>Saldo Atual</h3>
                <p className="saldo-valor" id="saldoPontos">
                  {saldo} pontos
                </p>
                <p className="saldo-info">
                  Continue entregando resíduos para acumular mais pontos!
                </p>
              </div>

              <h3 className="parceiros-titulo">Parceiros para Resgate</h3>

              <div className="parceiros-grid">
                <div className="parceiro-card">
                  <div className="parceiro-icon">⛽</div>
                  <h4>Postos de Combustível</h4>
                  <ul className="parceiro-lista">
                    <li>500 pts = R$ 10,00</li>
                    <li>1000 pts = R$ 25,00</li>
                    <li>2000 pts = R$ 55,00</li>
                  </ul>
                  <button className="btn-resgatar">Resgatar</button>
                </div>

                <div className="parceiro-card">
                  <div className="parceiro-icon">💡</div>
                  <h4>Conta de Energia</h4>
                  <ul className="parceiro-lista">
                    <li>600 pts = R$ 15,00</li>
                    <li>1200 pts = R$ 35,00</li>
                    <li>2500 pts = R$ 75,00</li>
                  </ul>
                  <button className="btn-resgatar">Resgatar</button>
                </div>

                <div className="parceiro-card">
                  <div className="parceiro-icon">🛒</div>
                  <h4>Supermercados</h4>
                  <ul className="parceiro-lista">
                    <li>400 pts = R$ 10,00</li>
                    <li>800 pts = R$ 22,00</li>
                    <li>1500 pts = R$ 45,00</li>
                  </ul>
                  <button className="btn-resgatar">Resgatar</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
