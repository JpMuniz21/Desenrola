import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/login.css";
import axios from "axios";
import avatarIcon from "../assets/avatar.svg";
import groupsIcon from "../assets/groups.svg";
import heroImage from "../assets/camera.png";
import googleIcon from '../assets/google.svg';
import appleIcon from '../assets/apple.svg';
import facebookIcon from '../assets/facebook.svg';
import Toast from '../components/Toast';

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  async function handleCadastro(e) {
  e.preventDefault();

  if (!nome || !email || !senha) {
    setToast({ mensagem: "Preencha todos os campos!", tipo: "erro" });
    return;
  }

  try {
    const res = await axios.post("https://desenrola-backend.onrender.com/usuarios", { nome, email, senha });

    if (res.status === 201) {
      setToast({ mensagem: "Conta criada com sucesso!", tipo: "sucesso" });
      setTimeout(() => navigate("/login"), 1500);
    }
  } catch (error) {
    setToast({ mensagem: error.response?.data?.erro || "Erro ao cadastrar", tipo: "erro" });
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

              <div className="divider">
                <span className="divider-line" />
                <span className="divider-text">ou continue com</span>
                <span className="divider-line" />
              </div>
  
                <div className="social-login">
                  <button className="social-btn"><img src={googleIcon} alt="Google" /></button>
                  <button className="social-btn"><img src={appleIcon} alt="Apple" /></button>
                  <button className="social-btn"><img src={facebookIcon} alt="Facebook" /></button>
                </div>

              <p className="signup-link">
                Já tem uma conta? <a href="/login">Fazer Login</a>
              </p>
            </div>
          </div>

        </div>
      </div>
      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onClose={() => setToast(null)} />}
    </>
  );
}