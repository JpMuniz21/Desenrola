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
    <>
      <Navbar />
      <div className="container">
        {/* CREATE */}
        <div className="form-container">

          <div className="form-container">

  {/* ESQUERDA */}
  <div className="left">
    <input
      value={titulo}
      onChange={(e) => setTitulo(e.target.value)}
      placeholder="Nome do produto"
    />

    <input
      type="number"
      value={preco}
      onChange={(e) => setPreco(e.target.value)}
      placeholder="Preço"
    />
    {/*<input
      value={descricao}
      onChange={(e) => setDescricao(e.target.value)}
      placeholder="Descrição"
    />}*/}

    <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
      <option value="dia">por dia</option>
      <option value="mês">por mês</option>
    </select>

    <button className="btn-cadastro" onClick={adicionar}>
      Adicionar
    </button>
  </div>

  {/* DIREITA */}
  <div className="right">
    <div className="upload">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagem(e.target.files[0])}
      />

      {imagem && (
    <img
      src={URL.createObjectURL(imagem)}
      alt="preview"
      className="preview-img"
    />
  )}
    </div>
  </div>

</div>
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
