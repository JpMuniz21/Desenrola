import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import '../styles/login.css';
import Navbar from '../components/navbar';
import googleIcon from '../assets/google.svg';
import appleIcon from '../assets/apple.svg';
import facebookIcon from '../assets/facebook.svg';
import avatarIcon from '../assets/avatar.svg';
import groupsIcon from '../assets/groups.svg'; 
import eyeIcon from '../assets/eye.svg'; 
import eyeOffIcon from '../assets/eye-off.svg'; 
import shieldIcon from '../assets/shield.svg';
import heroCameraImage from '../assets/camera.png';
import heroDroneImage from '../assets/drone.png';
import heroVitrolaImage from '../assets/vitrola.png';
import heroFoneImage from '../assets/fone.png';

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [imagemAtivaIndex, setImagemAtivaIndex] = useState(0);
  const CARROSSEL_IMAGENS = [
    heroCameraImage,
    heroDroneImage,
    heroVitrolaImage,
    heroFoneImage
  ];

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtivaIndex((prevIndex) => (prevIndex + 1) % CARROSSEL_IMAGENS.length);
    }, 3000);

    return () => clearInterval(intervalo); 
  }, [CARROSSEL_IMAGENS.length]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🚀 O BOTÃO FOI CLICADO!");

    try {
      const response = await axios.post("http://localhost:3001/usuarios/login", { email, senha });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("nome", response.data.nome);
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("logado", "true");

      alert(`Bem-vindo, ${response.data.nome}!`);
      navigate("/"); 
    } catch (error) {
      const mensagemErro = error.response?.data?.mensagem || "Erro ao conectar com o servidor";
      alert(mensagemErro);
    }
  };

  return (
    <>
      <Navbar isLogin={true} />

      <div className="login-page-wrapper">
        <div className="login-content-container">
          
          <div className="login-left">
            <h1>Alugue itens <br /> de nicho.</h1>
            <p className="hero-subtitle">Para usar. Para criar. Para compartilhar.</p>

            <div className="hero-features">
              <div className="hero-feature-item">
                <div className="hero-icon-box orange">
                    <img src={groupsIcon} alt="Comunidade" />
                </div>
                <p>Alugue itens incríveis de outras pessoas.</p>
              </div>

              <div className="hero-feature-item">
                <div className="hero-icon-box light-orange">
                    <img src={avatarIcon} alt="Usuários" />
                </div>
                <p>Anuncie seus itens e tenha uma renda extra.</p>
              </div>

              <div className="hero-secure-card">
                <img src={shieldIcon} alt="Escudo" className="shield-img" />
                <div>
                  <strong>Seguro, prático e confiável.</strong>
                  <span>Comunicação segura, pagamentos protegidos e suporte sempre que precisar.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-camera-wrapper carousel-container">
  <div 
    className="carousel-track" 
    style={{ transform: `translateX(-${imagemAtivaIndex * 100}%)` }}
  >
    {CARROSSEL_IMAGENS.map((img, index) => (
      <div className="carousel-slide" key={index}>
        <img src={img} alt={`Item ${index}`} className="hero-img" />
      </div>
    ))}
  </div>
</div>

          <div className="login-right">
            <div className="login-card">
              <h2>Bem-vindo(a) ao Desenrola!</h2>
              <p className="subtitle">Entre para alugar ou anunciar itens de nicho.</p>

              <form className="login-form" onSubmit={handleLogin}>
                <div className="input-group">
                  <label>E-mail</label>
                  <input 
                    type="email" 
                    placeholder="Insira seu e-mail" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Senha</label>
                    <a href="/recuperar" className="forgot-password">Esqueceu a senha?</a>
                  </div>
                  <div className="password-wrapper">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Insira sua senha" 
                      required
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <img src={showPassword ? eyeOffIcon : eyeIcon} alt="Ver senha" />
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary">Entrar</button>
              </form>

              <div className="divider">
                <span className="divider-line" />
                <span className="divider-text">Ou continue com</span>
                <span className="divider-line" />
              </div>

              <div className="social-login">
                <button className="social-btn"><img src={googleIcon} alt="Google" /></button>
                <button className="social-btn"><img src={appleIcon} alt="Apple" /></button>
                <button className="social-btn"><img src={facebookIcon} alt="Facebook" /></button>
              </div>

              <p className="signup-link">
                Não tem conta? <a href="/cadastro">Cadastre-se</a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </> 
  );
}