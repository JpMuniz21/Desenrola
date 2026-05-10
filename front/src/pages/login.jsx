import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../imagem/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

async function handleLogin() {
    // validação básica
    if (!email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // erro vindo do backend
        throw new Error(data.mensagem || "Erro no login");
      }

      // salva dados do usuário apenas SE o login der certo
      localStorage.setItem("userId", data.id);
      localStorage.setItem("token", data.token);
      localStorage.setItem("nome", data.nome);
      localStorage.setItem("logado", "true"); // Essa é a chave que segura o usuário na Home

      alert("Login realizado com sucesso!");

      // redireciona
      navigate("/home");

    } catch (error) {
      console.error("Erro login:", error);
      alert(error.message || "Erro ao conectar com servidor");
    }
  }


  return (
    <div className="login-container">
      <img src={logo} alt="logo" className="logo-grande" />

      <div className="login-box">
        <h2>Entre e comece a Desenrolar!</h2>

        <div className="linha"><hr/></div>

        <input
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

        <button className="btn-cadastro" onClick={handleLogin}>Entrar</button>

        <button
    className="btn-cadastro"
    onClick={() => navigate("/cadastro")}
  >
    Criar uma conta
  </button>

      {/* Botão de login com Facebook */}
        <button className="facebook-btn">
          <svg viewBox="0 0 24 24">
            <path fill="white" d="M22 12a10 10 0 1 0-11.5 9.87v-6.99h-2.2v-2.88h2.2V9.41c0-2.17 1.29-3.37 3.26-3.37.94 0 1.92.17 1.92.17v2.11h-1.08c-1.06 0-1.39.66-1.39 1.34v1.61h2.37l-.38 2.88h-1.99v6.99A10 10 0 0 0 22 12z"/>
          </svg>
          </button>
        </div>

        <button className="btn-cadastro" onClick={() => navigate("/home")}>{/*handleLogin*/}Entrar</button>{/*desabilitei temporariamente o login*/}

        <button className="btn-cadastro"onClick={() => navigate("/cadastro")}>Criar uma conta</button>

      </div>
  );
}