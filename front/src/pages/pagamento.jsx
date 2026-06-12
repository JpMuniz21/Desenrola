import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/pagamento.css";
import pixIcon from "../assets/pix.svg";

export default function Pagamento() {
  const location = useLocation();
  const navigate = useNavigate();

  const { produto, dias, total, caucao } = location.state || {
    produto: { nome: "Câmera Canon T5i", preco: 45, tipoLocacao: "dia" },
    dias: 4,
    total: 180,
    caucao: 54,
  };

  const [cartoes, setCartoes] = useState([]);
  const [selecionado, setSelecionado] = useState("pix");
  const [mostrarForm, setMostrarForm] = useState(false);

  // Estados do Formulário de Cartão Realista
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [cpf, setCpf] = useState("");

  const userId = localStorage.getItem("userId");

  // Carrega cartões da base de dados
  useEffect(() => {
    async function carregarCartoes() {
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:3001/usuarios/cartoes/${userId}`);
        if (res.ok) {
          const dados = await res.json();
          setCartoes(dados);
        }
      } catch (error) {
        console.error("Erro ao carregar cartões:", error);
      }
    }
    carregarCartoes();
  }, [userId]);

  // Máscaras de Input
  const maskNumero = (v) => v.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
  const maskValidade = (v) => v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 5);
  const maskCvv = (v) => v.replace(/\D/g, "").slice(0, 4);
  const maskCpf = (v) => v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2").slice(0, 14);

  // POST: Adicionar Cartão
  async function handleAdicionarCartao(e) {
    e.preventDefault();
    if (!nome || numero.length < 19 || validade.length < 5 || cvv.length < 3 || cpf.length < 14) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const ultimosDigitos = numero.slice(-4);
    // Identifica a bandeira de forma simples para fins de UI
    const bandeira = numero.startsWith("4") ? "Visa" : "Mastercard";
    const novoCartaoLabel = `${bandeira} **** ${ultimosDigitos}`;

    const dadosEnvio = {
      id_usuario: userId,
      label: novoCartaoLabel,
      id_metodo: `card_${Date.now()}`
    };

    try {
      const res = await fetch("http://localhost:3001/usuarios/cartoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEnvio)
      });

      if (res.ok) {
        const cartaoSalvo = await res.json();
        setCartoes([...cartoes, cartaoSalvo]);
        setSelecionado(cartaoSalvo.id_metodo);
        
        // Reset do form
        setMostrarForm(false);
        setNome(""); setNumero(""); setValidade(""); setCvv(""); setCpf("");
      }
    } catch (error) {
      console.error("Erro ao salvar cartão:", error);
    }
  }

  // DELETE: Remover Cartão
  async function handleRemoverCartao(e, idMetodo) {
    e.stopPropagation(); // Evita que o clique selecione o cartão
    if (!window.confirm("Tem certeza que deseja remover este cartão?")) return;

    try {
      const res = await fetch(`http://localhost:3001/usuarios/cartoes/${idMetodo}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setCartoes(cartoes.filter(c => c.id_metodo !== idMetodo));
        if (selecionado === idMetodo) setSelecionado("pix");
      }
    } catch (error) {
      console.error("Erro ao remover cartão:", error);
    }
  }

  function handleFinalizarPagamento() {
    navigate("/confirmacao");
  }

  // Estilos inline para o formulário combinar com o pagamento.css
  const inputStyle = {
    width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0", 
    fontSize: "15px", color: "#1a1a2e", outline: "none", marginBottom: "12px", background: "#f8fafc"
  };

  return (
    <div className="pagamento-page">
      <Navbar />
      <div className="pagamento-container">
        <h2 className="pagamento-titulo">Checkout</h2>
        <div className="pagamento-content">
          
          {/* COLUNA ESQUERDA */}
          <div className="pagamento-left">
            <div className="pagamento-card">
              <div className="pagamento-card-header">
                <span className="pagamento-card-titulo">Forma de pagamento</span>
              </div>

              <div className="metodos-lista">
                {/* Opção Pix */}
                <div 
                  className={`metodo-item ${selecionado === "pix" ? "metodo-selecionado" : ""}`}
                  onClick={() => setSelecionado("pix")}
                >
                  <div className={`metodo-radio ${selecionado === "pix" ? "radio-ativo" : ""}`} />
                  <div className="metodo-icon pix">
                    <img src={pixIcon} alt="Pix" width="22" height="22" />
                  </div>
                  <span className="metodo-label">Pix</span>
                </div>

                {/* Lista de Cartões */}
                {cartoes.map((cartao) => (
                  <div 
                    key={cartao.id_metodo} 
                    className={`metodo-item ${selecionado === cartao.id_metodo ? "metodo-selecionado" : ""}`}
                    onClick={() => setSelecionado(cartao.id_metodo)}
                  >
                    <div className={`metodo-radio ${selecionado === cartao.id_metodo ? "radio-ativo" : ""}`} />
                    <div className="metodo-icon visa">💳</div>
                    <span className="metodo-label">{cartao.label}</span>
                    
                    {/* Botão de Apagar Cartão */}
                    <button 
                      onClick={(e) => handleRemoverCartao(e, cartao.id_metodo)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", opacity: 0.6 }}
                      title="Remover Cartão"
                    >
                      🗑️
                    </button>
                  </div>
                ))}

                {/* Trigger Adicionar Cartão */}
                {!mostrarForm && (
                  <button 
                    onClick={() => setMostrarForm(true)}
                    style={{ background: "none", border: "1px dashed #ccc", padding: "16px", borderRadius: "10px", color: "#ffa44f", fontWeight: "600", cursor: "pointer", marginTop: "12px", transition: "0.2s" }}
                  >
                    + Adicionar novo cartão
                  </button>
                )}

                {/* Formulário Realista de Cartão */}
                {mostrarForm && (
                  <form onSubmit={handleAdicionarCartao} style={{ marginTop: "16px", padding: "20px", border: "1px solid #f0f0f0", borderRadius: "12px", background: "#fff" }}>
                    <h4 style={{ marginBottom: "16px", color: "#1a1a2e" }}>Detalhes do Cartão</h4>
                    
                    <input type="text" placeholder="Nome impresso no cartão" value={nome} onChange={(e) => setNome(e.target.value.toUpperCase())} style={inputStyle} required />
                    
                    <input type="text" placeholder="Número do cartão (0000 0000 0000 0000)" value={numero} onChange={(e) => setNumero(maskNumero(e.target.value))} style={inputStyle} required />
                    
                    <div style={{ display: "flex", gap: "12px" }}>
                      <input type="text" placeholder="Validade (MM/AA)" value={validade} onChange={(e) => setValidade(maskValidade(e.target.value))} style={{ ...inputStyle, flex: 1 }} required />
                      <input type="text" placeholder="CVV" value={cvv} onChange={(e) => setCvv(maskCvv(e.target.value))} style={{ ...inputStyle, flex: 1 }} required />
                    </div>

                    <input type="text" placeholder="CPF do titular" value={cpf} onChange={(e) => setCpf(maskCpf(e.target.value))} style={inputStyle} required />

                    <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                      <button type="submit" style={{ flex: 1, background: "#1a1a2e", color: "#fff", border: "none", padding: "14px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}>
                        Salvar Cartão
                      </button>
                      <button type="button" onClick={() => setMostrarForm(false)} style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "none", padding: "14px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <div className="pagamento-right">
            <div className="pagamento-resumo-card">
              <h3 className="resumo-titulo">Resumo do Pedido</h3>
              <p style={{ fontWeight: 600, color: "#1a1a2e", marginBottom: "16px" }}>{produto?.nome}</p>
              
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

            {total > 0 && (
              <div className="pagamento-caucao-card">
                <p className="caucao-titulo">
                  ℹ️ Caução: R$ {caucao?.toFixed(2)}
                </p>
                <p className="caucao-texto">
                  Este valor será retido temporariamente e estornado integralmente após a devolução segura do item.
                </p>
              </div>
            )}

            <button className="btn-continuar" style={{ width: "100%", padding: "16px" }} onClick={handleFinalizarPagamento}>
              Confirmar e Pagar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}