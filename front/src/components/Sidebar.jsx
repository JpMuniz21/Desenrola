import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Filtros</h3>

      <input type="text" placeholder="Localização" />

      <select>
        <option>Todas categorias</option>
      </select>

      <button>Aplicar filtros</button>
    </aside>
  );
}