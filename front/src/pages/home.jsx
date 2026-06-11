import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import "../styles/home.css";

const API = "https://desenrola-backend.onrender.com/itens";
const FAVORITOS_API = "https://desenrola-backend.onrender.com/favoritos";

export default function Home() {
  const [itens, setItens] = useState([]);
  const [meusItens, setMeusItens] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const termoBusca = params.get("busca");
    carregarItens({ busca: termoBusca });
    carregarFavoritos();
    carregarMeusItens();
  }, [location.search]);

  async function carregarItens(filtros = {}) {
    try {
      let url = API;
      const params = new URLSearchParams();
      if (filtros.categoria) params.append("categoriaId", filtros.categoria);
      if (filtros.localizacao) params.append("localizacao", filtros.localizacao);
      if (filtros.busca) params.append("busca", filtros.busca);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      setItens(Array.isArray(data) ? data : []);
    } catch {
      setItens([]);
    }
  }

  async function carregarMeusItens() {
  const userId = localStorage.getItem("userId");
  console.log("userId logado:", userId);
  if (!userId) return;
  try {
    const res = await fetch(`${API}?usuarioId=${userId}`);
    const data = await res.json();
    console.log("meus itens:", data);
    setMeusItens(Array.isArray(data) ? data : []);
  } catch {
    setMeusItens([]);
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
        <Sidebar onFiltrar={(filtros) => carregarItens(filtros)} />
        <main className="feed">

          {/* ITENS EM DESTAQUE */}
          <h1>Itens em destaque</h1>
          <br />
          <div className="feed-grid">
            {itens
  .filter(item => String(item.id_usuario) !== String(localStorage.getItem("userId")))
  .map((item) => (
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
}
          </div>

          {/* MEUS ITENS ANUNCIADOS */}
          {localStorage.getItem("userId") && meusItens.length > 0 && (
  <div style={{ marginTop: "40px" }}>
    <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a2e", marginBottom: "20px" }}>
      Meus itens anunciados
    </h2>
    <div className="feed-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 300px))" }}>
      {meusItens.map((item) => (
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
  isDono={true}
/>
      ))}
    </div>
  </div>
)}

        </main>
      </div>
    </div>
  );
}