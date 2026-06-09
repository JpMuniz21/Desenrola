import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { socket } from "../socket";
import Navbar from "../components/navbar";
import "../styles/chat.css";

function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const mensagensEndRef = useRef(null);
  const meuUsuarioId = localStorage.getItem("userId") || "1";

  // Simulação de uma lista de conversas ativas no seu banco
  const [conversas, setConversas] = useState([
    { id_destinatario: "2", nome: "Usuário 2", ultimaMensagem: "Equipamento disponível!" },
    { id_destinatario: "3", nome: "Usuário 3", ultimaMensagem: "Vou fazer o envio amanhã." },
    { id_destinatario: "4", nome: "Usuário 4", ultimaMensagem: "Mandei o contrato de aluguel." },
    { id_destinatario: "5", nome: "Usuário 5", ultimaMensagem: "Envie uma mensagem!" },
  ]);

  const [conversaAtiva, setConversaAtiva] = useState(conversas[0]);
  
  // 💡 Inicializado com os remetentes corrigidos para simular o diálogo real no primeiro load
  const [mensagens, setMensagens] = useState([
    { id_remetente: meuUsuarioId, id_destinatario: "2", conteudo: "Olá! O equipamento ainda está disponível?" },
    { id_remetente: "2", id_destinatario: meuUsuarioId, conteudo: "Equipamento disponível!" }
  ]);
  
  const [texto, setTexto] = useState("");

  // Se veio da tela de produto, joga o vendedor como chat ativo
  useEffect(() => {
    const dadosVendedor = location.state?.vendedor;
    
    if (dadosVendedor) {
      const novaConversa = {
        id_destinatario: String(dadosVendedor.id),
        nome: dadosVendedor.nome || `Usuário ${dadosVendedor.id}`,
        ultimaMensagem: "Iniciando nova conversa..."
      };

      setConversas((prev) => {
        const jaExiste = prev.find(c => String(c.id_destinatario) === String(dadosVendedor.id));
        if (jaExiste) return prev;
        return [novaConversa, ...prev];
      });

      setConversaAtiva(novaConversa);
      setMensagens([]); // Nova conversa vinda de produto começa limpa esperando interação
    }
  }, [location.state, meuUsuarioId]);

  useEffect(() => {
    const usuarioLogado = localStorage.getItem("userId");
    if (!usuarioLogado) {
      alert("Você precisa estar logado para acessar o chat! 🛡️");
      navigate("/login");
      return;
    }

    socket.on("mensagem", (msg) => {
      if (String(msg.id_remetente) === String(conversaAtiva.id_destinatario) || 
          String(msg.id_remetente) === String(meuUsuarioId)) {
        setMensagens((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("mensagem");
    };
  }, [navigate, conversaAtiva, meuUsuarioId]);

  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  const enviarMensagem = (e) => {
    if (e) e.preventDefault();
    if (!texto.trim()) return;

    const novaMensagem = {
      id_remetente: meuUsuarioId,
      id_destinatario: conversaAtiva.id_destinatario,
      conteudo: texto,
    };

    socket.emit("mensagem", novaMensagem);

    setMensagens((prev) => [...prev, novaMensagem]);
    setTexto("");
  };

  // 💡 Função gerenciadora com os remetentes corrigidos para separar Locatário e Locador
  const handleTrocarChat = (chat) => {
    setConversaAtiva(chat);
    
    if (chat.id_destinatario === "2") {
      setMensagens([
        { id_remetente: meuUsuarioId, id_destinatario: "2", conteudo: "Olá! O equipamento ainda está disponível?" },
        { id_remetente: "2", id_destinatario: meuUsuarioId, conteudo: "Equipamento disponível!" }
      ]);
    } else if (chat.id_destinatario === "3") {
      setMensagens([
        { id_remetente: "3", id_destinatario: meuUsuarioId, conteudo: "Vou fazer o envio amanhã para você." }
      ]);
    } else if (chat.id_destinatario === "4") {
      setMensagens([
        { id_remetente: "4", id_destinatario: meuUsuarioId, conteudo: "Já revisei os termos. Mandei o contrato de aluguel." }
      ]);
    } else {
      // O Usuário 5 (Empty State) ou novos chats vindos de produtos iniciam zerados
      setMensagens([]);
    }
  };

  return (
    <div className="chat-page-bg">
      <Navbar />
      <main className="chat-main-container">
        
        <button 
          onClick={() => window.history.state && window.history.state.idx > 0 ? navigate(-1) : navigate("/")}
          className="btn-voltar-passo"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', fontSize: '15px', fontWeight: '600', cursor: 'pointer', padding: '8px 0', marginBottom: '12px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Voltar
        </button>

        <div className="chat-wrapper-card">
          
          {/* BARRA LATERAL: LISTA DE CHATS */}
          <aside className="chat-sidebar">
            <h3 className="sidebar-titulo">Mensagens</h3>
            <div className="chat-lista-conversas">
              {conversas.map((chat) => (
                <div 
                  key={chat.id_destinatario} 
                  className={`conversa-item ${conversaAtiva.id_destinatario === chat.id_destinatario ? "ativa" : ""}`}
                  onClick={() => handleTrocarChat(chat)}
                >
                  <div className="chat-avatar-mini">{chat.nome.charAt(0).toUpperCase()}</div>
                  <div className="conversa-info">
                    <h4>{chat.nome}</h4>
                    <p>{chat.ultimaMensagem}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* JANELA ATIVA DE CHAT (DIREITA) */}
          <section className="chat-window-side">
            <div className="chat-header-user">
              <div className="chat-avatar-mini">{conversaAtiva.nome.charAt(0).toUpperCase()}</div>
              <div>
                <h3>{conversaAtiva.nome}</h3>
                <span>● Online</span>
              </div>
            </div>

            <div className="chat-mensagens-box">
              {mensagens.length === 0 ? (
                <div className="chat-vazio-placeholder">
                  <p>Combine os detalhes da entrega com <strong>{conversaAtiva.nome}</strong>! 🛡️</p>
                </div>
              ) : (
                mensagens.map((msg, index) => {
                  const ehMinha = String(msg.id_remetente) === String(meuUsuarioId);
                  return (
                    <div key={index} className={`chat-message-row ${ehMinha ? "minha-linha" : "outro-linha"}`}>
                      <div className={`chat-bubble ${ehMinha ? "bubble-me" : "bubble-other"}`}>
                        <p>{msg.conteudo}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={mensagensEndRef} />
            </div>

            <form className="chat-input-bar" onSubmit={enviarMensagem}>
              <input
                type="text"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder={`Mensagem para ${conversaAtiva.nome}...`}
                className="chat-field-input"
              />
              <button type="submit" className="chat-btn-enviar" disabled={!texto.trim()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </section>

        </div>
      </main>
    </div>
  );
}

export default Chat;