import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/aluguel.css";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

function gerarDias(ano, mes) {
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  return { primeiroDia, totalDias };
}

const INDISPONIVEIS = [14, 15];

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

  const { primeiroDia, totalDias } = gerarDias(ano, mes);

  const nomeMes = new Date(ano, mes).toLocaleString("pt-BR", { month: "long" });
  const nomeMesCapital = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

  function handleDiaClick(dia) {
    if (INDISPONIVEIS.includes(dia)) return;

    if (!inicio || (inicio && fim)) {
      setInicio(dia);
      setFim(null);
    } else if (dia === inicio) {
      setInicio(null);
      setFim(null);
    } else if (dia < inicio) {
      setInicio(dia);
      setFim(null);
    } else {
      setFim(dia);
    }
  }

  function getDiaClasse(dia) {
    if (INDISPONIVEIS.includes(dia)) return "cal-dia indisponivel";
    if (inicio && dia === inicio) return "cal-dia selecionado-inicio";
    if (fim && dia === fim) return "cal-dia selecionado-fim";
    if (inicio && fim && dia > inicio && dia < fim) return "cal-dia no-range";
    return "cal-dia disponivel";
  }

  const dias = inicio && fim ? fim - inicio + 1 : 0;
  const diaria = produto.preco;
  const total = dias * diaria;
  const caucao = Math.round(total * 0.3);

  function formatarData(dia) {
    if (!dia) return "--/--";
    return `${String(dia).padStart(2, "0")}/${String(mes + 1).padStart(2, "0")}`;
  }

  // NOVA FUNÇÃO: Garante que o valor fica sempre no formato correto (ex: 25,00)
  function formatarMoeda(valor) {
    return Number(valor).toFixed(2).replace('.', ',');
  }

  return (
    <div className="aluguel-page">
      <Navbar />
      <main className="aluguel-container">

        {/* COLUNA ESQUERDA */}
        <div className="aluguel-left">

          {/* CARD DO PRODUTO */}
          <div className="aluguel-produto-card">
            <img src={produto.imagem} alt={produto.nome} className="aluguel-produto-img" />
            <div>
              <p className="aluguel-produto-nome">{produto.nome}</p>
              {/* Preço formatado corretamente */}
              <p className="aluguel-produto-preco">R$ {formatarMoeda(produto.preco)} {produto.tipoLocacao}</p>
            </div>
          </div>

          {/* CALENDÁRIO */}
          <div className="aluguel-calendario">
            <div className="cal-header">
              <button className="cal-nav" onClick={() => {
                if (mes === 0) { setMes(11); setAno(ano - 1); }
                else setMes(mes - 1);
              }}>‹</button>
              <span>{nomeMesCapital} de {ano}</span>
              <button className="cal-nav" onClick={() => {
                if (mes === 11) { setMes(0); setAno(ano + 1); }
                else setMes(mes + 1);
              }}>›</button>
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
              <div className="legenda-item"><span className="dot green" /> Disponível</div>
              <div className="legenda-item"><span className="dot red" /> Indisponível</div>
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
            <span className="resumo-seta">→</span>
            <div className="resumo-data-box">
              <span className="resumo-data-label">DEVOLUÇÃO</span>
              <span className="resumo-data-valor">{formatarData(fim)}</span>
            </div>
          </div>

          <div className="resumo-linha">
            <span>Diária</span>
            {/* Diária formatada sem o .00 fixo */}
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
            {/* Total formatado corretamente */}
            <span>R$ {total > 0 ? formatarMoeda(total) : "--"}</span>
          </div>

          {total > 0 && (
            <div className="resumo-caucao">
              {/* Ícone informativo e caução formatada */}
              <span title="Valor devolvido após a entrega do produto">
                <span style={{ cursor: "help" }}>ℹ️</span> Caução estimado: <strong>R$ {formatarMoeda(caucao)}</strong>
              </span>
              <p>Valor retido como garantia e liberado automaticamente após a devolução do item.</p>
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