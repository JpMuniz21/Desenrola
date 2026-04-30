import Navbar from "../components/Navbar";

export default function Usuario() {
  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Meu Perfil</h1>

        <div className="card">
          <p>Email: admin@gmail.com</p>
        </div>
      </div>
    </>
  );
}