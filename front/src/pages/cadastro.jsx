import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/login.css"; 

// Ícones
import avatarIcon from "../assets/avatar.svg";
import groupsIcon from "../assets/groups.svg";
import heroImage from "../assets/camera.png";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function handleCadastro(e) {
    e.preventDefault();

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/usuarios", {
        nome,
        email,
        senha
      });

      if (res.status === 201) {
        alert("Usuário cadastrado com sucesso!");
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao cadastrar");
    }
  }

  return (
    <>
      <Navbar isLogin={true} />

      <div className="login-page-wrapper">
        <div className="login-content-container">
          
          {/* LADO ESQUERDO: Hero e Vantagens */}
          <div className="login-left">
            <h1>Crie sua conta <br /> no Desenrola.</h1>
            <p className="hero-subtitle">Junte-se à maior comunidade de aluguel de nicho.</p>

            <div className="hero-features">
              <div className="hero-feature-item">
                <div className="hero-icon-box orange">
                   <img src={groupsIcon} alt="Comunidade" />
                </div>
                <p>Acesse milhares de itens exclusivos perto de você.</p>
              </div>

              <div className="hero-feature-item">
                <div className="hero-icon-box light-orange">
                   <img src={avatarIcon} alt="Perfil" />
                </div>
                <p>Ganhe dinheiro alugando seus equipamentos parados.</p>
              </div>
            </div>
          </div>

          {/* CENTRO: Imagem Hero */}
          <div className="hero-camera-wrapper">
            <img src={heroImage} alt="Hero" className="hero-img" />
          </div>

          {/* LADO DIREITO: Card de Cadastro */}
          <div className="login-right">
            <div className="login-card">
              <h2>Comece a Desenrolar!</h2>
              <p className="subtitle">Preencha os dados abaixo para criar sua conta.</p>

              <form className="login-form" onSubmit={handleCadastro}>
                <div className="input-group">
                  <label>Nome Completo</label>
                  <input 
                    type="text" 
                    placeholder="Como quer ser chamado?" 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>E-mail</label>
                  <input 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Senha</label>
                  <input 
                    type="password" 
                    placeholder="Crie uma senha segura" 
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary">Criar minha conta</button>
              </form>

              <p className="signup-link">
                Já tem uma conta? <a href="/login">Fazer Login</a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}