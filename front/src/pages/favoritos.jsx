import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import ProductCard from "../components/ProductCard";
import "../styles/favoritos.css";

const FAVORITOS_API = "http://localhost:3001/favoritos";
const ITENS_API = "http://localhost:3001/itens";

export default function Favoritos() {
  const navigate = useNavigate();
  const [itensFavoritados, setItensFavoritados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFavoritosReais();
  }, []);

  async function carregarFavoritosReais() {
    try {
      setLoading(true);

      const resFav = await fetch(`${FAVORITOS_API}?usuarioId=2`);
      const favoritosDB = await resFav.json();

      if (!Array.isArray(favoritosDB) || favoritosDB.length === 0) {
        setItensFavoritados([]);
        return;
      }

      const resItens = await fetch(ITENS_API);
      const itensDB = await resItens.json();

      if (!Array.isArray(itensDB)) {
        setItensFavoritados([]);
        return;
      }

      const idsFavoritados = favoritosDB.map((fav) => fav.id_item);
      const filtrados = itensDB.filter((item) => idsFavoritados.includes(item.id_item));

      setItensFavoritados(filtrados);
    } catch (err) {
      console.error("Erro ao carregar favoritos reais do Supabase:", err);
      setItensFavoritados([]);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorito(id) {
    try {
      const res = await fetch(`${FAVORITOS_API}?usuarioId=2&itemId=${id}`);
      const relacao = await res.json();

      if (relacao.length > 0) {
        await fetch(`${FAVORITOS_API}/${relacao[0].id_favorito}`, { method: "DELETE" });
        setItensFavoritados((prev) => prev.filter((item) => item.id_item !== id));
      }
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
    }
  }

  return (
    <div className="favoritos-page">
      <Navbar />
      <main className="favoritos-container">
        
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
            width="18" height="18" 
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

        <h2 className="favoritos-titulo">Meus Favoritos</h2>

        {loading ? (
          <p className="loading-text" style={{ textAlign: "center", color: "#666" }}>
            Carregando seus favoritos...
          </p>
        ) : itensFavoritados.length === 0 ? (
          <div className="favoritos-vazio">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <p>Você ainda não favoritou nenhum item.</p>
            <button onClick={() => navigate("/")}>Ver itens</button>
          </div>
        ) : (
          <div className="favoritos-grid">
            {itensFavoritados.map((item) => (
              <ProductCard
                key={item.id_item}
                id={item.id_item}
                titulo={item.nome}
                preco={item.preco}
                periodo={item.periodo}
                imagem={item.imagem}
                anunciante={item.anunciante}
                avaliacao={item.avaliacao}
                isFavoritado={true}
                onToggleFavorito={toggleFavorito}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}