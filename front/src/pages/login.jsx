import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../imagem/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  function handleLogin() {
    if (email === "admin@gmail.com" && senha === "123") {
      localStorage.setItem("logado", "true");
      navigate("/home");
    } else {
      alert("Credenciais inválidas");
    }
  }

  return (
    <div className="login-container">

  <img src={logo} alt="logo" className="logo-topo" />

  <div className="login-box">
    <h2>Login</h2>

    <input
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Senha"
      onChange={(e) => setSenha(e.target.value)}
    />

    <button onClick={handleLogin}>Entrar</button>
  </div>

</div>
  );
}