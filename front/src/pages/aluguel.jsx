import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/aluguel.css";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

function gerarDias(ano, mes) {
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  return { primeiroDia, totalDias };
}

const INDISPONIVEIS = [];

export default function Aluguel() {
  const navigate = useNavigate();
  const location = useLocation();

  const produto = location.state?.produto || {
    nome: "Câmera Canon T5i + Lente do Kit 18-55mm",
    preco: 45,
    tipoLocacao: "dia",
    imagem: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&fit=crop",
  };

  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());
  const [inicio, setInicio] = useState(null);
  const [fim, setFim] = useState(null);
  const [datasOcupadas, setDatasOcupadas] = useState([]);
  const nomeMes = new Date(ano, mes).toLocaleString("pt-BR", { month: "long" });
  const nomeMesCapital = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
  const { primeiroDia, totalDias } = gerarDias(ano, mes);

  useEffect(() => {
  const itemId = produto?.id_item;
  if (!itemId) return;
  fetch(`https://desenrola-backend.onrender.com/aluguel/datas/${itemId}`)
    .then(res => res.json())
    .then(data => setDatasOcupadas(Array.isArray(data) ? data : []))
    .catch(() => setDatasOcupadas([]));
}, [produto?.id_item]);


 function handleDiaClick(dia) {
  const data = new Date(ano, mes, dia);
  const hoje = new Date();
  hoje.setHours(0,0,0,0);
  if (data < hoje || INDISPONIVEIS.includes(dia)) return;

  if (!inicio || (inicio && fim)) {
    setInicio(data);
    setFim(null);
  } else if (data.getTime() === inicio.getTime()) {
    setInicio(null);
    setFim(null);
  } else if (data < inicio) {
    setInicio(data);
    setFim(null);
  } else {
    setFim(data);
  }
}

  function getDiaClasse(dia) {
  const data = new Date(ano, mes, dia);
  const hoje = new Date();
  hoje.setHours(0,0,0,0);
  if (data < hoje) return "cal-dia passado";
  if (INDISPONIVEIS.includes(dia)) return "cal-dia indisponivel";
  
  const ocupado = datasOcupadas.some(d => {
    const inicio = new Date(d.data_inicio);
    const fim = new Date(d.data_fim);
    inicio.setHours(0,0,0,0);
    fim.setHours(0,0,0,0);
    return data >= inicio && data <= fim;
  });
  if (ocupado) return "cal-dia indisponivel";
  
  if (inicio && data.getTime() === inicio.getTime()) return "cal-dia selecionado-inicio";
  if (fim && data.getTime() === fim.getTime()) return "cal-dia selecionado-fim";
  if (inicio && fim && data > inicio && data < fim) return "cal-dia no-range";
  return "cal-dia disponivel";
}

  const dias = inicio && fim ? Math.round((fim - inicio) / (1000 * 60 * 60 * 24)) + 1 : 0;
  const diaria = produto.preco;
  const total = dias * diaria;
  const caucao = Math.round(total * 0.3);

  function formatarData(data) {
  if (!data) return "--/--";
  const dia = String(data.getDate()).padStart(2, "0");
  const mesNum = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mesNum}`;
}

  function formatarMoeda(valor) {
    return Number(valor).toFixed(2).replace('.', ',');
  }

  return (
    <div className="aluguel-page">
      <Navbar />
      <main className="aluguel-container">

        {/* BOTÃO DE VOLTAR */}
        <button 
          onClick={() => window.history.state && window.history.state.idx > 0 ? navigate(-1) : navigate("/")}
          className="btn-voltar-passo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '8px 0',
            marginBottom: '16px',
            transition: 'color 0.2s ease',
            gridColumn: '1 / -1', /* Garante que ele ocupe o topo inteiro se for grid */
            alignSelf: 'flex-start'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#f97316'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Voltar
        </button>

        {/* COLUNA ESQUERDA */}
        <div className="aluguel-left">

          {/* CARD DO PRODUTO */}
          <div className="aluguel-produto-card">
            <img src={produto.imagem} alt={produto.nome} className="aluguel-produto-img" />
            <div>
              <p className="aluguel-produto-nome">{produto.nome}</p>
              <p className="aluguel-produto-preco">R$ {formatarMoeda(produto.preco)} {produto.tipoLocacao}</p>
            </div>
          </div>

          {/* CALENDÁRIO */}
          <div className="aluguel-calendario">
            <div className="cal-header">
              <button className="cal-nav" onClick={() => {
                if (mes === 0) { setMes(11); setAno(ano - 1); }
                else setMes(mes - 1);
              }}>
                {/* SVG: Seta Esquerda */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <span>{nomeMesCapital} de {ano}</span>
              
              <button className="cal-nav" onClick={() => {
                if (mes === 11) { setMes(0); setAno(ano + 1); }
                else setMes(mes + 1);
              }}>
                {/* SVG: Seta Direita */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            <div className="cal-grid">
              {DIAS_SEMANA.map((d, i) => (
                <div key={i} className="cal-semana">{d}</div>
              ))}
              {Array.from({ length: primeiroDia }).map((_, i) => (
                <div key={`vazio-${i}`} />
              ))}
              {Array.from({ length: totalDias }, (_, i) => i + 1).map((dia) => (
                <div key={dia} className={getDiaClasse(dia)} onClick={() => handleDiaClick(dia)}>
                  {dia}
                </div>
              ))}
            </div>

            <div className="cal-legenda">
              <div className="legenda-item">
                <svg width="12" height="12" viewBox="0 0 12 12" style={{marginRight: '6px'}}>
                   <circle cx="6" cy="6" r="5" fill="#4caf50" />
                </svg>
                Disponível
              </div>
              <div className="legenda-item">
                <svg width="12" height="12" viewBox="0 0 12 12" style={{marginRight: '6px'}}>
                   <circle cx="6" cy="6" r="5" fill="#f44336" />
                </svg>
                Indisponível
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: RESUMO */}
        <div className="aluguel-resumo-card">
          <h2 className="resumo-titulo">Resumo do aluguel</h2>

          <div className="resumo-datas">
            <div className="resumo-data-box">
              <span className="resumo-data-label">RETIRADA</span>
              <span className="resumo-data-valor">{formatarData(inicio)}</span>
            </div>
            
            <span className="resumo-seta">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>

            <div className="resumo-data-box">
              <span className="resumo-data-label">DEVOLUÇÃO</span>
              <span className="resumo-data-valor">{formatarData(fim)}</span>
            </div>
          </div>

          <div className="resumo-linha">
            <span>Diária</span>
            <span>R$ {formatarMoeda(diaria)}</span>
          </div>
          <div className="resumo-linha">
            <span>Dias</span>
            <span>{dias > 0 ? dias : "--"}</span>
          </div>
          <div className="resumo-linha">
            <span>Frete</span>
            <span className="resumo-gratis">Grátis</span>
          </div>

          <div className="resumo-total">
            <span>Total</span>
            <span>R$ {total > 0 ? formatarMoeda(total) : "--"}</span>
          </div>

          {total > 0 && (
            <div className="resumo-caucao" style={{ 
              backgroundColor: '#fff7ed', 
              border: '1px solid #ffedd5', 
              borderRadius: '12px', 
              padding: '16px',
              marginTop: '16px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '6px'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'block' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                
                <span style={{ fontSize: '15px', color: '#334155', fontWeight: '700', lineHeight: '1' }}>
                  Caução estimado: <span style={{ color: '#f97316' }}>R$ {formatarMoeda(caucao)}</span>
                </span>
              </div>
              
              <p style={{ 
                margin: 0, 
                padding: 0, 
                fontSize: '13px', 
                color: '#64748b', 
                lineHeight: '1.4',
                paddingLeft: '26px'
              }}>
                Valor retido como garantia e liberado automaticamente após a devolução do item.
              </p>
            </div>
          )}
          
          <button
  className="resumo-btn"
  disabled={!inicio || !fim}
  onClick={() => navigate("/confirmar-aluguel", {
    state: {
      produto,
      inicio: formatarData(inicio),
      fim: formatarData(fim),
      inicioISO: inicio ? inicio.toISOString().split('T')[0] : null,
      fimISO: fim ? fim.toISOString().split('T')[0] : null,
      dias,
      total,
      caucao,
    }
  })}
>
  Confirmar aluguel
</button>
        </div>

      </main>
    </div>
  );
}