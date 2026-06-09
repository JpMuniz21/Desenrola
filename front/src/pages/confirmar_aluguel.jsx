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

  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [cepTemp, setCepTemp] = useState("");
  const [ruaTemp, setRuaTemp] = useState("");
  const [numeroTemp, setNumeroTemp] = useState("");
  const [complementoTemp, setComplementoTemp] = useState("");
  const [bairroTemp, setBairroTemp] = useState("");
  const [cidadeTemp, setCidadeTemp] = useState("");
  const [estadoTemp, setEstadoTemp] = useState("");

  function abrirModal() {
    setCepTemp(cep);
    setRuaTemp(endereco.split(",")[0] || "");
    setNumeroTemp("");
    setComplementoTemp("");
    setBairroTemp("");
    setCidadeTemp("");
    setEstadoTemp("CE");
    setModalAberto(true);
  }

  function handleSalvarEndereco(e) {
    e.preventDefault();

    const enderecoCompleto = `${ruaTemp}, ${numeroTemp}${complementoTemp ? ` (${complementoTemp})` : ""}, ${bairroTemp}, ${cidadeTemp} - ${estadoTemp}`;
    
    setEndereco(enderecoCompleto);
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

            {/* ENDEREÇO CRISTALINO */}
<div className="confirmar-card">
  <div className="confirmar-card-header">
    <span className="confirmar-card-titulo">
      {endereco ? (
        // ÍCONE DE CHECK (VERDE)
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ) : (
        // ÍCONE DE LOCALIZAÇÃO (LARANJA DE ALERTA)
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e65100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      )}
      {endereco ? "Enviar nesse endereço" : "Endereço de entrega obrigatório"}
    </span>
    <span className="confirmar-gratis">Grátis</span>
  </div>

  {/* Corpo do endereço com validação visual */}
  <div className="confirmar-endereco" style={{ whiteSpace: "pre-line" }}>
    {endereco ? (
      <p>
        {endereco}{"\n"}<strong>CEP:</strong> {cep}
      </p>
    ) : (
      // ALERTA VISUAL COMPLETO COM ÍCONE DE ATENÇÃO SVG
      <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "14px 0", color: "#e65100" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e65100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span style={{ fontWeight: "500", fontSize: "14px" }}>
          Cadastre o local de recebimento para prosseguir com o aluguel.
        </span>
      </div>
    )}
  </div>

  <button className="btn-alterar-endereco" onClick={abrirModal}>
    {endereco ? "Alterar ou Escolher outro endereço" : "Cadastrar Endereço"}
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
              <button className="btn-continuar" onClick={() => navigate("/pagamento", {state: { produto, dias, total, caucao }})}>
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

      {/* MODAL DE ENDEREÇO REESTRUTURADO COMO UM FORMULÁRIO */}
      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <form className="modal-box" onClick={(e) => e.stopPropagation()} onSubmit={handleSalvarEndereco}>

            <div className="modal-header">
              <h3 className="modal-titulo">Alterar endereço</h3>
              <button type="button" className="modal-fechar" onClick={() => setModalAberto(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-grid">
              <div className="modal-campo modal-campo-full">
                <label>CEP *</label>
                <input type="text" value={cepTemp} onChange={(e) => setCepTemp(e.target.value)} placeholder="60000-000" maxLength={9} required />
              </div>

              <div className="modal-campo modal-campo-full">
                <label>Rua / Avenida *</label>
                <input type="text" value={ruaTemp} onChange={(e) => setRuaTemp(e.target.value)} placeholder="Ex: Rua das Flores" required />
              </div>

              <div className="modal-campo modal-campo-small">
                <label>Número *</label>
                <input type="text" value={numeroTemp} onChange={(e) => setNumeroTemp(e.target.value)} placeholder="Ex: 123" required />
              </div>

              <div className="modal-campo modal-campo-large">
                <label>Complemento</label>
                <input type="text" value={complementoTemp} onChange={(e) => setComplementoTemp(e.target.value)} placeholder="Apto, Bloco... (opcional)" />
              </div>

              <div className="modal-campo modal-campo-full">
                <label>Bairro *</label>
                <input type="text" value={bairroTemp} onChange={(e) => setBairroTemp(e.target.value)} placeholder="Ex: Meireles" required />
              </div>

              <div className="modal-campo modal-campo-large">
                <label>Cidade *</label>
                <input type="text" value={cidadeTemp} onChange={(e) => setCidadeTemp(e.target.value)} placeholder="Ex: Fortaleza" required />
              </div>

              <div className="modal-campo modal-campo-small">
                <label>Estado *</label>
                <select value={estadoTemp} onChange={(e) => setEstadoTemp(e.target.value)} required>
                  <option value="">UF</option>
                  {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-modal-cancelar" onClick={() => setModalAberto(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn-modal-salvar">
                Salvar endereço
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}