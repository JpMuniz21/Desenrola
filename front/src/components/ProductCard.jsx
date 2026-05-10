import "../styles/card.css";

export default function ProductCard({ item }) {
  return (
    <div className="card">
      <img src={item.image} alt={item.title} />

      <div className="card-body">
        <h3>{item.title}</h3>

        <p className="price">
          R$ {item.price}/dia
        </p>

        <button>Alugar agora</button>
      </div>
    </div>
  );
}