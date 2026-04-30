import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

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

  // --- EFEITOS ---
  useEffect(() => {
    const logado = localStorage.getItem("logado");
    if (!logado) {
      window.location.href = "/";
    }
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
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        preco: Number(preco) || 10,
        periodo,
        categoria: "geral",
        status: "disponivel",
        avaliacao: 5,
      }),
    });
    setTitulo("");
    setPreco("");
    setPeriodo("dia");
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
    <>
      <Navbar />
      <div className="container">
        {/* CREATE */}
        <div className="form-container">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="O que você quer anunciar?"
          />
          {/* Resto do código (preço, select, etc) */}
          <input
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Preço"
          />
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            <option value="dia">por dia</option>
            <option value="mês">por mês</option>
          </select>
          <button className="btn-cadastro" onClick={adicionar}>Adicionar</button>
        </div>

        {/* READ + UPDATE + DELETE */}
        {itens.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>
            Nenhum item anunciado em Fortaleza ainda.
          </p>
        ) : (
          <div className="cards">
            {itens.map((item) => (
              <div className="card" key={item.id}>
                <h3>{item.titulo}</h3>
                <p>
                  R$ {item.preco} / {item.periodo || "dia"}
                </p>

                {editandoId === item.id ? (
                  <div className="edit-box">
                    <input
                      value={novoTitulo}
                      onChange={(e) => setNovoTitulo(e.target.value)}
                    />
                    <input
                      type="number"
                      value={novoPreco}
                      onChange={(e) => setNovoPreco(e.target.value)}
                    />
                    <select
                      value={novoPeriodo}
                      onChange={(e) => setNovoPeriodo(e.target.value)}
                    >
                      <option value="dia">por dia</option>
                      <option value="mês">por mês</option>
                    </select>
                    <button onClick={() => editarItem(item.id)}>Salvar</button>
                    <button onClick={() => setEditandoId(null)}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="actions">
                    <button
                      onClick={() => {
                        setEditandoId(item.id);
                        setNovoTitulo(item.titulo);
                        setNovoPreco(item.preco);
                        setNovoPeriodo(item.periodo || "dia");
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => deletar(item.id)}>Excluir</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
