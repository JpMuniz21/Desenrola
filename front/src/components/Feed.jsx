import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    title: "Câmera Canon T5i",
    price: 45,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
  },

  {
    id: 2,
    title: "PlayStation 5",
    price: 70,
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
  },

  {
    id: 3,
    title: "GoPro Hero 11",
    price: 60,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
  },
];

export default function Feed() {
  return (
    <main className="feed">
      <h1>Itens em destaque</h1>
      <br />
      <div className="feed-grid">
        {products.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}