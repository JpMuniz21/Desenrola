import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import "../styles/home.css";

const API = "http://localhost:3001/itens";
const FAVORITOS_API = "http://localhost:3001/favoritos";

// TODO: Substituir pelo fetch do Supabase
// Ex: const { data: products } = await supabase.from('item').select('*')
const MOCK_PRODUCTS = [
  {
    id_item: "mock-1",
    nome: "Câmera Canon T5i",
    preco: 45,
    periodo: "dia",
    imagem: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
    anunciante: "João Muniz",
    avaliacao: 5.0,
  },
  {
    id_item: "mock-2",
    nome: "PlayStation 5",
    preco: 70,
    periodo: "dia",
    imagem: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop",
    anunciante: "Lucas Porto",
    avaliacao: 4.6,
  },
  {
    id_item: "mock-3",
    nome: "GoPro Hero 11",
    preco: 60,
    periodo: "dia",
    imagem: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop",
    anunciante: "Lorena Brilhante",
    avaliacao: 4.8,
  },
];

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
      // Combina itens do banco com os mocks
      const itensDB = Array.isArray(data) ? data : [];
      setItens([...MOCK_PRODUCTS, ...itensDB]);
    } catch {
      setItens(MOCK_PRODUCTS);
    }
  }

  async function carregarFavoritos() {
  try {
    const saved = JSON.parse(localStorage.getItem("favoritos") || "[]");
    const res = await fetch(`${FAVORITOS_API}?usuarioId=2`);
    const data = await res.json();
    const idsDB = data.map((fav) => fav.id_item);
    // Combina favoritos do banco com os do localStorage (mocks)
    const todos = [...new Set([...saved, ...idsDB])];
    setFavoritosIds(todos);
  } catch (err) {
    console.error("Erro ao carregar favoritos:", err);
    const saved = JSON.parse(localStorage.getItem("favoritos") || "[]");
    setFavoritosIds(saved);
  }
}

 async function handleToggleFavorito(id) {
  const isMock = String(id).startsWith("mock");
  const jaFavoritado = favoritosIds.includes(id);

  // Atualiza localStorage sempre
  const saved = JSON.parse(localStorage.getItem("favoritos") || "[]");

  if (jaFavoritado) {
    setFavoritosIds((prev) => prev.filter((f) => f !== id));
    localStorage.setItem("favoritos", JSON.stringify(saved.filter((f) => f !== id)));

    if (!isMock) {
      try {
        const res = await fetch(`${FAVORITOS_API}?usuarioId=2&itemId=${id}`);
        const relacao = await res.json();
        if (relacao.length > 0) {
          await fetch(`${FAVORITOS_API}/${relacao[0].id_favorito}`, { method: "DELETE" });
        }
      } catch (err) {
        console.error("Erro ao remover favorito:", err);
      }
    }
  } else {
    setFavoritosIds((prev) => [...prev, id]);
    localStorage.setItem("favoritos", JSON.stringify([...saved, id]));

    if (!isMock) {
      try {
        await fetch(FAVORITOS_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuarioId: 2, itemId: id }),
        });
      } catch (err) {
        console.error("Erro ao salvar favorito:", err);
      }
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
            {itens.map((item) => (
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
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}