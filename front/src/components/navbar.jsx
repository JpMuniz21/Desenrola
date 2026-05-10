import { useNavigate } from "react-router-dom";
import logo from "../imagem/logo.png"; 
import "../styles/navbar.css";
import iconChat from "../assets/Chat.svg";
import iconFavorite from "../assets/Favorite.svg";
import userIcon from "../assets/User_cicrle.svg";

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("logado");
    localStorage.removeItem("userId");
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="logo">
        <div className="logo-orange"><img src={logo} alt="Logo" /></div>
      </div>

      <input
        type="text"
        placeholder="Buscar itens..."
        className="search"
      />

      <div className="navbar-right">

      <button className="announce-btn">
        Anunciar item
      </button>

       <div className="icons">
        <button className="chat-btn">
        <img src={iconChat} alt="Chat" />
      </button>

      <button className="favorite-btn">
        <img src={iconFavorite} alt="Favoritos" />
      </button>

      <button className="user-btn">
        <img src={userIcon} alt="Usuário" />
        <span>Entrar</span>
      </button>

      </div>
    </div>
    </header>
  );
}