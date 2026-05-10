import "../styles/card.css";

export default function ProductCard({
  item,
  editandoId,
  setEditandoId,
  novoTitulo,
  setNovoTitulo,
  novoPreco,
  setNovoPreco,
  novoPeriodo,
  setNovoPeriodo,
  editarItem,
  deletar,
}) {
  return (
    <div className="card">
      <img
        src={`http://localhost:3001/uploads/${item.imagem}`}
        alt={item.titulo}
        className="card-img"
      />

      <div className="card-body">
        <h3>{item.titulo}</h3>

        <p className="price">
          R$ {item.preco} / {item.periodo}
        </p>

        {editandoId === item.id ? (
          <div className="edit-box">
            <input
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
            />

            <input
              type="number"
              value={novoPreco}
              onChange={(e) => setNovoPreco(e.target.value)}
            />

            <select
              value={novoPeriodo}
              onChange={(e) => setNovoPeriodo(e.target.value)}
            >
              <option value="dia">por dia</option>
              <option value="mês">por mês</option>
            </select>

            <button onClick={() => editarItem(item.id)}>
              Salvar
            </button>
          </div>
        ) : (
          <div className="actions">
            <button
              onClick={() => {
                setEditandoId(item.id);
                setNovoTitulo(item.titulo);
                setNovoPreco(item.preco);
                setNovoPeriodo(item.periodo);
              }}
            >
              Editar
            </button>

            <button onClick={() => deletar(item.id)}>
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}