import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import Feed from "../components/Feed";

import "../styles/home.css";

const API = "http://localhost:3001/itens";

export default function Home() {

  // --- ESTADOS ---
  const [editandoId, setEditandoId] = useState(null);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [novoPeriodo, setNovoPeriodo] = useState("dia");

  const [itens, setItens] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");
  const [periodo, setPeriodo] = useState("dia");
  const [imagem, setImagem] = useState(null);

  // --- useEffect temporário ---
  useEffect(() => {
    carregarItens();
  }, []);

  /*
  // --- useEffect original ---
  useEffect(() => {
    const logado = localStorage.getItem("logado");

    if (!logado) {
      window.location.href = "/";
    }

    carregarItens();
  }, []);
  */

  // --- FUNÇÕES DE LÓGICA ---
  async function carregarItens() {
    try {
      const res = await fetch(API);
      const data = await res.json();

      setItens(Array.isArray(data) ? data : []);
    } catch {
      setItens([]);
    }
  }

  async function adicionar() {

    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("preco", Number(preco) || 10);
    formData.append("periodo", periodo);
    formData.append("categoria", "geral");
    formData.append("status", "disponivel");
    formData.append("avaliacao", 5);

    if (imagem) {
      formData.append("imagem", imagem);
    }

    await fetch(API, {
      method: "POST",
      body: formData,
    });

    setTitulo("");
    setPreco("");
    setPeriodo("dia");
    setImagem(null);

    carregarItens();
  }

  async function editarItem(id) {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: novoTitulo,
        preco: Number(novoPreco),
        periodo: novoPeriodo,
      }),
    });

    setEditandoId(null);
    setNovoTitulo("");
    setNovoPreco("");

    carregarItens();
  }

  async function deletar(id) {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    carregarItens();
  }

  return (
    <div className="home">
      <Navbar />

      <div className="content">
        <Sidebar />

        <Feed />

        {/* Exemplo mostrando os itens */}
        <div className="produtos">
          {itens.map((item) => (
            <ProductCard
              key={item.id}
              titulo={item.titulo}
              preco={item.preco}
              periodo={item.periodo}
              imagem={item.imagem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}