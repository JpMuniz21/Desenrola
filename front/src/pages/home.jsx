import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API = "http://localhost:3001/itens";

export default function Home() {
  const [editandoId, setEditandoId] = useState(null);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [itens, setItens] = useState([]);
  const [titulo, setTitulo] = useState("");

  useEffect(() => {
    const logado = localStorage.getItem("logado");
    if (!logado) {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    carregarItens();
  }, []);

  async function editarItem(id) {
  await fetch(`http://localhost:3001/itens/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo: novoTitulo,
    }),
  });

  setEditandoId(null);
  setNovoTitulo("");
  carregarItens();
}

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo,
        preco: 10,
        categoria: "geral",
        status: "disponivel",
        avaliacao: 5,
      }),
    });

    setTitulo("");
    carregarItens();
  }

  async function deletar(id) {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
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
          placeholder="Título"
        />
        <button onClick={adicionar}>Adicionar</button>
      </div>

      {/* READ + UPDATE + DELETE */}
      <div className="cards">
        {itens.map((item) => (
          <div className="card" key={item.id}>
            <h3>{item.titulo}</h3>
            <p>R$ {item.preco}</p>

            {editandoId === item.id ? (
              <>
                <input
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                />

                <button onClick={() => editarItem(item.id)}>
                  Salvar
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setEditandoId(item.id);
                  setNovoTitulo(item.titulo);
                }}
              >
                Editar
              </button>
            )}

            <button onClick={() => deletar(item.id)}>
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  </>
);
}