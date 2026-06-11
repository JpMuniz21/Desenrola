import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/pagamento.css";
import pixIcon from "../assets/pix.svg";

const metodos = [
  {
    id: "visa",
    label: "Visa **** 222",
    icon: (
      <div className="metodo-icon visa">VISA</div>
    ),
  },
  {
    id: "nubank",
    label: "Nubank **** 333",
    icon: (
      <div className="metodo-icon nubank">nu</div>
    ),
  },
  {
      id: "pix",
      label: "Pix",
      icon: (
        <div className="metodo-icon pix">
          <img src={pixIcon} alt="Pix" width="22" height="22" />
        </div>
      ),
    },
];

export default function Pagamento() {
  const location = useLocation();
  const navigate = useNavigate();

  const { produto, dias, total, caucao } = location.state || {
    produto: { nome: "Câmera Canon T5i", preco: 45, tipoLocacao: "dia" },
    dias: 4,
    total: 180,
    caucao: 54,
  };

  const [selecionado, setSelecionado] = useState(null);

  return (
    <div className="pagamento-page">
      <Navbar />
      <main className="pagamento-container">

        <h2 className="pagamento-titulo">Pagamento</h2>

        <div className="pagamento-content">

          {/* COLUNA ESQUERDA */}
          <div className="pagamento-left">
            <div className="pagamento-card">

              <div className="pagamento-card-header">
                <span className="pagamento-card-titulo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Como você quer pagar:
                </span>
                <span className="pagamento-gratis">Grátis</span>
              </div>

              <div className="metodos-lista">
                {metodos.map((metodo) => (
                  <div
                    key={metodo.id}
                    className={`metodo-item ${selecionado === metodo.id ? "metodo-selecionado" : ""}`}
                    onClick={() => setSelecionado(metodo.id)}
                  >
                    {metodo.icon}
                    <span className="metodo-label">{metodo.label}</span>
                    <div className={`metodo-radio ${selecionado === metodo.id ? "radio-ativo" : ""}`} />
                  </div>
                ))}
              </div>

            </div>

            <div className="pagamento-footer">
              <button
                className="btn-continuar"
                disabled={!selecionado}
                onClick={() => navigate("/confirmacao", { state: { produto, locador: "João Paulo Muniz" } })}
              >
                Continuar
              </button>
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <div className="pagamento-right">

            <div className="pagamento-resumo-card">
              <h3 className="resumo-titulo">Resumo:</h3>
              <div className="resumo-linha">
                <span>Aluguel:</span>
                <span>R$ {produto?.preco || 45}/{produto?.tipoLocacao || "dia"}</span>
              </div>
              <div className="resumo-linha">
                <span>Dias:</span>
                <span>{dias} dias</span>
              </div>
              <div className="resumo-linha">
                <span>Frete:</span>
                <span className="resumo-gratis">Grátis</span>
              </div>
              <div className="resumo-total">
                <span>Total:</span>
                <span>R$ {total?.toFixed(2) || "180.00"}</span>
              </div>
            </div>

            <div className="pagamento-caucao-card">
              <p className="caucao-titulo">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e65100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Caução
              </p>
              <p className="caucao-texto">
                Para garantir a proteção de equipamentos de nicho, solicitamos uma simulação de caução. Este valor assegura que o proprietário seja ressarcido em caso de imprevistos, sendo liberado automaticamente após a conclusão do aluguel.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}