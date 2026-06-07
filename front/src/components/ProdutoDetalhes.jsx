import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import "../styles/produto_detalhes.css";

const recomendados = [
  {
    id: 101,
    nome: "Camera CyberShot HF2006",
    preco: "30",
    tipoLocacao: "dia",
    descricao: "Câmera Cybershot HF2006 é uma câmera digital superzoom de estilo ponte, conhecida por seu design robusto.",
    imagem: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&fit=crop",
    anunciante: "João Paulo",
    avatar: "JP",
    avaliacao: 5.0,
    condicao: "Perfeita 97%",
    disponivel: true,
  },
  {
    id: 102,
    nome: "Metal Gear Solid 4 (PS3)",
    preco: "10",
    tipoLocacao: "dia",
    descricao: "Metal Gear Solid 4: Guns of the Patriots para PS3, disco em ótimo estado apenas com arranhões leves.",
    imagem: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&fit=crop",
    anunciante: "Lucas Porto",
    avatar: "LP",
    avaliacao: 4.6,
    condicao: "Ótima 89%",
    disponivel: false,
  },
  {
    id: 103,
    nome: "Kindle 16gb",
    preco: "20",
    tipoLocacao: "dia",
    descricao: "Kindle com 16gb de armazenamento, tela antirreflexo, bateria de longa duração. Perfeito para leitura.",
    imagem: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&fit=crop",
    anunciante: "Lorena Brilhante",
    avatar: "LB",
    avaliacao: 4.6,
    condicao: "Ótima 89%",
    disponivel: false,
  },
];

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProduto() {
      try {
        const res = await fetch(`http://localhost:3001/produtos/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduto(data);
        }
      } catch (error) {
        console.error("Erro ao conectar com o banco, usando mock local:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarProduto();
  }, [id]);

  if (loading) {
    return <p style={{ color: "#555", textAlign: "center", marginTop: "50px" }}>Carregando...</p>;
  }

  const itemExibido = produto || {
    nome: "Câmera Canon T5i + Lente do Kit 18-55mm",
    preco: "45.00",
    tipoLocacao: "dia",
    descricao: "Câmera DSLR Canon EOS Rebel T5i em excelente estado de conservação, ideal para gravação de vídeos, ensaios fotográficos e eventos. Acompanha lente 18-55mm f/3.5-5.6 IS STM com autofoco rápido e silencioso. Tela LCD articulada e sensível ao toque. Inclui 1 bateria, carregador original e alça de pescoço.",
    imagem: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=60",
    indisponivelAte: null
  };

  return (
    <div className="detalhe-page-bg">
      <Navbar />
      <main className="detalhe-main-container">

        {/* TOPO: CARD PRINCIPAL + COLUNA DIREITA */}
        <div className="detalhe-content-wrapper">

          {/* CARD PRINCIPAL UNIFICADO */}
          <div className="detalhe-card-principal">
            <div className="detalhe-card-inner">

              {/* IMAGEM À ESQUERDA */}
              <div className="main-image-box">
                <img
                  src={produto ? `http://localhost:3001/uploads/${itemExibido.imagem}` : itemExibido.imagem}
                  alt={itemExibido.nome}
                />
                <button className="nav-arrow left-arrow">‹</button>
                <button className="nav-arrow right-arrow">›</button>
                <div className="image-counter">01 / 03</div>
              </div>

              {/* INFOS À DIREITA */}
              <div className="detalhe-info-box">
                {itemExibido.indisponivelAte ? (
                  <span className="badge-indisponivel">Indisponível até {itemExibido.indisponivelAte}</span>
                ) : (
                  <span className="badge-disponivel">● Disponível</span>
                )}

                <h1 className="produto-titulo">{itemExibido.nome}</h1>
                <h2 className="produto-preco">R$ {itemExibido.preco}/{itemExibido.tipoLocacao}</h2>
                <p className="produto-descricao">{itemExibido.descricao}</p>

                <div className="anunciante-box">
                  <div className="anunciante-avatar">JM</div>
                  <div className="anunciante-info">
                    <span className="anunciante-nome">João Muniz</span>
                    <span className="anunciante-sub">Anunciante · desde 2024</span>
                  </div>
                  <div className="anunciante-rating">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF9F45" width="14" height="14">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    5.0
                  </div>
                </div>

                <div className="action-buttons-group">
                  <button className="btn-action-chat">
                    <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Chat
                  </button>
                  <button className="btn-action-alugue">
                    <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Alugue!
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: CALENDÁRIO E AVALIAÇÕES */}
          <section className="detalhe-right-side">
            <div className="calendar-card">
              <div className="calendar-header">
                <button className="cal-arrow">‹</button>
                <span>Junho 2026</span>
                <button className="cal-arrow">›</button>
              </div>
              <div className="calendar-days-grid">
                {Array.from({ length: 30 }, (_, i) => (
                  <div key={i + 1} className={`cal-day-item ${i + 1 === 14 || i + 1 === 15 ? 'day-red' : 'day-green'}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="calendar-legend">
                <div className="legend-item"><span className="dot green"></span> Disponível</div>
                <div className="legend-item"><span className="dot red"></span> Indisponível</div>
              </div>
            </div>

           <div className="reviews-section">
  <h3 className="reviews-titulo">Avaliações:</h3>
  <div className="reviews-scroll">
    {[
      { nome: "Henrique", nota: 5.0, avatar: "H", texto: "Equipamento impecável! O João foi super gente boa, a lente veio limpa e a bateria durou o evento inteiro. Recomendo demais!" },
      { nome: "Henrique", nota: 5.0, avatar: "H", texto: "Equipamento impecável! O João foi super gente boa, a lente veio limpa e a bateria durou o evento inteiro. Recomendo demais!" },
      { nome: "Henrique", nota: 5.0, avatar: "H", texto: "Equipamento impecável! O João foi super gente boa, a lente veio limpa e a bateria durou o evento inteiro. Recomendo demais!" },
    ].map((review, i) => (
      <div key={i} className="review-card">
        <div className="review-header">
          <div className="review-user">
            <div className="review-avatar">{review.avatar}</div>
            <strong>{review.nome}</strong>
          </div>
          <span className="stars-wrapper">
            {review.nota}
            <svg className="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF9F45" stroke="#FF9F45" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </span>
        </div>
        <p>{review.texto}</p>
      </div>
    ))}
  </div>
</div>
</section>
</div>

        {/* SEÇÃO DE RECOMENDADOS */}
        <section className="recomendados-section">
          <h2 className="recomendados-titulo">Produtos em: <em>Fortaleza, Ceará</em></h2>

          <div className="recomendados-lista">
            {recomendados.map((item) => (
              <div key={item.id} className="rec-card" onClick={() => navigate(`/produto/${item.id}`)}>

                <img src={item.imagem} alt={item.nome} className="rec-img" />

                <div className="rec-info">
                  <div className="rec-header">
                    <span className="rec-nome">{item.nome}</span>
                    <span className="rec-preco">{item.preco}R$/Dia</span>
                    <div className="rec-anunciante">
                      <span>{item.anunciante}</span>
                      <div className="rec-avatar">{item.avatar}</div>
                    </div>
                    <span className="rec-avaliacao">
                      {item.avaliacao}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF9F45" width="12" height="12">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </span>
                  </div>

                  <p className="rec-descricao">{item.descricao}</p>

                  <div className="rec-badges">
                    <span className="badge-condicao">{item.condicao}</span>
                    <span className={item.disponivel ? "badge-disponivel" : "badge-indisponivel"}>
                      {item.disponivel ? "Disponível" : "Indisponível"}
                    </span>
                    <span className="badge-avaliacao">
                      {item.avaliacao} ★
                    </span>
                  </div>
                </div>

                <button className="rec-favorito">♡</button>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}