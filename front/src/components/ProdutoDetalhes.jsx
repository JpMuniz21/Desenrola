import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/produto_detalhes.css";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [recomendados, setRecomendados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const nomesMeses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [datasOcupadas, setDatasOcupadas] = useState([]);
  const [jaAlugou, setJaAlugou] = useState(false);


  function getDiasNoMes(mes, ano) {
    return new Date(ano, mes + 1, 0).getDate();
  }

  function isPassed(dia) {
    const data = new Date(anoAtual, mesAtual, dia);
    const ontem = new Date();
    ontem.setHours(0,0,0,0);
    return data < ontem;
  }

  function avancarMes() {
    if (mesAtual === 11) { setMesAtual(0); setAnoAtual(a => a + 1); }
    else setMesAtual(m => m + 1);
  }

  function voltarMes() {
    const agora = new Date();
    if (anoAtual === agora.getFullYear() && mesAtual === agora.getMonth()) return;
    if (mesAtual === 0) { setMesAtual(11); setAnoAtual(a => a - 1); }
    else setMesAtual(m => m - 1);
  }

  useEffect(() => {
  async function carregarDados() {
    setLoading(true);
    setErro(null);
    try {
      const resProduto = await fetch(`https://desenrola-backend.onrender.com/itens/${id}`);
      const resDatas = await fetch(`https://desenrola-backend.onrender.com/aluguel/datas/${id}`);
      
      if (resDatas.ok) {
        const datas = await resDatas.json();
        setDatasOcupadas(datas);
        const userId = localStorage.getItem("userId");
        if (userId) {
          const alugouEle = datas.some(d => String(d.id_usuario) === String(userId));
          setJaAlugou(alugouEle);
        }
      }

      if (!resProduto.ok) throw new Error(`Produto não encontrado (Status: ${resProduto.status})`);
      const dataProd = await resProduto.json();
      setProduto(Array.isArray(dataProd) ? dataProd[0] : dataProd);

      const resRec = await fetch(`https://desenrola-backend.onrender.com/itens/recomendados/${id}`);
      if (resRec.ok) setRecomendados(await resRec.json());
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setErro("Não foi possível carregar os detalhes deste produto.");
    } finally {
      setLoading(false);
    }
  }
  carregarDados();
}, [id]);

  const handleAlugarComNotificacao = async () => {
    try {
      fetch("https://desenrola-backend.onrender.com/aluguel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produtoId: produto.id_item || id, nomeProduto: produto.nome, preco: produto.preco, locatario: "Cliente Logado" })
      }).catch(err => console.error("Falha ao enviar dados:", err));
      navigate(`/aluguel/${id}`, { state: { produto } });
    } catch (err) {
      console.error("Erro no fluxo de aluguel:", err);
    }
  };

  function handleSelecionarDia(dia) {
  const dataSelecionada = new Date(anoAtual, mesAtual, dia);
  if (isPassed(dia)) return;

  if (!dataInicio || (dataInicio && dataFim)) {
    setDataInicio(dataSelecionada);
    setDataFim(null);
  } else {
    if (dataSelecionada < dataInicio) {
      setDataFim(dataInicio);
      setDataInicio(dataSelecionada);
    } else {
      setDataFim(dataSelecionada);
    }
  }
}

