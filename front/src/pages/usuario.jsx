import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/usuario.css";

export default function Usuario() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("dados");
  const [isModalAberto, setIsModalAberto] = useState(false);

  // Estados para as imagens de Capa e Avatar
  const [capa, setCapa] = useState(null);
  const [avatar, setAvatar] = useState(null);

  // Estados para os dados dinâmicos da API
  const [meusAnuncios, setMeusAnuncios] = useState([]);
  const [meusFavoritos, setMeusFavoritos] = useState([]);

  const [usuario, setUsuario] = useState({
    nomeExibicao: "João Paulo Muniz",
    nomeCompleto: "João Paulo",
    email: "joao@unifor.br",
    cidade: "Fortaleza",
    estado: "CE",
    biografia: "Estudante de ADS na UNIFOR desenvolvendo projetos e desenrolando soluções."
  });

  const [formDados, setFormDados] = useState({ ...usuario });

  // Carrega os dados do Back-end assim que a página abre
  useEffect(() => {
    carregarDadosDoUsuario();
  }, []);

  async function carregarDadosDoUsuario() {
    try {
      // Busca os favoritos (simulando filtro pelo seu usuário)
      const resFavoritos = await fetch("http://localhost:3001/favoritos?usuarioId=joao_muniz");
      const dataFav = await resFavoritos.json();
      setMeusFavoritos(dataFav);

      // Busca os anúncios reais cadastrados na sua API
      const resAnuncios = await fetch("http://localhost:3001/itens?usuarioId=joao_muniz");
      const dataAnuncios = await resAnuncios.json();
      setMeusAnuncios(dataAnuncios);
    } catch (error) {
      console.error("Erro ao carregar dados do servidor:", error);
    }
  }

  // Remove o favorito do banco de dados ao clicar no coração laranja
  async function handleRemoverFavorito(idFavorito) {
    try {
      await fetch(`http://localhost:3001/favoritos/${idFavorito}`, {
        method: "DELETE",
      });
      // Atualiza a lista chamando o banco novamente
      carregarDadosDoUsuario();
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  }

  // Funções de upload de arquivos locais
  const handleCapaChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCapa(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAbrirModal = () => {
    setFormDados({ ...usuario });
    setIsModalAberto(true);
  };

  const handleFecharModal = () => setIsModalAberto(false);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormDados((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvarPerfil = (e) => {
    e.preventDefault();
    setUsuario({ ...formDados });
    setIsModalAberto(false);
  };

  return (
    <div className="perfil-page">
      <Navbar />
      <main className="perfil-container">
        
        {/* BOTÃO DE VOLTAR */}
        <button 
          onClick={() => window.history.state && window.history.state.idx > 0 ? navigate(-1) : navigate("/")}
          className="btn-voltar-passo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '8px 0',
            marginBottom: '16px',
            transition: 'color 0.2s ease',
            alignSelf: 'flex-start'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#f97316'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Voltar
        </button>

        <div className="perfil-wrapper-card">
          
          {/* SEÇÃO CAPA E AVATAR COM EDITORES */}
          <div className="perfil-header-banner">
            <input 
              type="file" 
              id="upload-capa" 
              accept="image/*" 
              onChange={handleCapaChange} 
              style={{ display: "none" }} 
            />
            
            {capa ? (
              <img src={capa} alt="Capa de perfil" className="perfil-capa-imagem" />
            ) : (
              <div className="perfil-capa-placeholder"></div>
            )}
            
            <label htmlFor="upload-capa" className="btn-editar-foto btn-editar-capa" title="Editar foto de capa">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </label>

            <div className="perfil-avatar-container">
              <input 
                type="file" 
                id="upload-avatar" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                style={{ display: "none" }} 
              />
              
              <div className="perfil-avatar-big">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="perfil-avatar-imagem" />
                ) : (
                  "JP"
                )}
                <label htmlFor="upload-avatar" className="btn-editar-foto btn-editar-avatar" title="Editar foto de perfil">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </label>
              </div>
            </div>
          </div>

          {/* GRID DE CONTEÚDO PRINCIPAL */}
          <div className="perfil-content-grid">
            
            {/* COLUNA DA ESQUERDA: INFORMAÇÕES PESSOAIS */}
            <div className="perfil-col-left">
              <h2 className="perfil-nome-titulo">{usuario.nomeExibicao}</h2>
              
              <div className="perfil-info-group">
                <p><strong>Nome:</strong> {usuario.nomeCompleto}</p>
                <p><strong>Email:</strong> {usuario.email}</p>
              </div>

              <div className="perfil-meta-box">
                <div className="meta-item-badge">
                  <span>Cidade/Estado</span>
                  <div className="meta-badge-text">{usuario.cidade}/{usuario.estado}</div>
                </div>
                <div className="meta-item-badge">
                  <span>Biografia</span>
                  <div className="meta-badge-text bio-text">{usuario.biografia}</div>
                </div>
              </div>

              <div className="perfil-action-buttons">
                <button className="btn-perfil-editar" onClick={handleAbrirModal}>Editar Perfil</button>
                <button className="btn-perfil-sair" onClick={() => console.log("Sair...")}>Sair da Conta</button>
              </div>
            </div>

            {/* COLUNA DA DIREITA: ESTATÍSTICAS E ABAS */}
            <div className="perfil-col-right">
              <div className="perfil-estatisticas-row">
                <div className="estatistica-box">
                  <p>Itens Anunciados</p>
                  <h3>{meusAnuncios.length}</h3>
                </div>
                <div className="estatistica-box">
                  <p>Aluguéis Concluídos</p>
                  <h3>0</h3>
                </div>
                <div className="estatistica-box">
                  <p>Membro desde</p>
                  <h3>2026</h3>
                </div>
              </div>

              <div className="perfil-tabs-nav">
                <button 
                  className={`tab-btn ${abaAtiva === "dados" ? "tab-ativa" : ""}`}
                  onClick={() => setAbaAtiva("dados")}
                >
                  Meus Dados
                </button>
                <button 
                  className={`tab-btn ${abaAtiva === "alugueis" ? "tab-ativa" : ""}`}
                  onClick={() => setAbaAtiva("alugueis")}
                >
                  Meus Aluguéis
                </button>
                <button 
                  className={`tab-btn ${abaAtiva === "favoritos" ? "tab-ativa" : ""}`}
                  onClick={() => setAbaAtiva("favoritos")}
                >
                  Favoritos
                </button>
              </div>

              <div className="perfil-tab-content">
                
                {/* ABA 1: MEUS ANÚNCIOS */}
                {abaAtiva === "dados" && (
                  <div className="perfil-anuncios-section">
                    <h3 className="section-interna-titulo">Meus Anúncios</h3>
                    {meusAnuncios.length === 0 ? (
                      <p className="tab-vazia-text">Nenhum item anunciado ainda.</p>
                    ) : (
                      <div className="perfil-anuncios-lista">
                        {meusAnuncios.map((anuncio) => (
                          <div key={anuncio.id} className="perfil-anuncio-card">
                            <img src={anuncio.imagem} alt={anuncio.titulo} className="perfil-anuncio-thumb" />
                            
                            <div className="perfil-anuncio-info">
                              <h4>{anuncio.titulo}</h4>
                              <p>R$ {anuncio.preco} / {anuncio.periodo}</p>
                            </div>

                            <div className="perfil-anuncio-actions">
                              <button className="btn-anuncio-editar" onClick={() => console.log(`Editar anúncio ${anuncio.id}`)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                Editar
                              </button>
                              
                              <button className="btn-anuncio-excluir" onClick={() => console.log(`Excluir anúncio ${anuncio.id}`)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                Excluir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ABA 2: MEUS ALUGUÉIS */}
                {abaAtiva === "alugueis" && <p className="tab-vazia-text">Nenhum aluguel em andamento.</p>}

                {/* ABA 3: FAVORITOS DINÂMICOS */}
                {abaAtiva === "favoritos" && (
                  <div className="perfil-anuncios-section">
                    <h3 className="section-interna-titulo">Itens Salvos</h3>
                    {meusFavoritos.length === 0 ? (
                      <p className="tab-vazia-text">Nenhum item favoritado ainda.</p>
                    ) : (
                      <div className="perfil-anuncios-lista">
                        {meusFavoritos.map((fav) => {
                          const produtoDestino = fav.item ? fav.item : fav;

                          if (!produtoDestino || (!produtoDestino.titulo && !produtoDestino.nome)) return null;

                          return (
                            <div key={fav.id} className="perfil-anuncio-card">
                              <img 
                                src={produtoDestino.imagem || "https://via.placeholder.com/150"} 
                                alt={produtoDestino.titulo || produtoDestino.nome} 
                                className="perfil-anuncio-thumb" 
                              />
                              
                              <div className="perfil-anuncio-info">
                                <h4>{produtoDestino.titulo || produtoDestino.nome}</h4>
                                <p>R$ {produtoDestino.preco} / {produtoDestino.periodo || "dia"}</p>
                              </div>

                              <div className="perfil-anuncio-actions">
                                <button className="btn-favorito-ver" onClick={() => console.log(`Ver item ${produtoDestino.id}`)}>
                                  Ver Item
                                </button>
                                <button 
                                  className="btn-favorito-remover" 
                                  onClick={() => handleRemoverFavorito(fav.id)} 
                                  title="Remover dos favoritos"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" 
                                    fill="#ffa44f" 
                                    stroke="#ffa44f" 
                                    strokeWidth="2"
                                  >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* MODAL MANTIDO IGUAL */}
      {isModalAberto && (
        <div className="modal-overlay">
          <div className="modal-perfil-card">
            <div className="modal-perfil-header">
              <h3>Editar Informações</h3>
              <button className="btn-modal-fechar" onClick={handleFecharModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSalvarPerfil} className="modal-perfil-form">
              <div className="form-item">
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  name="nomeCompleto" 
                  value={formDados.nomeCompleto} 
                  onChange={handleChangeInput} 
                  required
                />
              </div>

              <div className="form-row-duplo">
                <div className="form-item">
                  <label>Cidade</label>
                  <input 
                    type="text" 
                    name="cidade" 
                    value={formDados.cidade} 
                    onChange={handleChangeInput} 
                  />
                </div>
                <div className="form-item input-estado">
                  <label>UF</label>
                  <input 
                    type="text" 
                    name="estado" 
                    maxLength="2"
                    value={formDados.estado} 
                    onChange={handleChangeInput} 
                  />
                </div>
              </div>

              <div className="form-item">
                <label>Biografia</label>
                <textarea 
                  name="biografia" 
                  rows="3" 
                  value={formDados.biografia} 
                  onChange={handleChangeInput}
                />
              </div>

              <div className="modal-perfil-footer">
                <button type="button" className="btn-cancelar-modal" onClick={handleFecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar-modal">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}