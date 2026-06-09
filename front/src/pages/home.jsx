import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
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
    console.log("anunciante do primeiro item:", data[0]?.anunciante);
    setItens(Array.isArray(data) ? data : []);
  } catch {
    setItens([]);
  }
}

  async function carregarFavoritos() {
    try {
      const userId = localStorage.getItem("userId") || 2;
      const res = await fetch(`${FAVORITOS_API}?usuarioId=${userId}`);
      const data = await res.json();
      const idsDB = Array.isArray(data) ? data.map((fav) => fav.id_item) : [];
      setFavoritosIds(idsDB);
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
      setFavoritosIds([]);
    }
  }

  async function handleToggleFavorito(id) {
    const userId = localStorage.getItem("userId") || 2;
    const jaFavoritado = favoritosIds.includes(id);

    if (jaFavoritado) {
      try {
        const res = await fetch(`${FAVORITOS_API}?usuarioId=${userId}&itemId=${id}`);
        const relacao = await res.json();
        if (relacao.length > 0) {
          await fetch(`${FAVORITOS_API}/${relacao[0].id_favorito}`, { method: "DELETE" });
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
          body: JSON.stringify({ usuarioId: userId, itemId: id }),
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
        <main className="feed">
          <h1>Itens em destaque</h1>
          <br />
          <div className="feed-grid">
            {itens.length === 0 ? (
              <p>Nenhum item disponível no momento.</p>
            ) : (
              itens.map((item) => (
                <ProductCard
                  key={item.id_item}
                  id={item.id_item}
                  titulo={item.nome}
                  preco={item.preco}
                  periodo={item.periodo}
                  imagem={item.imagem}
                  anunciante={item.anunciante}
                  avaliacao={item.avaliacao}
                  isFavoritado={favoritosIds.includes(item.id_item)}
                  onToggleFavorito={handleToggleFavorito}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}