import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Usuario() {
  const [perfil, setPerfil] = useState(null);

  // INJETADO: O estado agora já nasce com o item do balão para teste imediato!
  const [meusItens, setMeusItens] = useState([
    {
      id: "teste-balao-123",
      nome: "Balão de Festa Laranja",
      preco: "15.00",
      tipoLocacao: "dia",
      descricao: "Um balão decorativo perfeito para festas temáticas.",
      imagem:
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&auto=format&fit=crop&q=60", // Foto temporária online
    },
  ]);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDados() {
      try {
        // Carrega dados do perfil
        const resPerfil = await fetch(
          `http://localhost:3001/usuarios/${userId}`,
        );
        const dataPerfil = await resPerfil.json();
        setPerfil(dataPerfil);

        // Carrega os itens do banco e junta com o item de teste
        const resItens = await fetch(
          `http://localhost:3001/produtos/usuario/${userId}`,
        );
        if (resItens.ok) {
          const dataItens = await resItens.json();
          if (dataItens.length > 0) {
            setMeusItens((prev) => [...prev, ...dataItens]); // Junta os dois
          }
        }
      } catch (error) {
        console.error(
          "Erro ao carregar dados do banco, usando itens locais:",
          error,
        );
        // Se o back cair, fingimos um perfil para você não travar a tela
        if (!perfil) {
          setPerfil({ nome: "João Paulo", email: "joao@unifor.br" });
        }
      }
    }
    carregarDados();
  }, [userId]);

  // FUNÇÃO PARA DELETAR ITEM (Funciona localmente e no banco)
  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esse anúncio? 🗑️")) {
      // Se for o item de teste, remove direto do estado do React
      if (id === "teste-balao-123") {
        setMeusItens(meusItens.filter((item) => item.id !== id));
        alert("Item de teste removido com sucesso localmente!");
        return;
      }

      // Se for item do banco, faz o processo real
      try {
        const res = await fetch(`http://localhost:3001/produtos/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          alert("Item removido do banco de dados!");
          setMeusItens(meusItens.filter((item) => item.id !== id));
        }
      } catch (error) {
        alert("Erro ao excluir item no servidor, removendo localmente.");
        setMeusItens(meusItens.filter((item) => item.id !== id));
      }
    }
  };

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  if (!perfil)
    return (
      <p style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Carregando...
      </p>
    );

  return (
    <>
      <Navbar />
      <div className="perfil-container" style={{ paddingBottom: "50px" }}>
        {/* CARD DE PERFIL */}
        <div className="perfil-card">
          <h2>Meu Perfil</h2>
          <div className="info-grupo">
            <strong>Nome:</strong> {perfil.nome}
          </div>
          <div className="info-grupo">
            <strong>Email:</strong> {perfil.email}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button className="btn-editar-perfil">Editar Perfil</button>
            <button onClick={handleLogout} className="btn-profile-logout">
              Sair da Conta
            </button>
          </div>
        </div>

        {/* SEÇÃO DE MEUS ANÚNCIOS (CRUD) */}
        <div
          className="meus-anuncios-section"
          style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}
        >
          {/* TÍTULO ATUALIZADO: Corrigido para o azul escuro da identidade */}
          <h3
            style={{
              color: "#15213F",
              marginBottom: "20px",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            Meus Itens para Aluguel
          </h3>

          <div className="itens-grid" style={{ display: "grid", gap: "15px" }}>
            {meusItens.map((item) => (
              <div
                key={item.id}
                className="item-card-mini"
                style={{
                  backgroundColor: "#FFF",
                  padding: "15px",
                  borderRadius: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{ display: "flex", gap: "15px", alignItems: "center" }}
                >
                  <img
                    src={
                      item.id === "teste-balao-123"
                        ? item.imagem
                        : `http://localhost:3001/uploads/${item.imagem}`
                    }
                    alt={item.nome}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <h4 style={{ margin: 0, color: "#333", fontSize: "16px" }}>
                      {item.nome}
                    </h4>
                    <span style={{ color: "#FF9F45", fontWeight: "bold" }}>
                      R$ {item.preco} /{" "}
                      {item.tipoLocacao === "dia" ? "Dia" : "Mês"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Botão Editar com Feedback Visual */}
                  <button
                    onClick={() => navigate(`/anunciar?edit=${item.id}`)}
                    style={{
                      backgroundColor: "#E9ECEF",
                      color: "#495057",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#DEE2E6"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#E9ECEF"}
                  >
                    ✏️ Editar
                  </button>

                  {/* Botão Excluir com Feedback Visual Invertido */}
                  <button
                    onClick={() => handleExcluir(item.id)}
                    style={{
                      backgroundColor: "#FFDCE0",
                      color: "#D9534F",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#D9534F";
                      e.target.style.color = "#FFF";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#FFDCE0";
                      e.target.style.color = "#D9534F";
                    }}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}