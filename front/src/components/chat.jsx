import { socket } from "../socket";
import { useState, useEffect } from "react";

function Chat() {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    socket.on("mensagem", (msg) => {
      setMensagens((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("mensagem");
    };
  }, []);

  const enviarMensagem = () => {
    if (!texto.trim()) return;

    const mensagem = {
      id_remetente: 1, // trocar pelo usuário logado
      id_destinatario: 2, // trocar pelo destinatário
      conteudo: texto,
    };

    socket.emit("mensagem", mensagem);

    setTexto("");
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>

      <div className="chat-mensagens">
        {mensagens.map((msg, index) => (
          <div key={index} className="mensagem">
            <strong>Usuário {msg.id_remetente}:</strong>
            <p>{msg.conteudo}</p>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite uma mensagem..."
        />

        <button onClick={enviarMensagem}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chat;