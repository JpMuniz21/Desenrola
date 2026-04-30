import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Usuario() {
  const [perfil, setPerfil] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarPerfil() {
      const res = await fetch(`http://localhost:3001/usuarios/${userId}`);
      const data = await res.json();
      setPerfil(data);
    }
    if (userId) carregarPerfil();
  }, [userId]);

  if (!perfil) return <p>Carregando perfil...</p>;

  return (
    <>
      {/* --- Cabeçalho de Navegação --- */}
      <header className="header-desenrola">
        <h1 onClick={() => navigate("/home")} style={{cursor: 'pointer'}}>Desenrola</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate("/home")}>Home</button>
          <button onClick={() => navigate("/usuario")}>Perfil</button>
          <button onClick={() => {
            localStorage.removeItem("userId");
            navigate("/");
          }}>Sair</button>
        </div>
      </header>

      {/* --- Card de Perfil --- */}
      <div className="perfil-container">
        <div className="perfil-card">
          <h2>Meu Perfil</h2>
          <div className="perfil-info">
            <strong>Nome:</strong> {perfil.nome}
          </div>
          <div className="perfil-info">
            <strong>Email:</strong> {perfil.email}
          </div>
          <button className="btn-editar">Editar Perfil</button>
        </div>
      </div>
    </>
  );
}