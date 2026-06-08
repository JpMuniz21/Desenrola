import { useState } from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    title: "Câmera Canon T5i",
    price: 45,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
    anunciante: "João Muniz",
    avaliacao: 5.0,
  },
  {
    id: 2,
    title: "PlayStation 5",
    price: 70,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop",
    anunciante: "Lucas Porto",
    avaliacao: 4.6,
  },
  {
    id: 3,
    title: "GoPro Hero 11",
    price: 60,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop",
    anunciante: "Lorena Brilhante",
    avaliacao: 4.8,
  },
];

export default function Feed() {
  const [favoritos, setFavoritos] = useState([]);

  function toggleFavorito(id) {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  return (
    <main className="feed">
      <h1>Itens em destaque</h1>
      <br />
      <div className="feed-grid">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            titulo={item.title}
            preco={item.price}
            periodo="dia"
            imagem={item.image}
            anunciante={item.anunciante}
            avaliacao={item.avaliacao}
            isFavoritado={favoritos.includes(item.id)}
            onToggleFavorito={toggleFavorito}
          />
        ))}
      </div>
    </main>
  );
}