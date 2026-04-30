import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../imagem/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function handleLogin() {
    // 🔒 validação básica
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
      localStorage.setItem("userId", data.id);

      if (!res.ok) {
        // 🔥 erro vindo do backend
        throw new Error(data.mensagem || "Erro no login");
      }

      // 💾 salva dados do usuário
      localStorage.setItem("token", data.token);
      localStorage.setItem("nome", data.nome);

      alert("Login realizado com sucesso!");

      // 🚀 redireciona
      navigate("/home");

    } catch (error) {
      console.error("Erro login:", error);
      alert(error.message || "Erro ao conectar com servidor");
    }
  }

  return (
    <div className="login-container">
      <img src={logo} alt="logo" className="logo-topo" />

      <div className="login-box">
        <h2>Login</h2>

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

        <button onClick={handleLogin}>Entrar</button>

        <button
    className="btn-cadastro"
    onClick={() => navigate("/cadastro")}
  >
    Criar uma conta
  </button>

      </div>
    </div>
  );
}