import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../imagem/logo.png";

export default function Usuario() {
  const [perfil, setPerfil] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const res = await fetch(`http://localhost:3001/usuarios/${userId}`);
        const data = await res.json();
        setPerfil(data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    }
    if (userId) carregarPerfil();
  }, [userId]);

  if (!perfil) return <p style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Carregando perfil...</p>;

  return (
    <>
      {/* --- Cabeçalho de Navegação --- */}
      <header className="header-desenrola">
        <img
          src={logo}
          alt="Logo Desenrola"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer", height: "50px", width: "auto" }}
        />

        <div className="nav-buttons">
          <button onClick={() => navigate("/home")}>Home</button>
          <button onClick={() => navigate("/usuario")}>Perfil</button>
          <button
            onClick={() => {
              localStorage.removeItem("userId");
              localStorage.removeItem("logado");
              navigate("/");
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* --- Card de Perfil (Extreme Makeover) --- */}
      <div className="perfil-container">
        <div className="perfil-card">
          <h2>Meu Perfil</h2>
          
          <div className="info-grupo">
            <strong>Nome:</strong> {perfil.nome}
          </div>
          
          <div className="info-grupo">
            <strong>Email:</strong> {perfil.email}
          </div>

          <button className="btn-editar-perfil">
            Editar Perfil
          </button>
        </div>
      </div>
    </>
  );
}