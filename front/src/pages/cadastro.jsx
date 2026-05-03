import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../imagem/logo.png";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function handleCadastro() {
    if (!nome || !email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.erro || "Erro ao cadastrar");
      }

      alert("Cadastro realizado com sucesso!");

      // volta pro login
      navigate("/");

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className="login-container">
      <img src={logo} alt="logo" className="logo-grande" />

      <div className="login-box">
        <h2>Cadastre-se e comece a Desenrolar!</h2>

        <div className="linha"><hr/></div>

        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <h5>ou conecte-se com:</h5>

        <div className="linha"><hr/></div>

        <div className="social-buttons">
          {/* Botão de login com Google apenas visual, sem funcionalidade */}
        <button className="gsi-material-button">
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            </div>
          </div>
        </button>

      {/* Botão de login com Apple */}
        <button className="apple-btn">
          <svg viewBox="0 0 24 24">
            <path fill="white" d="M16.365 1.43c0 1.14-.465 2.19-1.2 2.94-.78.78-2.04 1.38-3.18 1.29-.15-1.08.42-2.22 1.17-3 .78-.78 2.13-1.35 3.21-1.23zM21.4 17.1c-.9 2.01-2.01 3.99-3.72 4.02-1.62.03-2.16-1.02-4.05-1.02s-2.49 1-4.05 1.05c-1.62.06-2.85-1.62-3.75-3.63-1.8-3.9-.33-9.72 2.82-9.87 1.56-.06 3.03 1.08 4.05 1.08 1.02 0 2.82-1.35 4.74-1.14.81.03 3.09.33 4.56 2.46-.12.09-2.73 1.59-2.7 4.74.03 3.78 3.33 5.04 3.36 5.07z"/>
          </svg>
          </button>

      {/* Botão de login com Facebook */}
        <button className="facebook-btn">
          <svg viewBox="0 0 24 24">
            <path fill="white" d="M22 12a10 10 0 1 0-11.5 9.87v-6.99h-2.2v-2.88h2.2V9.41c0-2.17 1.29-3.37 3.26-3.37.94 0 1.92.17 1.92.17v2.11h-1.08c-1.06 0-1.39.66-1.39 1.34v1.61h2.37l-.38 2.88h-1.99v6.99A10 10 0 0 0 22 12z"/>
          </svg>
          </button>
        </div>

        <button className="btn-cadastro" onClick={handleCadastro}>Cadastrar</button>

      </div>
    </div>
  );
}