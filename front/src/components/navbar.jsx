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

      {!isLogin && (
        <input
          type="text"
          placeholder="Buscar itens..."
          className="search"
        />
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

              <button className="favorite-btn">
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