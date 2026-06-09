import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import Feed from "../components/Feed"; 
import "../styles/home.css";

const API = "http://localhost:3001/itens";
const FAVORITOS_API = "http://localhost:3001/favoritos";

export default function Home() {
  const [itens, setItens] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState([]);

  useEffect(() => {
    carregarItens();
    carregarFavoritos();
  }, []);

  async function carregarItens() {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setItens(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar itens da API:", err);
      setItens([]);
    }
  }

  async function carregarFavoritos() {
    try {
      const res = await fetch(`${FAVORITOS_API}?usuarioId=2`);
      const data = await res.json();
      const idsDB = data.map((fav) => fav.id_item);
      setFavoritosIds(idsDB);
    } catch (err) {
      console.error("Erro ao carregar favoritos do banco:", err);
      setFavoritosIds([]);
    }
  }

  async function handleToggleFavorito(id) {
    const jaFavoritado = favoritosIds.includes(id);

    if (jaFavoritado) {
      try {
        const res = await fetch(`${FAVORITOS_API}?usuarioId=2&itemId=${id}`);
        const relacao = await res.json();
        
        if (relacao.length > 0) {
          await fetch(`${FAVORITOS_API}/${relacao[0].id_favorito}`, { 
            method: "DELETE" 
          });
          setFavoritosIds((prev) => prev.filter((f) => f !== id));
        }
      } catch (err) {
        console.error("Erro ao remover favorito:", err);
      }
    } else {
      try {
        await fetch(FAVORITOS_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuarioId: 2, itemId: id }),
        });
        setFavoritosIds((prev) => [...prev, id]);
      } catch (err) {
        console.error("Erro ao salvar favorito:", err);
      }
    }
  }

  return (
    <div className="home">
      <Navbar />
      <div className="content">
        <Sidebar />
        
        <div className="main-feed-container">
          <Feed /> 
          <div className="produtos">
            {itens.length === 0 ? (
              <p className="feed-vazio-text">Nenhum item disponível para aluguel no momento.</p>
            ) : (
              itens.map((item) => {
                const favoritado = favoritosIds.includes(item.id_item);

                return (
                  <ProductCard
                    key={item.id_item}
                    id={item.id_item}
                    titulo={item.nome} 
                    preco={item.preco}
                    periodo={item.periodo}
                    imagem={item.imagem}
                    anunciante={item.anunciante}
                    avaliacao={item.avaliacao}
                    isFavoritado={favoritado}
                    onToggleFavorito={handleToggleFavorito}
                  />
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}