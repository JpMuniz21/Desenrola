import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API = "http://localhost:3001/itens";

export default function Home() {
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
        <h1>CRUD de Itens</h1>

        <div className="form-container">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
          />
          <button onClick={adicionar}>Adicionar</button>
        </div>

        <div className="cards">
          {itens.map((item) => (
            <div className="card" key={item.id}>
              <h3>{item.titulo}</h3>
              <p>R$ {item.preco}</p>

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