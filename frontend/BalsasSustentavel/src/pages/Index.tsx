export default function Index() {
  return (
    <>

      {/* HERO */}
      <header id="header" className="hero">
        <div className="nav-container">
          <nav className="site-nav container">
            <a href="#" className="logo">
              Balsas Sustentável
            </a>
            <ul>
              <li>
                <a href="#problema">O Problema</a>
              </li>
              <li>
                <a href="#informacoes">Informações</a>
              </li>
              <li>
                <a href="#contato">Contato</a>
              </li>
               <li>
                <a href="Login">| Login</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="hero-content container">
          <h1>Plataforma Comunitária de Gestão de Resíduos em Balsas (MA)</h1>
          <p>
            Uma iniciativa para aproximar a comunidade da gestão dos resíduos,
            promovendo educação ambiental, transparência e participação cidadã.
          </p>
          <a href="#informacoes" className="cta-button">
            Faça sua parte
          </a>
        </div>
      </header>

      <main>
        {/* SEÇÃO O PROBLEMA */}
        <section id="problema" className="section-light">
          <div className="container">
            <h2>O Problema Ambiental em Nossa Cidade</h2>
            <p className="section-subtitle">
              A cidade de Balsas enfrenta sérios desafios com o manejo de
              resíduos sólidos. O lixão a céu aberto, próximo ao rio Balsas,
              provoca:
            </p>

            <div className="problem-list">
              <div className="problem-item">
                <span>💧</span> Contaminação do solo e da água;
              </div>
              <div className="problem-item">
                <span>💨</span> Fumaça tóxica por queimadas;
              </div>
              <div className="problem-item">
                <span>🐀</span> Proliferação de vetores e doenças;
              </div>
              <div className="problem-item">
                <span>🔥</span> Poluição do ar com graves incêndios;
              </div>
              <div className="problem-item">
                <span>❓</span> Falta de transparência na gestão.
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO INFORMAÇÕES */}
        <section id="informacoes" className="section-light section-info">
          <div className="container">
            <h2>Informações e Educação Ambiental</h2>
            <p className="section-subtitle">
              Pequenas ações geram grandes mudanças. Aprenda como contribuir.
            </p>

            <div className="info-grid">
              <article className="info-card">
                <h3>♻️ Dicas de Reciclagem</h3>
                <p>
                  Separe papel, plástico, vidro e metal. Higienize as
                  embalagens e procure os pontos de coleta seletiva ou
                  cooperativas locais.
                </p>
              </article>

              <article className="info-card">
                <h3>🌿 Compostagem Doméstica</h3>
                <p>
                  Transforme restos de frutas, verduras e borra de café em
                  adubo natural e rico em nutrientes para suas plantas, hortas
                  e jardins.
                </p>
              </article>

              <article className="info-card">
                <h3>🚛 Cronograma de Coleta</h3>
                <p>
                  <strong>Coleta Regular:</strong>
                  <br />
                  Segunda a Sexta - 7h às 17h
                  <br />
                  Prefeitura de Balsas / SAAE
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* SEÇÃO CONTATO */}
        <section id="contato" className="section-dark">
          <div className="container">
            <h2>Contato</h2>
            <p className="section-subtitle">
              Entre em contato com os órgãos responsáveis.
            </p>

            <div className="contact-info">
              <p>
                <strong>Prefeitura Municipal de Balsas</strong>
              </p>
              <p>Secretaria de Meio Ambiente</p>
              <p>
                Email:{" "}
                <a href="mailto:meioambiente@balsas.ma.gov.br">
                  meioambiente@balsas.ma.gov.br
                </a>
              </p>
              <p>
                Telefone:{" "}
                <a href="tel:+559912345678">(99) 1234-5678</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <p>
            &copy; 2025 - Plataforma Comunitária de Gestão de Resíduos em Balsas
            (MA)
          </p>
          <p>Projeto Extensionista Universitário</p>
        </div>
      </footer>
    </>
  );
}
