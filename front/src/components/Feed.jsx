import { useState, useEffect } from "react"
import ProductCard from "./ProductCard";

export default function Feed() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroBackend, setErroBackend] = useState(null);

  useEffect(() => {
    fetch("https://desenrola-backend.onrender.com/itens")
      .then((response) => {
        if (!response.ok) {
          // Se der erro 500, cai direto aqui
          throw new Error(`Erro no servidor: Status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Só joga no estado se for uma lista real (Array)
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setErroBackend("O servidor não retornou uma lista válida de produtos.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro capturado no Feed:", error);
        setErroBackend("Não foi possível carregar os itens. Verifique o terminal do seu Backend!");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Carregando itens do banco...</p>;
  }

  // Se o backend deu erro 500, exibe este aviso na tela de forma limpa
  if (erroBackend) {
    return (
      <div style={{ textAlign: "center", color: "red", marginTop: "40px", padding: "20px" }}>
        <h3>⚠️ Erro de Conexão (Status 500)</h3>
        <p>{erroBackend}</p>
        <p style={{ color: "#666", fontSize: "14px" }}>Dica: Olhe o terminal do Node.js para ver o erro do SQL.</p>
      </div>
    );
  }

  return (
    <main className="feed">
      <h1>Itens em destaque</h1>
      <br />
      <div className="feed-grid">
        {products.length > 0 ? (
          products.map((item) => (
  <ProductCard
    key={item.id_item || item.id}
    id={item.id_item || item.id}
    titulo={item.nome || item.titulo || "Item sem título"}
    preco={item.preco}
    periodo={item.periodo}
    imagem={item.imagem || item.image || "https://via.placeholder.com/400x300"}
    anunciante={item.anunciante}
    avaliacao={item.avaliacao}
    isFavoritado={false}
    onToggleFavorito={() => {}}
  />
))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>Nenhum item cadastrado no banco.</p>
        )}
      </div>
    </main>
  );
}
