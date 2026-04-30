import { useNavigate } from "react-router-dom";
import logo from "../imagem/logo.png"; 

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("logado");
    localStorage.removeItem("userId");
    navigate("/");
  }

  return (
    <header className="header-desenrola">
      <div className="logo-container" onClick={() => navigate("/home")} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="Desenrola" style={{ height: '50px' }} />
      </div>

      <div className="nav-buttons">
        <button onClick={() => navigate("/usuario")}>Perfil</button>
        <button onClick={logout}>Sair</button>
      </div>
    </header>
  );
}