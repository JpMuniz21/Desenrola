import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/confirmacao.css";

export default function Confirmacao() {
  const location = useLocation();
  const navigate = useNavigate();

  const { produto, locador } = location.state || {
    produto: { nome: "Câmera Canon T5i" },
    locador: "João Paulo Muniz",
  };

  return (
    <div className="confirmacao-page">
      <Navbar />
      <main className="confirmacao-container">
        <div className="confirmacao-card">
          
          {/* HEADER DE SUCESSO */}
          <div className="success-hero">
            <div className="success-icon-circle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1 className="success-title">Pagamento confirmado! 🎉</h1>
          </div>

          {/* MENSAGEM DINÂMICA */}
          <div className="success-content">
            <p>
              Você desenrolou um pedido e o seu aluguel está <strong>validado!</strong>
            </p>
            <p className="instrucao-texto">
              Agora é só esperar o <strong>{locador}</strong> enviar o 
              <span> {produto.nome} </span> 
              pelo método de entrega escolhido e aproveitar!
            </p>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="confirmacao-actions">
            <button className="btn-chat-vendedor">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Chat com o vendedor
            </button>
            
            <button className="btn-voltar-home" onClick={() => navigate("/")}>
              Voltar
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}