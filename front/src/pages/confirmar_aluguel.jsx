import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/confirmar_aluguel.css";

export default function ConfirmarAluguel() {
  const location = useLocation();
  const navigate = useNavigate();

  const { produto, inicio, fim, dias, total, caucao } = location.state || {
    produto: { nome: "Câmera Canon T5i", preco: 45, tipoLocacao: "dia" },
    inicio: "16/06",
    fim: "20/06",
    dias: 4,
    total: 180,
    caucao: 54,
  };

  const [endereco, setEndereco] = useState("Rua dos Campos, 123, Fortaleza, Ceará");
  const [cep, setCep] = useState("60192-000");
  const [modalAberto, setModalAberto] = useState(false);
  const [enderecoTemp, setEnderecoTemp] = useState(endereco);
  const [cepTemp, setCepTemp] = useState(cep);

  function abrirModal() {
    setEnderecoTemp(endereco);
    setCepTemp(cep);
    setModalAberto(true);
  }

  function salvarEndereco() {
    setEndereco(enderecoTemp);
    setCep(cepTemp);
    setModalAberto(false);
  }

  return (
    <div className="confirmar-page">
      <Navbar />
      <main className="confirmar-container">

        <h2 className="confirmar-titulo">Confira a forma de entrega:</h2>

        <div className="confirmar-content">

          {/* COLUNA ESQUERDA */}
          <div className="confirmar-left">

            {/* ENDEREÇO */}
            <div className="confirmar-card">
              <div className="confirmar-card-header">
                <span className="confirmar-card-titulo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Enviar nesse endereço
                </span>
                <span className="confirmar-gratis">Grátis</span>
              </div>

              <p className="confirmar-endereco">{endereco}{"\n"}CEP - {cep}</p>

              <button className="btn-alterar-endereco" onClick={abrirModal}>
                Alterar ou Escolher outro endereço
              </button>
            </div>

            {/* ESTIMATIVA */}
            <div className="confirmar-card">
              <p className="confirmar-estimativa-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Estimativa de chegada no endereço
              </p>
              <p className="confirmar-estimativa-valor">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                3 dias úteis
              </p>
            </div>

            {/* BOTÃO CONTINUAR */}
            <div className="confirmar-footer">
              <button className="btn-continuar"onClick={() => navigate("/pagamento", {state: { produto, dias, total, caucao }})}>
                Continuar
              </button>
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <div className="confirmar-right">
            <div className="confirmar-resumo-card">
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
              <div className="resumo-linha">
                <span>Caução:</span>
                <span>R$ {caucao?.toFixed(2) || "54.00"}</span>
              </div>
              <div className="resumo-total">
                <span>Total:</span>
                <span>R$ {total?.toFixed(2) || "180.00"}</span>
              </div>
            </div>

            <div className="confirmar-caucao-card">
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

      {/* MODAL DE ENDEREÇO */}
{modalAberto && (
  <div className="modal-overlay" onClick={() => setModalAberto(false)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>

      <div className="modal-header">
        <h3 className="modal-titulo">Alterar endereço</h3>
        <button className="modal-fechar" onClick={() => setModalAberto(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="modal-grid">
        <div className="modal-campo modal-campo-full">
          <label>CEP</label>
          <input type="text" value={cepTemp} onChange={(e) => setCepTemp(e.target.value)} placeholder="00000-000" maxLength={9} />
        </div>

        <div className="modal-campo modal-campo-full">
          <label>Rua / Avenida</label>
          <input type="text" value={enderecoTemp} onChange={(e) => setEnderecoTemp(e.target.value)} placeholder="Ex: Rua das Flores" />
        </div>

        <div className="modal-campo modal-campo-small">
          <label>Número</label>
          <input type="text" placeholder="Ex: 123" />
        </div>

        <div className="modal-campo modal-campo-large">
          <label>Complemento</label>
          <input type="text" placeholder="Apto, Bloco... (opcional)" />
        </div>

        <div className="modal-campo modal-campo-full">
          <label>Bairro</label>
          <input type="text" placeholder="Ex: Meireles" />
        </div>

        <div className="modal-campo modal-campo-large">
          <label>Cidade</label>
          <input type="text" placeholder="Ex: Fortaleza" />
        </div>

        <div className="modal-campo modal-campo-small">
          <label>Estado</label>
          <select>
            <option value="">UF</option>
            {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn-modal-cancelar" onClick={() => setModalAberto(false)}>
          Cancelar
        </button>
        <button className="btn-modal-salvar" onClick={salvarEndereco}>
          Salvar endereço
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}