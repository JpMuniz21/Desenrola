import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import ProductCard from "../components/ProductCard";
import "../styles/favoritos.css";

const FAVORITOS_API = "http://localhost:3001/favoritos";
const ITENS_API = "http://localhost:3001/itens";

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

export default function Favoritos() {
  const navigate = useNavigate();
  const [favoritosIds, setFavoritosIds] = useState([]);
  const [itensFavoritados, setItensFavoritados] = useState([]);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  async function carregarFavoritos() {
    try {
      // Lê do localStorage (mocks)
      const saved = JSON.parse(localStorage.getItem("favoritos") || "[]");

      // Lê do banco (itens reais)
      const res = await fetch(`${FAVORITOS_API}?usuarioId=2`);
      const data = await res.json();
      const idsDB = Array.isArray(data) ? data.map((fav) => fav.id_item) : [];

      // Combina os dois
      const todosIds = [...new Set([...saved.map(String), ...idsDB.map(String)])];
      setFavoritosIds(todosIds);

      // Busca itens do banco
      const resItens = await fetch(ITENS_API);
      const itensDB = await resItens.json();
      const todosItens = [...MOCK_PRODUCTS, ...(Array.isArray(itensDB) ? itensDB : [])];

      // Filtra os favoritados
      const favs = todosItens.filter((item) =>
        todosIds.includes(String(item.id_item))
      );
      setItensFavoritados(favs);
    } catch (err) {
      console.error("Erro:", err);
      const saved = JSON.parse(localStorage.getItem("favoritos") || "[]");
      setFavoritosIds(saved.map(String));
      setItensFavoritados(MOCK_PRODUCTS.filter((p) =>
        saved.map(String).includes(String(p.id_item))
      ));
    }
  }

  async function toggleFavorito(id) {
    const isMock = String(id).startsWith("mock");
    const jaFavoritado = favoritosIds.includes(String(id));

    if (jaFavoritado) {
      setFavoritosIds((prev) => prev.filter((f) => f !== String(id)));
      setItensFavoritados((prev) => prev.filter((item) => String(item.id_item) !== String(id)));

      const saved = JSON.parse(localStorage.getItem("favoritos") || "[]");
      localStorage.setItem("favoritos", JSON.stringify(saved.filter((f) => String(f) !== String(id))));

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
    }
  }

  return (
    <div className="favoritos-page">
      <Navbar />
      <main className="favoritos-container">
        <h2 className="favoritos-titulo">Meus Favoritos</h2>

        {itensFavoritados.length === 0 ? (
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