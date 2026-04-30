import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("logado");
    navigate("/");
  }

  return (
    <div className="navbar">
      <h2 className="logo">Desenrola</h2>

      <div className="actions">
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={() => navigate("/usuario")}>Perfil</button>
        <button onClick={logout}>Sair</button>
      </div>
    </div>
  );
}