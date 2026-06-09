import { useState, useEffect } from "react";
import "../styles/sidebar.css";

const CATEGORIAS_API = "http://localhost:3001/categorias";

export default function Sidebar({ onFiltrar }) {
  const [localizacao, setLocalizacao] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetch(CATEGORIAS_API)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategorias(data);
      })
      .catch(() => {
        // fallback com categorias hardcoded
        setCategorias([
          { id_categoria: 1, nome: "Fotografia" },
          { id_categoria: 2, nome: "Vídeo Games" },
        ]);
      });
  }, []);

  function handleAplicar() {
    if (onFiltrar) {
      onFiltrar({ localizacao, categoria: categoriaSelecionada });
    }
  }

  function handleLimpar() {
    setLocalizacao("");
    setCategoriaSelecionada("");
    if (onFiltrar) onFiltrar({ localizacao: "", categoria: "" });
  }

  return (
    <aside className="sidebar">
      <h3>Filtros</h3>

      <input
        type="text"
        placeholder="Localização"
        value={localizacao}
        onChange={(e) => setLocalizacao(e.target.value)}
      />

      <select
        value={categoriaSelecionada}
        onChange={(e) => setCategoriaSelecionada(e.target.value)}
      >
        <option value="">Todas categorias</option>
        {categorias.map((cat) => (
          <option key={cat.id_categoria} value={cat.id_categoria}>
            {cat.nome}
          </option>
        ))}
      </select>

      <button onClick={handleAplicar}>Aplicar filtros</button>
      {(localizacao || categoriaSelecionada) && (
        <button onClick={handleLimpar} style={{ marginTop: "8px", background: "#f0f0f0", color: "#555" }}>
          Limpar filtros
        </button>
      )}
    </aside>
  );
}