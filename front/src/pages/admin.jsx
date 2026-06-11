import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

const API = "https://desenrola-backend.onrender.com";

export default function Admin() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [itens, setItens] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("usuarios");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/");
      return;
    }
    carregarUsuarios();
    carregarItens();
  }, []);

  async function carregarUsuarios() {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/usuarios`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch {
      setUsuarios([]);
    }
  }

  async function carregarItens() {
    try {
      const res = await fetch(`${API}/itens`);
      const data = await res.json();
      setItens(Array.isArray(data) ? data : []);
    } catch {
      setItens([]);
    }
  }

  async function handleExcluirItem(id) {
    const token = localStorage.getItem("token");
    await fetch(`${API}/itens/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    carregarItens();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a1a2e", marginBottom: "24px" }}>
          Painel Administrador
        </h1>

        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <button
            onClick={() => setAbaAtiva("usuarios")}
            style={{ padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", background: abaAtiva === "usuarios" ? "#f97316" : "#e0e0e0", color: abaAtiva === "usuarios" ? "white" : "#333" }}
          >
            Usuários
          </button>
          <button
            onClick={() => setAbaAtiva("itens")}
            style={{ padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", background: abaAtiva === "itens" ? "#f97316" : "#e0e0e0", color: abaAtiva === "itens" ? "white" : "#333" }}
          >
            Itens
          </button>
        </div>

        {abaAtiva === "usuarios" && (
          <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Usuários cadastrados</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ textAlign: "left", padding: "10px", color: "#666" }}>ID</th>
                  <th style={{ textAlign: "left", padding: "10px", color: "#666" }}>Nome</th>
                  <th style={{ textAlign: "left", padding: "10px", color: "#666" }}>Email</th>
                  <th style={{ textAlign: "left", padding: "10px", color: "#666" }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id_usuario} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "10px" }}>{u.id_usuario}</td>
                    <td style={{ padding: "10px" }}>{u.nome}</td>
                    <td style={{ padding: "10px" }}>{u.email}</td>
                    <td style={{ padding: "10px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "20px", background: u.role === "admin" ? "#ffa44f" : "#e0e0e0", fontSize: "12px", fontWeight: "600" }}>
                        {u.role || "user"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {abaAtiva === "itens" && (
          <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Itens cadastrados</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ textAlign: "left", padding: "10px", color: "#666" }}>ID</th>
                  <th style={{ textAlign: "left", padding: "10px", color: "#666" }}>Nome</th>
                  <th style={{ textAlign: "left", padding: "10px", color: "#666" }}>Anunciante</th>
                  <th style={{ textAlign: "left", padding: "10px", color: "#666" }}>Preço</th>
                  <th style={{ textAlign: "left", padding: "10px", color: "#666" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.id_item} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "10px" }}>{item.id_item}</td>
                    <td style={{ padding: "10px" }}>{item.nome}</td>
                    <td style={{ padding: "10px" }}>{item.anunciante}</td>
                    <td style={{ padding: "10px" }}>R$ {item.preco}</td>
                    <td style={{ padding: "10px" }}>
                      <button
                        onClick={() => handleExcluirItem(item.id_item)}
                        style={{ padding: "6px 14px", background: "#e53e3e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}