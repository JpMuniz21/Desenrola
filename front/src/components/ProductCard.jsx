import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/card.css";

export default function ProductCard({ 
  id, 
  titulo, 
  preco, 
  periodo, 
  imagem, 
  isFavoritado = false,         
  onToggleFavorito = () => {},  
  anunciante = "Anunciante",    
  avaliacao = "5.0"             
}) {
  const navigate = useNavigate();

  const handleVerDetalhes = () => {
    navigate(`/produto/${id}`);
  };

  return (
    <div className="card" onClick={handleVerDetalhes} style={{ cursor: "pointer" }}>
      
      <div className="card-image-container" style={{ position: "relative", width: "100%" }}>
        <img src={imagem} alt={titulo} style={{ width: "100%", display: "block" }} />
        
        <button 
          className={`btn-favoritar-floating ${isFavoritado ? "ativo" : ""}`}
          onClick={(e) => {
            e.stopPropagation(); // Evita entrar na tela de detalhes ao favoritar
            onToggleFavorito(id); 
          }}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: "rgba(255, 255, 255, 0.9)",
            border: "none",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 3px 10px rgba(0, 0, 0, 0.18)",
            zIndex: 10,
            transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill={isFavoritado ? "#ffa44f" : "none"} 
            stroke={isFavoritado ? "#ffa44f" : "#4a5568"} 
            strokeWidth="2.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      
      <div className="card-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h3 style={{ margin: 0 }}>{titulo}</h3>
  {avaliacao && (
    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "600", color: "#1a1a2e", flexShrink: 0 }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffa44f" width="13" height="13">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      {avaliacao}
    </span>
  )}
</div>

        {/* 🟢 Fallback para o período se o banco retornar nulo */}
        <p className="price">R$ {preco}/{periodo || "dia"}</p>
        <span style={{ fontSize: "13px", color: "#888" }}>{anunciante}</span>
        
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