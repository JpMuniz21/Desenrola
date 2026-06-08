import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import "../styles/produto_detalhes.css";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  
  // 🟢 Novo estado para guardar os recomendados vindos do banco
  const [recomendados, setRecomendados] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      setErro(null);
      try {
        // 1. Busca o produto principal por ID
        const resProduto = await fetch(`http://localhost:3001/itens/${id}`);
        if (!resProduto.ok) {
          throw new Error(`Produto não encontrado (Status: ${resProduto.status})`);
        }
        const dataProd = await resProduto.json();
        const itemUnico = Array.isArray(dataProd) ? dataProd[0] : dataProd;
        setProduto(itemUnico);

        // 2. 🟢 Busca os recomendados direto do Banco passando o ID atual para excluir da lista
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
  }, [id]); // 🔄 O useEffect roda novamente se o ID mudar (quando o usuário clica num recomendado!)

  // Função do RabbitMQ que já configuramos
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

  return (
    <div className="detalhe-page-bg">
      <Navbar />
      <main className="detalhe-main-container">

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
                  <div className="anunciante-avatar">JM</div>
                  <div className="anunciante-info">
                    <span className="anunciante-nome">Anunciante Central</span>
                    <span className="anunciante-sub">Anunciante · desde 2024</span>
                  </div>
                  <div className="anunciante-rating">★ 5.0</div>
                </div>

                <div className="action-buttons-group">
                  <button className="btn-action-chat">Chat</button>
                  <button className="btn-action-alugue" onClick={handleAlugarComNotificacao}>
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
                <span>Junho 2026</span>
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

        {/* 🟢 SEÇÃO DE RECOMENDADOS ATUALIZADA (Lendo as chaves do seu Banco de Dados) */}
        <section className="recomendados-section">
          <h2 className="recomendados-titulo">Produtos em: <em>Fortaleza, Ceará</em></h2>
          <div className="recomendados-lista">
            {recomendados.map((item) => (
              /* Ajustado para mudar a página de detalhes para o item clicado, atualizando o ID na URL */
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