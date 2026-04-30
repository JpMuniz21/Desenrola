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
      const res = await fetch("http://localhost:3000/usuarios", {
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
      <img src={logo} alt="logo" className="logo-topo" />

      <div className="login-box">
        <h2>Cadastro</h2>

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

        <button onClick={handleCadastro}>Cadastrar</button>
      </div>
    </div>
  );
}