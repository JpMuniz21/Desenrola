import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import ProductCard from "../components/ProductCard";
import "../styles/usuario.css";

const API = "https://desenrola-backend.onrender.com";

export default function PerfilPublico() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [meusAnuncios, setMeusAnuncios] = useState([]);

  useEffect(() => {
    async function carregarPerfil() {
      const token = localStorage.getItem("token");
      try {
        const resPerfil = await fetch(`${API}/usuarios/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (resPerfil.ok) {
          const data = await resPerfil.json();
          setUsuario(Array.isArray(data) ? data[0] : data);
        }

        const resAnuncios = await fetch(`${API}/itens?usuarioId=${id}`);
        if (resAnuncios.ok) setMeusAnuncios(await resAnuncios.json());
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    }
    carregarPerfil();
  }, [id]);

  if (!usuario) return <p style={{ textAlign: "center", marginTop: "50px" }}>Carregando...</p>;

  return (
    <div className="perfil-page">
      <Navbar />
      <main className="perfil-container">

        <button
          onClick={() => navigate(-1)}
          className="btn-voltar-passo"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', fontSize: '15px', fontWeight: '600', cursor: 'pointer', padding: '8px 0', marginBottom: '16px', transition: 'color 0.2s ease', alignSelf: 'flex-start' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#f97316'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Voltar
        </button>

        <div className="perfil-wrapper-card">
          <div className="perfil-header-banner">
  {usuario.foto_capa ? (
    <img src={usuario.foto_capa} alt="Capa" className="perfil-capa-imagem" />
  ) : (
    <div className="perfil-capa-placeholder"></div>
  )}
  <div className="perfil-avatar-container">
    <div className="perfil-avatar-big">
      {usuario.foto_perfil ? (
        <img src={usuario.foto_perfil} alt={usuario.nome} className="perfil-avatar-imagem" />
      ) : (
        usuario.nome?.substring(0, 2).toUpperCase() || "US"
      )}
    </div>
  </div>
</div>

          <div className="perfil-content-grid">
            <div className="perfil-col-left">
              <h2 className="perfil-nome-titulo">{usuario.nome}</h2>
              <div className="perfil-info-group">
              </div>
              <div className="perfil-meta-box">
                <div className="meta-item-badge">
                  <span>Cidade/Estado</span>
                  <div className="meta-badge-text">{usuario.cidade || "Fortaleza"}/{usuario.estado || "CE"}</div>
                </div>
                <div className="meta-item-badge">
                  <span>Biografia</span>
                  <div className="meta-badge-text bio-text">{usuario.biografia || "Nenhuma biografia."}</div>
                </div>
              </div>
            </div>

            <div className="perfil-col-right">
              <div className="perfil-estatisticas-row">
                <div className="estatistica-box"><p>Itens Anunciados</p><h3>{meusAnuncios.length}</h3></div>
                <div className="estatistica-box"><p>Membro desde</p><h3>2026</h3></div>
              </div>

              <h3 style={{ marginTop: "24px", marginBottom: "16px" }}>Itens anunciados</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                {meusAnuncios.length === 0 ? (
                  <p>Nenhum item anunciado.</p>
                ) : (
                  meusAnuncios.map((item) => (
                    <ProductCard
                      key={item.id_item}
                      id={item.id_item}
                      titulo={item.nome}
                      preco={item.preco}
                      periodo={item.periodo}
                      imagem={item.imagem}
                      anunciante={item.anunciante}
                      avaliacao={item.avaliacao}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}