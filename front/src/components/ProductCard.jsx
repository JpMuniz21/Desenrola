import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Importa o hook de navegação
import "../styles/card.css"; // Seu CSS atual do card

export default function ProductCard({ id, titulo, preco, periodo, imagem }) {
  const navigate = useNavigate();

  const handleVerDetalhes = () => {
    navigate(`/produto/${id}`);
  };

  return (
  <div className="card" onClick={handleVerDetalhes} style={{ cursor: "pointer" }}>
    <img src={imagem} alt={titulo} />
    
    <div className="card-body">
      <h3>{titulo}</h3>
      <p className="price">R$ {preco}/{periodo}</p>
      
      <button onClick={(e) => {
        e.stopPropagation();
        handleVerDetalhes();
      }}>
        Alugar agora
      </button>
    </div>
  </div>
);
}