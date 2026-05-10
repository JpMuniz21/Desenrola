import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import Feed from "../components/Feed";

import "../styles/home.css";

const API = "http://localhost:3001/itens";

export default function Home() {
  // --- ESTADOS (Devem ficar sempre aqui no topo) ---
  const [editandoId, setEditandoId] = useState(null);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [novoPeriodo, setNovoPeriodo] = useState("dia");
  const [itens, setItens] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");
  const [periodo, setPeriodo] = useState("dia");
  const [imagem, setImagem] = useState(null);

  // --- desativei temporariamente ---
 {/* useEffect(() => {
    const logado = localStorage.getItem("logado");
    if (!logado) {
      window.location.href = "/";
    }
    carregarItens();
  }, []);*/}

  // quando o de cima voltar,apagar o useEffect abaixo
    useEffect(() => {
  carregarItens();
}, []);

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

    if(imagem) {
      formData.append("imagem", imagem);
    }
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: formData
      }),

    setTitulo("");
    setPreco("");
    setPeriodo("dia");
    setImagem(null);
    carregarItens();
  }

  async function editarItem(id) {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
    await fetch(`${API}/${id}`, { method: "DELETE" });
    carregarItens();
  }

  return (
    <div className="home">
      <Navbar />

      <div className="content">
        <Sidebar />
        <Feed />
      </div>
    </div>
  );
}