function isDiaOcupado(dia) {
  const data = new Date(anoAtual, mesAtual, dia);
  return datasOcupadas.some(d => {
    const inicio = new Date(d.data_inicio);
    const fim = new Date(d.data_fim);
    inicio.setHours(0,0,0,0);
    fim.setHours(0,0,0,0);
    return data >= inicio && data <= fim;
  });
}

  if (loading) return <p style={{ color: "#555", textAlign: "center", marginTop: "50px" }}>Carregando...</p>;

  if (erro) return (
    <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
      <h3>⚠️ Erro</h3>
      <p>{erro}</p>
      <button onClick={() => navigate('/')}>Voltar para o Feed</button>
    </div>
  );

  if (!produto) return null;

  const idVendedor = produto.id_usuario || "2";
  const nomeAnunciante = produto.anunciante || `Usuário ${idVendedor}`;
  const userIdLogado = localStorage.getItem("userId");
  const isDono = String(userIdLogado) === String(produto.id_usuario);

  return (
    <div className="detalhe-page-bg">
      <Navbar />
      <main className="detalhe-main-container">

        <button
          onClick={() => navigate("/")}
          className="btn-voltar-passo"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', fontSize: '15px', fontWeight: '600', cursor: 'pointer', padding: '8px 0', marginBottom: '16px', transition: 'color 0.2s ease', alignSelf: 'flex-start' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#f97316'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Voltar
        </button>

        <div className="detalhe-content-wrapper">
          <div className="detalhe-card-principal">
            <div className="detalhe-card-inner">
              <div className="main-image-box">
                <img src={produto.imagem} alt={produto.nome} />
                <button className="nav-arrow left-arrow">‹</button>
                <button className="nav-arrow right-arrow">›</button>
                <div className="image-counter">01 / 01</div>
              </div>

              <div className="detalhe-info-box">
                <span className="badge-disponivel">● Disponível</span>
{jaAlugou && (
  <span style={{ 
    display: 'inline-block', 
    background: '#f97316', 
    color: 'white', 
    padding: '4px 12px', 
    borderRadius: '20px', 
    fontSize: '12px', 
    fontWeight: '600',
    marginLeft: '8px'
  }}>
    ✓ Você já alugou este item
  </span>
)}
                <h1 className="produto-titulo">{produto.nome}</h1>
                <h2 className="produto-preco">R$ {produto.preco}/{produto.periodo || "dia"}</h2>
                <p className="produto-descricao">{produto.descricao || "Sem descrição informada."}</p>

                <div className="anunciante-box" 
  onClick={() => navigate(`/perfil/${produto.id_usuario}`)}
  style={{ cursor: 'pointer' }}
>
                  <div className="anunciante-avatar">
  {produto.foto_anunciante ? (
    <img 
      src={produto.foto_anunciante} 
      alt={nomeAnunciante}
      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
    />
  ) : (
    nomeAnunciante.substring(0, 2).toUpperCase()
  )}
</div>
                  <div className="anunciante-info">
                    <span className="anunciante-nome">{nomeAnunciante}</span>
                    <span className="anunciante-sub">Anunciante · desde 2024</span>
                  </div>
                  <div className="anunciante-rating">★ 5.0</div>
                </div>

                <div className="action-buttons-group">
  <button
    className="btn-action-chat"
    onClick={() => navigate("/chat", { state: { vendedor: { id: idVendedor, nome: nomeAnunciante } } })}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    Chat
  </button>

  {isDono ? (
    <button
      className="btn-action-alugue"
      onClick={() => navigate(`/editar-item/${produto.id_item}`)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      Editar item
    </button>
  ) : (
    <button
      className="btn-action-alugue"
      onClick={handleAlugarComNotificacao}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <polyline points="10 16 12 18 16 14"></polyline>
      </svg>
      Alugue!
    </button>
  )}
</div>
              </div>
            </div>
          </div>

          <section className="detalhe-right-side">
            <div className="calendar-card">
              <div className="calendar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={voltarMes} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#f97316' }}>‹</button>
                  <span>{nomesMeses[mesAtual]} {anoAtual}</span>
                <button onClick={avancarMes} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#f97316' }}>›</button>
              </div>
            <div className="calendar-days-grid">
              {Array.from({ length: getDiasNoMes(mesAtual, anoAtual) }, (_, i) => (
  <div
    key={i + 1}
    className={`cal-day-item ${isPassed(i + 1) ? 'day-past' : isDiaOcupado(i + 1) ? 'day-red' : 'day-green'}`}
    onClick={() => handleSelecionarDia(i + 1)}
    style={{ cursor: isPassed(i + 1) ? 'not-allowed' : 'pointer' }}
  >
    {i + 1}
  </div>
))}
  </div>
</div>
            <div className="reviews-section">
              <h3 className="reviews-titulo">Avaliações:</h3>
              <div className="reviews-scroll">
                <div className="review-card">
                  <strong>Henrique (★ 5.0)</strong>
                  <p>Equipamento impecável! O dono foi super gente boa.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="recomendados-section">
          <h2 className="recomendados-titulo">Produtos em: <em>Fortaleza, Ceará</em></h2>
          <div className="recomendados-lista">
            {recomendados.map((item) => (
              <div key={item.id_item} className="rec-card" onClick={() => navigate(`/produto/${item.id_item}`)}>
                <img src={item.imagem} alt={item.nome} className="rec-img" />
                <div className="rec-info">
                  <div className="rec-header">
                    <span className="rec-nome">{item.nome}</span>
                    <span className="rec-preco">R$ {item.preco}/{item.periodo || "dia"}</span>
                  </div>
                  <p className="rec-descricao">{item.descricao || "Disponível para aluguel imediato."}</p>
                  <div className="rec-badges">
                    <span className="badge-condicao">Boa</span>
                    <span className="badge-disponivel">● Disponível</span>
                  </div>
                </div>
                <button className="rec-favorito" onClick={(e) => e.stopPropagation()}>♡</button>
              </div>
            ))}
            {recomendados.length === 0 && <p>Nenhuma recomendação disponível.</p>}
          </div>
        </section>

      </main>
    </div>
  );
}