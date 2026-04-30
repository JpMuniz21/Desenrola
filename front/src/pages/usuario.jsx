import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Usuario() {
  const [perfil, setPerfil] = useState(null);
  const userId = localStorage.getItem("userId");

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
      <Navbar/> 

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