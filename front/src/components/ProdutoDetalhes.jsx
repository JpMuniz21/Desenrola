import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar"; // Ajustado o caminho para a pasta de componentes
import "../styles/produto_detalhes.css";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [recomendados, setRecomendados] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      setErro(null);
      try {
        const resProduto = await fetch(`http://localhost:3001/itens/${id}`);
        if (!resProduto.ok) {
          throw new Error(`Produto não encontrado (Status: ${resProduto.status})`);
        }
        const dataProd = await resProduto.json();
        const itemUnico = Array.isArray(dataProd) ? dataProd[0] : dataProd;
        setProduto(itemUnico);

        const resRec = await fetch(`http://localhost:3001/itens/recomendados/${id}`);
        if (resRec.ok) {
          const dataRec = await resRec.json();
          setRecomendados(dataRec);
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErro("Não foi possível carregar os detalhes deste produto.");
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [id]);

  const handleAlugarComNotificacao = async () => {
    try {
      fetch("http://localhost:3001/aluguel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produtoId: produto.id_item || id,
          nomeProduto: produto.nome,
          preco: produto.preco,
          locatario: "Cliente Logado"
        })
      }).catch(err => console.error("Falha ao enviar dados para a fila:", err));

      navigate(`/aluguel/${id}`, { state: { produto: produto } });
    } catch (err) {
      console.error("Erro no fluxo de aluguel:", err);
    }
  };

  if (loading) {
    return <p style={{ color: "#555", textAlign: "center", marginTop: "50px" }}>Carregando...</p>;
  }

  if (erro) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        <h3>⚠️ Erro</h3>
        <p>{erro}</p>
        <button onClick={() => navigate('/')}>Voltar para o Feed</button>
      </div>
    );
  }

  if (!produto) return null;

  // 💡 Mapeia a ID do vendedor que veio do banco (usando fallbacks para o mock não quebrar)
  const idVendedor = produto.usuarioId || produto.id_anunciante || "2";

  return (
    <div className="detalhe-page-bg">
      <Navbar />
      <main className="detalhe-main-container">

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

        <div className="detalhe-content-wrapper">
          {/* CARD PRINCIPAL */}
          <div className="detalhe-card-principal">
            <div className="detalhe-card-inner">
              <div className="main-image-box">
                <img src={produto.imagem} alt={produto.nome} />
                <button className="nav-arrow left-arrow">‹</button>
                <button className="nav-arrow right-arrow">›</button>
                <div className="image-counter">01 / 01</div>
              </div>

              <div className="detalhe-info-box">
                <span className="badge-disponivel">● Disponível</span>
                <h1 className="produto-titulo">{produto.nome}</h1>
                <h2 className="produto-preco">R$ {produto.preco}/{produto.periodo || "dia"}</h2>
                <p className="produto-descricao">{produto.descricao || "Sem descrição informada para este item."}</p>

                <div className="anunciante-box">
                  <div className="anunciante-avatar">U{idVendedor}</div>
                  <div className="anunciante-info">
                    <span className="anunciante-nome">Usuário {idVendedor}</span>
                    <span className="anunciante-sub">Anunciante · desde 2024</span>
                  </div>
                  <div className="anunciante-rating">★ 5.0</div>
                </div>

                {/* GRUPO DE BOTÕES DE AÇÃO COM MICRO-INTERAÇÕES NO HOVER */}
                <div className="action-buttons-group">
                  {/* 💡 BOTÃO DO CHAT CONECTADO À ID DINÂMICA DO VENDEDOR */}
                  <button 
                    className="btn-action-chat" 
                    onClick={() => navigate("/chat", { 
                      state: { 
                        vendedor: { id: idVendedor, nome: `Usuário ${idVendedor}` } 
                      } 
                    })}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <svg 
                      className="icon-animado"
                      xmlns="http://www.w3.org/2000/svg" 
                      width="22" 
                      height="22" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Chat
                  </button>

                  <button 
                    className="btn-action-alugue" 
                    onClick={handleAlugarComNotificacao}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <svg 
                      className="icon-animado"
                      xmlns="http://www.w3.org/2000/svg" 
                      width="22" 
                      height="22" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                      <polyline points="10 16 12 18 16 14"></polyline>
                    </svg>
                    Alugue!
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CALENDÁRIO E AVALIAÇÕES */}
          <section className="detalhe-right-side">
            <div className="calendar-card">
              <div className="calendar-header">
                <span>Junho {new Date().getFullYear()}</span>
              </div>
              <div className="calendar-days-grid">
                {Array.from({ length: 30 }, (_, i) => (
                  <div key={i + 1} className={`cal-day-item ${i + 1 === 14 || i + 1 === 15 ? 'day-red' : 'day-green'}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="reviews-section">
              <h3 className="reviews-titulo">Avaliações:</h3>
              <div className="reviews-scroll">
                <div className="review-card">
                  <strong>Henrique (★ 5.0)</strong>
                  <p>Equipamento impecável! O dono foi super gente boa.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Lendo as chaves do Banco de Dados */}
        <section className="recomendados-section">
          <h2 className="recomendados-titulo">Produtos em: <em>Fortaleza, Ceará</em></h2>
          <div className="recomendados-lista">
            {recomendados.map((item) => (
              <div key={item.id_item} className="rec-card" onClick={() => navigate(`/produto/${item.id_item}`)}>
                <img src={item.imagem} alt={item.nome} className="rec-img" />
                <div className="rec-info">
                  <div className="rec-header">
                    <span className="rec-nome">{item.nome}</span>
                    <span className="rec-preco">R$ {item.preco}/{item.periodo || "dia"}</span>
                  </div>
                  <p className="rec-descricao">{item.descricao || "Disponível para aluguel imediato."}</p>
                  <div className="rec-badges">
                    <span className="badge-condicao">Boa</span>
                    <span className="badge-disponivel">● Disponível</span>
                  </div>
                </div>
                <button className="rec-favorito" onClick={(e) => e.stopPropagation()}>♡</button>
              </div>
            ))}
            {recomendados.length === 0 && <p>Nenhuma recomendação disponível no momento.</p>}
          </div>
        </section>

      </main>
    </div>
  );
}