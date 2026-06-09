import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg"; 
import "../styles/navbar.css";
import iconChat from "../assets/Chat.svg";
import iconFavorite from "../assets/Favorite.svg";
import userIcon from "../assets/User_cicrle.svg";

export default function Navbar({ isLogin = false }) {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("logado");
    const userId = localStorage.getItem("userId");
    if (logged && userId) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);

  return (
    <header className="navbar">
      <div className="logo">
        <div className="logo-orange">
          <img 
            src={logo} 
            alt="Logo" 
            onClick={() => navigate("/")} 
            style={{ cursor: 'pointer' }} 
          />
        </div>
      </div>

      {/* --- INPUT DE BUSCA ATUALIZADO COM ÍCONE SVG DE LUPA --- */}
      {!isLogin && (
        <div className="navbar-search-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          
          {/* Ícone Vetorial da Lupa */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#94a3b8" /* Cinza sutil combinando com o placeholder */
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>

          {/* Seu input original com o recuo (padding-left) para o texto não sobrescrever a lupa */}
          <input
            type="text"
            placeholder="Buscar itens..."
            className="search"
            style={{ paddingLeft: '38px' }} 
          />
        </div>
      )}

      <div className="navbar-right">
        {isLogin ? (
          <button onClick={() => navigate("/")} className="btn-text">
            Voltar para o início
          </button>
        ) : (
          <>
            <button 
              className="announce-btn" 
              onClick={() => navigate("/anunciar")}
            >
              Anunciar item
            </button>

            <div className="icons">
              <button className="chat-btn">
                <img src={iconChat} alt="Chat" />
              </button>

              <button className="favorite-btn" onClick={() => navigate("/favoritos")}>
                <img src={iconFavorite} alt="Favoritos" />
              </button>

              {isAuth ? (
                <button className="user-btn" onClick={() => navigate("/usuario")}>
                  <img src={userIcon} alt="Usuário" />
                  <span>Minha Conta</span>
                </button>
              ) : (
                <button className="user-btn" onClick={() => navigate("/login")}>
                  <img src={userIcon} alt="Usuário" />
                  <span>Entrar</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}